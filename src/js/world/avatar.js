import Entity from './entity'
import Component from './component'

export default class Avatar {
    constructor (name, type, data) {
        var mesh = null, // new THREE.Object3D();
            entity = null,
            component = null;

        component = {
            type: "structure",
            shape: "cylinder",
            size: {x: 200, y: 200, z: 400},
            position: false,
            quaternion: false
        };

        entity = new Entity(name, [component], [{"avatar": true}]);
        entity.init(three.scene);

        this.entity = entity;
        this.mesh = entity.mesh;
        this.type = type;
        this.data = data;
    }
}
