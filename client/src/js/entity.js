import Component from './component.js';

export default class Entity {

  constructor ( id, components, position, quaternion ) {

      this.id = id
      this.components = components
      this.position = position ? position : false
      this.quaternion = quaternion ? quaternion : false
      this.mesh = null
      this.boundingRadius = 10000 // set in init()
      this.componentsByProp = {} // arrays are defined here with key of prop
      this.compsByFaceIndex = [] // possibly deprecated
      this.allComponents = []
      this.combinedComponents = []
      this.voxel = this.position ? [ Math.floor(this.position[0] / 928000), 0, Math.floor(this.position[2] / 807360) ] : [ 0, 0, 0 ] // vertical axis disabled for now
      this.lastFace = 0
      this._compPos = new THREE.Vector3()

  }

  update ( position, quaternion = false, components, componentIndex, props, state ) {

    let component = null

    if ( !! componentIndex ) {

      component = this.components[ componentIndex ]

      if ( !! props ) {

        component.props = Object.assign({}, component.props, props)

      }

      if ( !! state ) {

        component.props = Object.assign({}, component.props, props)

      }

    }

    if ( !! components ) {

      this.components = components
      this.init( this.anchor, { updateWorkers: true } )

    }

    if ( !! position ) {

      this.position = position
      this.mesh.position.fromArray( position )

    }

    if ( !!quaternion ) {

      this.quaternion = quaternion
      this.mesh.quaternion.fromArray( quaternion )
      
    }

    this.mesh.updateMatrix()

  }

  init ( parent, config, callback ) {

    var mesh = new THREE.Object3D(),
        base = new THREE.Geometry(),
        three = window.three,
        world = three.world,
        systems = world.systems,
        mobile = world.mobile,
        ncomps = this.components.length,
        nonMerged = [],
        dimensions = [0, 0, 0],
        compMesh = null,
        compGeom = null,
        compRadius = 10000,
        materials = [],
        addToOctree = true,
        workerUpdate = "",
        comp = null,
        face = 0,
        faces = null,
        toFace = 0,
        c = 0,
        s = 0

    this.lastFace = 0

    if ( this.mesh != null ) {

      world.octree.remove( this.mesh )

      if ( this.anchor ) {

        this.anchor.remove( this.mesh )

      } else {

        three.scene.remove( this.mesh )

      }
      
      workerUpdate = !! config && config.updateWorkers ? "update" : workerUpdate

    } else {

      workerUpdate = !! config && config.updateWorkers ? "add" : workerUpdate

    }

    this.anchor = parent 

    while ( c < ncomps ) {

        comp = new Component( this.components[ c ], this, systems, {mobile} ) // use simpler shading for mobile gpus
        
        if ( comp.props.noRaycast === true ) { // this should be checked in a system
          addToOctree = false
        }

        compMesh = comp.mesh
        compMesh.geometry.computeBoundingSphere() // check bounding radius
        compRadius = compMesh.geometry.boundingSphere.radius 
        dimensions = [Math.max(dimensions[0], Math.abs(compMesh.position.x)+compRadius),
                      Math.max(dimensions[1], Math.abs(compMesh.position.y)+compRadius), 
                      Math.max(dimensions[2], Math.abs(compMesh.position.z)+compRadius)]

        if ( comp.props.geometry ) {

          faces = compMesh.geometry.faces
          face = faces.length-1
          toFace = this.lastFace + face
          this.compsByFaceIndex.push({
            component: comp,
            from: this.lastFace,
            to: toFace
          })  
          this.lastFace = toFace
          
        }

        if ( comp.merged ) {
          
          this.combinedComponents.push( comp )
          materials.push(compMesh.material)
          compMesh.updateMatrix()

          while ( face > -1 ) {

              faces[ face ].materialIndex = s
              face --
              
          }

          base.merge( compMesh.geometry, compMesh.matrix )
          s ++

        } else if ( !comp.detached ) {

          nonMerged.push( comp.mesh )
          
        }

        this.allComponents.push( comp )
        c ++

    }

    if ( this.componentsByProp.terrain ) { //  console.log("terrain; not adding to octree / for raycasting", this.componentsByProp)
     
      addToOctree = false

    }

    this.boundingRadius = Math.max( dimensions[0], dimensions[1], dimensions[2] )
    this.boundingBox = dimensions

    if ( !! workerUpdate ) {

      let entityData = {
            id: this.id,
            components: this.components,
            position: this.position,
            quaternion: this.quaternion,
            boundingRadius: this.boundingRadius,
            boundingBox: this.boundingBox
          },
          message = ""

      if ( workerUpdate == "add" ) {

        message = JSON.stringify({
          command: "add entity",
          data: {
            coords: this.voxel,
            entity: entityData
          }
        })

        systems.staticCollisions.worker.postMessage( message )
        systems.dynamicCollisions.worker.postMessage( message )

      } else if ( workerUpdate == "update") {
        
        message = JSON.stringify({
          command: "update entity",
          data: { 
            entityId: this.id,
            coords: this.voxel,
            entity: entityData
          }
        })

        systems.staticCollisions.worker.postMessage( message )
        systems.dynamicCollisions.worker.postMessage( message )

      }

    }

    if ( s > 0 ) {

      mesh = new THREE.Mesh( base, new THREE.MultiMaterial( materials ) )

    } else {

      mesh = nonMerged[ 0 ] // maybe nest inside of Object3D ?

    }

    s = 1

    while ( s < nonMerged.length ) {

        mesh.add( nonMerged[ s ] )
        s ++

    }

    if ( !! this.quaternion && this.components.length == 1 ) {

        mesh.quaternion.set(this.quaternion[0], this.quaternion[1], this.quaternion[2], this.quaternion[3])

    }

    !! this.position && mesh.position.set(this.position[0], this.position[1], this.position[2])

    mesh.userData = { 

      entity: this,
      compsByFaceIndex: this.compsByFaceIndex

    }

    addToOctree && world.octree.add( mesh )

    parent.add( mesh )
    this.mesh = mesh
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()
    !! callback && callback( this )
    return this

  }

