import { GRID_SIZE } from './config'
import Component from './component'

export default class Entity {

  constructor ( id, components, position, quaternion, voxel ) {

      let world = window.three.world

      if ( id == -1 ) {

        world && world.systems.assets.autoEntityID()

      }

      this.id = id
      this.components = components || []
      this.position = position ? position : false
      this.quaternion = quaternion ? quaternion : false
      this.mesh = null
      this.boundingRadius = 10000 // set in init()
      this.componentsByProp = {} // arrays are defined here with key of prop
      this.compsByFaceIndex = [] // possibly deprecated
      this.allComponents = []
      this.combinedComponents = []
      this.voxel = voxel ? voxel : this.getVoxel( true )
      this.lastFace = 0
      this._compPos = new THREE.Vector3()
      
  }

  update ( position, quaternion = false, components, component, componentPath ) {

    if ( !! componentPath )

      this.updateComponentAtPath( component, componentPath, 0, components )
     

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

    let mesh = new THREE.Object3D(),
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
        updateVoxel = false,
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

      this.removeFromVoxel( this.voxel )
      
      workerUpdate = !! config && config.updateWorkers ? "update" : workerUpdate

    } else {

      workerUpdate = !! config && config.updateWorkers ? "add" : workerUpdate

    }

    this.anchor = parent 
    
    if ( this.components.length == 0 ) {
      console.warn("Entity must have at least 1 component")
      return false
    }

    while ( c < ncomps ) {

        comp = new Component( this.components[ c ], this, systems, { mobile, index: c } ) // use simpler shading for mobile gpus
        compMesh = comp.mesh
        compMesh.geometry.computeBoundingSphere() // check bounding radius
        compRadius = compMesh.geometry.boundingSphere.radius 
        dimensions = [
          Math.max( dimensions[ 0 ], Math.abs( compMesh.position.x ) + compRadius ),
          Math.max( dimensions[ 1 ], Math.abs( compMesh.position.y ) + compRadius ), 
          Math.max( dimensions[ 2 ], Math.abs( compMesh.position.z ) + compRadius )
        ]

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

    addToOctree = this.componentsByProp.terrain != true && this.componentsByProp.noRaycast != true
    this.boundingRadius = Math.max( dimensions[0], dimensions[1], dimensions[2] )
    this.boundingBox = dimensions
    !! workerUpdate && this.updateWorkers( workerUpdate, systems )

    if ( s > 0 ) {

      mesh = new THREE.Mesh( base, materials )

    } else {

      mesh = nonMerged[ 0 ] // maybe nest inside of Object3D ?

    }

    if ( world.shadows > 0 ) {

      mesh.castShadow = true
      mesh.receiveShadow = true

    }

    s = 1

    while ( s < nonMerged.length ) {

        mesh.add( nonMerged[ s ] )
        s ++

    }

    if ( !! this.quaternion && this.components.length == 1 )

        mesh.quaternion.fromArray( this.quaternion )


    !! this.position && mesh.position.fromArray( this.position )

    mesh.userData = { 

      entity: this,
      compsByFaceIndex: this.compsByFaceIndex

    }

    addToOctree && world.octree.add( mesh )

    parent.add( mesh )
    this.mesh = mesh
    addToOctree && this.addToVoxel( this.voxel, mesh )
    
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()
    !! callback && callback( this )
    return this

  }

  getVoxel ( initial ) {

    let position = null,
        coords = null
    
    if ( initial ) {

      position = this.mesh != null ? this.mesh.position.toArray() : this.position
      coords = [Math.floor( position[ 0 ] / GRID_SIZE[ 0 ] ), 0, Math.floor( position[ 2 ] / GRID_SIZE[ 2 ] )]

    } else {

      coords = this.voxel

    }        

    this.voxel = coords

    return coords

  }

  addToVoxel ( coords, mesh ) {
    
        this.getVoxelForUpdate( coords, addTo => { 
    
          addTo.meshes.push( mesh )
    
        })
  }

  removeFromVoxel ( coords, mesh ) {

    let removeFrom = this.getVoxelForUpdate( coords )

    removeFrom.meshes.splice( removeFrom.meshes.indexOf( mesh ), 1 )

  }

  getVoxelForUpdate ( coords, callback ) {

    let world = window.three.world,
        thisEnt = this,
        systems = world.systems,
        terrain = systems.terrain,
        voxel = terrain.voxels[ coords.join(".") ]

    if ( !!! voxel) { console.warn("voxel not loaded")
    
     voxel = terrain.loadVoxel( coords, callback )

    } else if (typeof voxel != 'boolean' ) {

      callback && callback( voxel )

    } else {

      setTimeout( ()=> {

        let voxel = terrain.voxels[ coords.join(".") ]

        if ( voxel && typeof voxel != 'boolean' ) {

          callback( voxel )

        } else {

          terrain.loadVoxel( coords, callback )

        }

      }, 600)

    }

    return voxel

  }

  getComponentByPath ( path, pathIndex, components = false ) {

    let foundComponent = null

    if ( components == false )

      components = this.components

    if ( pathIndex < path.length ) {
      
      foundComponent = this.getComponentByPath( components[ path[ pathIndex ] ].components, path, pathIndex + 1 )

    } else {
            
      foundComponent = components[ path[ pathIndex ] ]

    }

  }

  updateComponentAtPath ( component, path, pathIndex, components = false ) {
    
    if ( components == false )
      
      components = this.components

    if ( pathIndex < path.length ) {

      this.updateComponentAtPath( component, components[ path[ pathIndex ] ].components, path, pathIndex + 1 )

    } else {

      components[ path[ pathIndex ] ] = component

    }   
    
  }

  updateWorkers ( mode, systems ) {

    let entityData = {
        id: this.id,
        components: this.components,
        position: this.position,
        quaternion: this.quaternion,
        boundingRadius: this.boundingRadius,
        boundingBox: this.boundingBox
      },
      message = ""

    if ( mode == "add" ) {

      message = JSON.stringify({
        command: "add entity",
        data: {
          coords: this.voxel,
          entity: entityData
        }
      })

      systems.staticCollisions.worker.postMessage( message )
      //systems.oimo.worker.postMessage( message )

    } else if ( mode == "update") {
      
      message = JSON.stringify({
        command: "update entity",
        data: { 
          entityId: this.id,
          coords: this.voxel,
          entity: entityData
        }
      })

      systems.staticCollisions.worker.postMessage( message )
      //systems.oimo.worker.postMessage( message )

    }

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

      closestSubComp = closest.getClosestComponent( position )
      closest = !!closestSubComp ? closestSubComp : closest

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

}
