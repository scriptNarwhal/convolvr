import Entity from './entity'
import Component from './component'

export default class Avatar {
    constructor (name, type, data) {
        var mesh = null, // new THREE.Object3D();
            entity = null,
            component = null,
            components = [],
            n = 2;
        while (n > 0) {
          component = {
              type: "structure",
              shape: "cylinder",
              color: 0xffffff,
              size: {x: 900, y: 600, z: 900},
              position: { x: 0, y: (n-1)*600, z: 0 },
              quaternion: false
          };
          components.push(component);
          n --;
        }

        entity = new Entity(name, components, [{"avatar": true}]);
        entity.init(three.scene);

        this.entity = entity;
        this.mesh = entity.mesh;
        this.type = type;
        this.data = data;
    }
}