  getClosestComponent( position, recursive = true ) {
 
    let compPos = this._compPos, 
        entMesh = this.mesh,
        worldCompPos = null,
        distance = 200000,
        newDist = 0,
        closest = null,
        closestSubComp = null;

    entMesh.updateMatrixWorld()
    this.allComponents.map( component => {

      if ( !! component.merged ) {

        return false

      }

      compPos.setFromMatrixPosition( component.mesh.matrixWorld ) // get world position
      newDist = compPos.distanceTo( position )

      if ( newDist < distance ) { 

        distance = newDist
        closest = component

      }

    })

    if ( !!!closest ) {

      distance = 200000
      newDist = 0
      this.combinedComponents.map( component => {

        compPos.fromArray( component.data.position )
        worldCompPos = entMesh.localToWorld( compPos )
        newDist = worldCompPos.distanceTo( position ) //console.log("compPos", compPos, "worldCompPos", worldCompPos, "newDist", newDist)
        
        if ( newDist < distance ) {  

          distance = newDist
          closest = component

        }

      })

    }

    if ( !!closest && recursive && closest.components.length > 1 ) {

      closestSubComp = component.getClosestComponent( position )
      component = !!closestSubComp ? closestSubComp : component

    }

    return closest

  }

  getComponentByFace ( face ) {
    
    let component = false

    this.compsByFaceIndex.forEach((comp) => {

      if ( face >= comp.from && face <= comp.to ) {

        component = comp.component

      } 

    })

    return component

  }

  getVoxel () {

    let position = this.mesh.position

    return [ Math.floor( position.z / 928000 ), 0, Math.floor( position.z / 807360 ) ]

  }

}
