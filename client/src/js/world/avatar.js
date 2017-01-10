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
              type: "structure",
              shape: "cylinder",
              color: 0xffffff,
              material: "plastic",
              size: [1800, 1200, 1800],
              position: [0, (n-1)*600, 0],
              quaternion: false
          };
          components.push(component);
          componentB = {
              type: "structure",
              shape: "octahedron",
              color: 0xffffff,
              material: "wireframe",
              size: [2800, 2800, 2800],
              position: [0, (n-1)*600, 0],
              quaternion: false
          };
          components.push(componentB);

        entity = new Entity(id, components, [{"avatar": true}], null, null, 0);
        entity.init(three.scene);

        this.entity = entity;
        this.mesh = entity.mesh;
        this.type = type;
        this.data = data;
    }
}
