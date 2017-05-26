export default class GeometrySystem {
    constructor (world) {
      this.world = world
      // probably cache some geometries here
      this.nodeGeom = new THREE.PlaneGeometry(1/10000, 1/10000)
    }

    init (component) { 
        let prop = component.props.geometry,
            geometry = null,
            size = prop.size,
            assets = this.world.systems.assets,
            geometryCode = prop.shape+':'+size.join(':')
        
        if (assets.geometries[geometryCode] == null) {
          switch (prop.shape) {
            case "node":
              geometry = this.nodeGeom
            break
            case "plane":
              geometry = new THREE.PlaneGeometry(size[0], size[1])
            break
            case "box":
              geometry = new THREE.BoxGeometry(size[0], size[1], size[2])
            break
            case "octahedron":
              geometry = new THREE.OctahedronGeometry(size[0], 0)
            break
            case "sphere":
              geometry = new THREE.OctahedronGeometry(size[0], 3)
            break
            case "cylinder":
              geometry = new THREE.CylinderGeometry(size[0], size[0], size[1], 14, 1)
            break
            case "torus":
              geometry = new THREE.TorusGeometry(size[0], 6.3, 5, 12 )
            break
            case "hexagon":
              geometry = new THREE.CylinderGeometry(size[0], size[1], size[2], 6)
            break
            case "open-box":
              geometry = new THREE.CylinderGeometry(size[0], size[2], size[1], 4, 1, true)
            break
          }
          assets.geometries[geometryCode] = geometry
        } else {
          geometry = assets.geometries[geometryCode]
        }
        return {
          geometry
        }
    }
}