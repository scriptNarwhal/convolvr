export default class Component {
  constructor (data, entity, systems, appConfig = false) {
      var mesh = null,
          props = data.props,
          quaternion = data.quaternion ? data.quaternion : false,
          position = data.position ? data.position : [0, 0, 0]
          
      this.data = data
      this.props = props || {}
      this.state = {}
      this.geometry = null
      this.material = null
      systems.registerComponent(this)
      if (this.geometry)
      mesh = new THREE.Mesh(this.geometry, this.material)
      if (!! quaternion) {
          mesh.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3])
      }
      mesh.position.set(position[0], position[1], position[2])
      this.mesh = mesh
      if (this.components.length > 0) {
        this.initSubComponents(this.components, entity, systems, appConfig)
      }
  }

  initSubComponents(components, entity, systems, appConfig) {

  }
}
