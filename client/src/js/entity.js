import Component from './component.js';

export default class Entity {

  constructor ( id, components, position, quaternion ) {

      this.id = id
      this.components = components
      this.position = position ? position : false
      this.quaternion = quaternion ? quaternion : false
      this.mesh = null
      this.boundingRadius = 10000 // set in init()
      this.componentsByProp = {
        // arrays are defined here with key of prop
      }
      
      this.voxel = this.position ? [ Math.floor(this.position[0] / 928000), 0, Math.floor(this.position[2] / 807360) ] : [ 0, 0, 0 ] // vertical axis disabled for now
      this.compsByFaceIndex = [] // possibly deprecated
      this.allComponents = []
      this.combinedComponents = []
      this.lastFace = 0
      this.compPos = new THREE.Vector3()

  }

  update ( position, quaternion = false ) {

    this.position = position
    this.mesh.position.fromArray( position )

    if ( !!quaternion ) {

      this.quaternion = quaternion
      this.mesh.quaternion.fromArray( quaternion )
      
    }

    this.mesh.updateMatrix()

  }

  init ( scene ) {

    var mesh = new THREE.Object3D(),
        base = new THREE.Geometry(),
        three = window.three,
        world = three.world,
        systems = world.systems,
        mobile = world.mobile,
        ncomps = this.components.length,
        nonStructural = [],
        dimensions = [0, 0, 0],
        compMesh = null,
        compGeom = null,
        compRadius = 10000,
        materials = [],
        addToOctree = true,
        comp = null,
        face = 0,
        faces = null,
        toFace = 0,
        c = 0,
        s = 0

    this.lastFace = 0

    if ( this.mesh != null ) {

      world.octree.remove(this.mesh)

      scene.remove(this.mesh)

    }

    while ( c < ncomps ) {

        comp = new Component( this.components[c], this, systems, {mobile} ) // use simpler shading for mobile gpus
        
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

          nonStructural.push( comp.mesh )
          
        }

        this.allComponents.push( comp )
        c ++

    }

    this.boundingRadius = Math.max( dimensions[0], dimensions[1], dimensions[2] )
    this.boundingBox = dimensions

    if ( s > 0 ) {

      mesh = new THREE.Mesh(base, new THREE.MultiMaterial( materials ))

    } else {

      mesh = nonStructural[0] // maybe nest inside of Object3D ?

    }

    s = 1

    while ( s < nonStructural.length ) {

        mesh.add( nonStructural[ s ] )
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

    scene.add( mesh )
    this.mesh = mesh
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()
    return this

  }

  getClosestComponent( position ) {

    this.mesh.updateMatrixWorld()
 
    let compPos = this.compPos, 
        distance = 200000,
        newDist = 0,
        closest = null;

    this.allComponents.map( component => {

      if ( !! component.merged ) {

        return false

      }

      compPos.setFromMatrixPosition( component.mesh.matrixWorld ) // get world position
      newDist = compPos.distanceTo( position )

      if ( newDist < distance ) {  console.log("comparing component distance ", newDist, distance)

        distance = newDist
        closest = component

      }

    })

    if ( !!!closest ) {

      distance = 200000
      newDist = 0
      this.combinedComponents.map( component => {

        //compPos.fromArray( component.position )
        // apply world transformation
        // implement

      })

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
