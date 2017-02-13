export default class Component {
  constructor (data, appConfig = false) {
      var mesh = null,
          props = data.props,
          shape = data.shape,
          size = data.size,
          quaternion = data.quaternion ? data.quaternion : false,
          position = data.position ? data.position : [0, 0, 0],
          geometry = null,
          material = null,
          materialName = data.material || "",
          mat = {},
          basic = false,
          mobile = appConfig && appConfig.mobile

          switch(materialName) {
            case "wireframe":
              mat = {
                color: data.color || 0x00ff00,
                wireframe: true,
                fog: false
              }
              basic = true
            break
            default:
            mat = {
                color: data.color || 0xff00ff,
                fog: false
            }
            basic = false
            break
          }
          if (basic) {
            material = new THREE.MeshBasicMaterial(mat)
          } else {
            if (mobile) {
              material = new THREE.MeshLambertMaterial(mat)
            } else {
              material = new THREE.MeshPhongMaterial(mat)
            }
          }

      switch (shape) {
          case "node":
            geometry = new THREE.PlaneGeometry( size[0]/10000, size[1]/10000)
          break;
          case "plane":
            geometry = new THREE.PlaneGeometry( size[0], size[1])
          break;
          case "box":
            geometry = new THREE.BoxGeometry( size[0], size[1], size[2])
          break;
          case "octahedron":
            geometry = new THREE.OctahedronGeometry( size[0], 0)
          break;
          case "sphere":
            geometry = new THREE.OctahedronGeometry( size[0], 3)
          break;
          case "cylinder":
            geometry = new THREE.CylinderGeometry( size[0], size[0], size[1], 14, 1)
          break;
          case "torus":
            geometry = new THREE.TorusBufferGeometry( size[0], 6.3, 5, 12 )
          break;
          case "hexagon":
            geometry = new THREE.CylinderGeometry(size[0], size[2], size[1], 6)
          break;
          case "text":
            geometry = new THREE.TextGeometry(data.text, data.text_params)
          break;
      }
      mesh = new THREE.Mesh(geometry, material)
      if (!! quaternion) {
          mesh.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3])
      }
      mesh.position.set(position[0], position[1], position[2])
      this.data = data
      this.props = props || {}
      this.mesh = mesh
  }
}
