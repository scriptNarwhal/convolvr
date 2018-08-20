import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class ScriptSystem { 
    
    world: Convolvr
    worker: Worker
    envComponents: {[_:string]: Component}

    constructor (world: Convolvr) {
        this.world = world
        this.worker = new Worker('/data/js/workers/ecs-bundle.js');
        /**
         * Get data FROM web worker
         */

        this.worker.onmessage = (message) => {
            let msg = JSON.parse(message.data),
                data = msg.data,
                env = msg.env,
                component = this.envComponents[env];

            switch(msg.command) {
                case "return value":
                    component.state.script.getReturnValue();
                break;
                case "get voxel":
                    
                break;
                case "get entity":

                break;
                case "get component":

                break;
                case "component.setPosition":
                    component.mesh.position.set(data); break;
                case "component.setRotation":
                    component.mesh.rotation.set(data); break;
                case "component.setAttrs":
                    break;
                case "component.setProps":
                    
                break;
                case "component.setState":
                break;
                case "component.addComponent":
                    component.components.push(data)
                    component.entity.init()
                break;
                case "component.removeComponent":
                    component.components.splice(data, 1)
                    component.entity.init()
                break;
                case "entity.setPosition":
                    component.entity.update(data); break;
                case "entity.setRotation":
                    component.entity.update(null, data); break;
                case "entity.addComponent":
                    component.entity.components.push(data)
                    component.entity.init()
                break;
                case "entity.removeComponent":
                    component.entity.components.splice(data, 1)
                    component.entity.init()
                break;
            }
        }
    }

    init (component: Component) {
        let attr = component.attrs.script,
            env = [component.entity.voxel.join("."), component.entity.id, component.index],
            getReturnValue = {};

        this.envComponents[env.join(",")] = component;

        return {
            eval: (code: string, callback: (data: any) => {}) => {
                this.evaluate(code, env);
                getReturnValue = callback;
            },
            getReturnValue,
            env
        }
    }

    /**
     * Send data TO web worker
     */

    evaluate (code: string, env: any[]) {
        this.worker.postMessage('{"command": "eval", "data": { "env": ["'+env[0]+'",'+env[1]+','+env[2]+'], "code": "'+code+'"}}');
    }

    addComponent() {
        this.worker.postMessage('{"command: "add-component", "data": {}}');
    }
    addEntity() {
        this.worker.postMessage('{"command: "add-entity", "data": {}}');
    }

    updateComponent() {
        this.worker.postMessage('{"command: "update-component", "data": {}}');
    }
    updateEntity() {
        this.worker.postMessage('{"command": "update-entity", "data": {}}');
    }
    updateTelemetry() {
        this.worker.postMessage('{"command": "update-telemetry", "data": {}}');
    }

    removeComponent() {
        this.worker.postMessage('{"command": "remove-component", "data": {}}');
    }
    removeEntity() {
        this.worker.postMessage('{"command": "remove-entity", "data": {}}');
    }

    clear() {
        this.worker.postMessage('{"command": "clear", "data": {}}');
    }
    
}