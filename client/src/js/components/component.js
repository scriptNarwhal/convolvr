export default class Component {
  constructor (data, entity, systems, appConfig = false) {
      var mesh = null,
          props = data.props,
          quaternion = data.quaternion ? data.quaternion : false,
          position = data.position ? data.position : [0, 0, 0]
          
      this.data = data
      this.props = data.props || {}
      this.state = {}
      this.components = data.components
      this.geometry = null
      this.material = null
      if (props.geometry == undefined) {
        props.geometry = {
          shape: "node",
          size:[1,1,1]
        }
      }
      if (props.material == undefined) {
        props.material = {
          name: 'wireframe',
          color: 0xffffff
        }
      }
      systems.registerComponent(this)

      mesh = new THREE.Mesh(this.geometry, this.material)
      
      if (!! quaternion) {
          mesh.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3])
      }
      mesh.position.set(position[0], position[1], position[2])
      this.mesh = mesh
      if (this.props.hand != undefined) {
        entity.hands.push(comp.mesh)
        scene.add(comp.mesh)
      }
      
      if (this.components.length > 0) {
        this.initSubComponents(this.components, entity, systems, appConfig)
      }
  }

  initSubComponents(components, entity, systems, appConfig) {
    var mesh = new THREE.Object3D(),
        base = new THREE.Geometry(),
        three = window.three,
        mobile = !!appConfig ? appConfig.mobile : three.world.mobile,
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

   while (c < ncomps) {
        comp = new Component(this.components[c], entity, systems, {mobile}) // use simpler shading for mobile gpus
        if (comp.props.noRaycast === true) {
          addToOctree = false
        }
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
    mesh.userData = { 
        component: this,
        entity
    }     
  }
}
