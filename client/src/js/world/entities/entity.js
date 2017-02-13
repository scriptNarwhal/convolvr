import Component from '../components/component.js';

export default class Entity {
  constructor (id, components, aspects = [], position, quaternion) {
      this.id = id
      this.components = components
      this.aspects = aspects
      this.position = position ? position : false
      this.quaternion = quaternion ? quaternion : false
      this.mesh = null
      this.hands = []
  }

  update (position) {
    this.position = position
    this.mesh.position.fromArray(position)
  }

  init (scene) {
    var mesh = new THREE.Object3D(),
        base = new THREE.Geometry(),
        mobile = three.world.mobile,
        aspects = this.aspects,
        ncomps = this.components.length,
        nonStructural = [],
        compMesh = null,
        materials = [],
        addToOctree = true,
        comp = null,
        face = 0,
        faces = null,
        c = 0,
        s = 0

    if (this.mesh != null) {
      three.world.octree.remove(this.mesh)
      scene.remove(this.mesh)
    }
    while (c < ncomps) {
        comp = new Component(this.components[c], {mobile}) // use simpler shading for mobile gpus
        compMesh = comp.mesh
        if (comp.props.structure === true) {
          materials.push(compMesh.material)
          compMesh.updateMatrix()
          faces = compMesh.geometry.faces
          face = faces.length-1
          while (face > -1) {
              faces[face].materialIndex = s
              face --
          }
          base.merge(compMesh.geometry, compMesh.matrix)
          s ++
        } else {
          if (comp.props.hand !== null) {
            this.hands.push(comp.mesh)
          }
          nonStructural.push(comp.mesh)
        }
        c ++
    }
    if (s > 0) {
      mesh = new THREE.Mesh(base, new THREE.MultiMaterial(materials))
    } else {
      mesh = nonStructural[0]
      s = 1
      while (s < nonStructural.length) {
        mesh.add(nonStructural[s])
        s ++
      }
    }
    if (!! this.quaternion && this.components.length == 1) {
        mesh.quaternion.set(this.quaternion[0], this.quaternion[1], this.quaternion[2], this.quaternion[3])
    }
    if (!! this.position) {
        mesh.position.set(this.position[0], this.position[1], this.position[2])
    }
    if (!!aspects) {
        c = 0;
        while (c < aspects.length) {
            // connect entity to appropriate system
            if (aspects[c] == "no-raycast") {
              addToOctree = false
            }
            c ++
        }
    }
    mesh.userData = { entity: this }
    if (addToOctree) {
      three.world.octree.add(mesh)
    }
    scene.add(mesh)
    this.mesh = mesh

    return this
  }
}
