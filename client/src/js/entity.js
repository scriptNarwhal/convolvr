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
      this.compsByFaceIndex = []
      this.lastFace = 0

  }

  update ( position, quaternion = false ) {

    this.position = position
    this.mesh.position.fromArray(position)

    if ( !!quaternion ) {

      this.quaternion = quaternion
      this.mesh.quaternion.fromArray(quaternion)
      
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

        if ( comp.props.geometry && comp.props.geometry.merge === true ) {

          materials.push(compMesh.material)
          compMesh.updateMatrix()

          while ( face > -1 ) {

              faces[face].materialIndex = s
              face --
              
          }

          base.merge(compMesh.geometry, compMesh.matrix)
          s ++

        } else if ( !comp.detached ) {

          nonStructural.push(comp.mesh)

        }

        c ++
    }

    this.boundingRadius = Math.max(dimensions[0], dimensions[1], dimensions[2])
    this.boundingBox = dimensions

    if ( s > 0 ) {

      mesh = new THREE.Mesh(base, new THREE.MultiMaterial(materials))

    } else {

      mesh = nonStructural[0]

    }

    s = 1

    while ( s < nonStructural.length ) {

        mesh.add( nonStructural[s] )
        s ++

    }

    if ( !! this.quaternion && this.components.length == 1 ) {
        mesh.quaternion.set(this.quaternion[0], this.quaternion[1], this.quaternion[2], this.quaternion[3])
    }

    if (!! this.position) {
        mesh.position.set(this.position[0], this.position[1], this.position[2])
    }

    mesh.userData = { 

      entity: this,
      compsByFaceIndex: this.compsByFaceIndex

    }

    if ( addToOctree ) {

      world.octree.add( mesh )

    }

    scene.add( mesh )
    this.mesh = mesh
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()
    return this

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
