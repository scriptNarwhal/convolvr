import Entity from '../entities/entity'
import Component from '../components/component'

export default class Avatar {
    constructor (id, wholeBody, data) { // wholeBody == true == not just 'vr hands'
        var mesh = null, // new THREE.Object3D();
            entity = null,
            component = null,
            componentB = null,
            components = [],
            n = 2

      if (wholeBody) {
        component = {
             props: { structure: true },
             shape: "cylinder",
             color: 0xffffff,
             material: "plastic",
             size: [1800, 1200, 1800],
             position: [0, (n-1)*600, 0],
             quaternion: false
        }
       components.push(component)
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
      } else {
        components.push(Object.assign({},{
          props: { structure: true },
          shape: "box",
          color: 0xffffff,
          material: "plastic",
          size: [1, 1, 1],
          position: [0, 0, 0],
          quaternion: false
        }))
      }

        n = 0
        while (n < 2) {
          components.push(Object.assign({}, {
            props: {
                hand: n,
                structure: false,
                noRaycast: true
            },
            shape: "box",
            size: [2500, 1500, 4000],
            color: 0xffffff,
            material: "plastic",
            quaternion: null,
            position: [(n-1)*1500, 0, 0]
          }))
          ++n
        }
        entity = new Entity(id, components, null, null)
        entity.init(three.scene)
        this.entity = entity
        this.mesh = entity.mesh
        this.hands = entity.hands
        this.wholeBody = wholeBody
        this.data = data
    }
}
