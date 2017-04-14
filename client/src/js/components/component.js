export default class Component {
  constructor (data, entity, systems, appConfig = false) {
      var mesh = null,
          props = data.props,
          quaternion = data.quaternion ? data.quaternion : false,
          position = data.position ? data.position : [0, 0, 0]
          
      this.data = data
      this.props = data.props || {}
      this.state = {}
      this.components = data.components || []
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
      mesh.matrixAutoUpdate = false
      if (!! quaternion) {
          mesh.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3])
      }
      mesh.position.set(position[0], position[1], position[2])
      mesh.updateMatrix()
      this.mesh = mesh

      if (this.props.hand != undefined) {
        entity.hands.push(this.mesh)
      }
      if (this.props.cursor != undefined) {
        entity.cursors.push(this)
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
        if (comp.props.geometry && comp.props.geometry.merge === true) {
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
      this.mesh.add(mesh)
    } else {
      while (s < nonStructural.length) {
          this.mesh.add(nonStructural[s])
          s ++
      }
    }
    mesh.userData = { 
        component: this,
        entity
    }     
  }
}
