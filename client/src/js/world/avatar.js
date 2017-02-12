import Entity from './entities/entity'
import Component from './components/component'

export default class Avatar {
    constructor (id, type, data) {
        var mesh = null, // new THREE.Object3D();
            entity = null,
            component = null,
            componentB = null,
            components = [],
            n = 2;

         component = {
              props: { structure: true },
              shape: "cylinder",
              color: 0xffffff,
              material: "plastic",
              size: [1800, 1200, 1800],
              position: [0, (n-1)*600, 0],
              quaternion: false
         }
        components.push(component);
        componentB = {
              props: { structure: true },
              shape: "octahedron",
              color: 0xffffff,
              material: "wireframe",
              size: [2800, 2800, 2800],
              position: [0, (n-1)*600, 0],
              quaternion: false
          };
          components.push(componentB)
        n = 0
        while (n < 2) {
          components.push(Object.assign({}, {
            props: {
                hand: n,
                structure: false,
            },
            shape: "box",
            size: [500, 100, 1000],
            color: 0xffffff,
            material: "plastic",
            quaternion: null,
            position: [(n-1)*800, 0, 0]
          }))
          ++n
        }
        entity = new Entity(id, components, ["avatar"], null, null)
        entity.init(three.scene)
        this.entity = entity
        this.mesh = entity.mesh
        this.hands = entity.hands
        this.type = type
        this.data = data
    }
}
