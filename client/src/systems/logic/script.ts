import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class ScriptSystem { 
    
    world: Convolvr
    worker: Worker
    envComponents: {[_:string]: Component}

    constructor (world: Convolvr) {
        this.world = world
        this.worker = new Worker('/data/js/workers/ecs-bundle.js');
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
                break;
                case "component.setRotation":
                break;
                case "component.setAttrs":
                break;
                case "component.setProps":
                break;
                case "component.setState":
                break;
                case "component.addComponent":
                break;
                case "component.removeComponent":
                break;
                case "entity.setPosition":
                break;
                case "entity.setRotation":
                break;
                case "entity.addComponent":
                break;
                case "entity.removeComponent":
                break;
                
            }
        }
    }

    init (component: Component) {
        let attr = component.attrs.script,
            env = [component.entity.voxel.join("."), component.entity.id, component.index],
            getReturnValue = {};

        return {
            eval: (code: string, callback: (data: any) => {}) => {
                this.evaluate(code, env);
                getReturnValue = callback;
            },
            getReturnValue,
            env
        }

    }

    evaluate (code: string, env: any[]) {
        this.worker.postMessage('{"command":"eval", "data": { "env": ["'+env[0]+'",'+env[1]+','+env[2]+'], "code": "'+code+'"}}');
    }

    addComponent() {

    }
    addEntity() {
        
    }

    updateComponent() {

    }
    updateEntity() {
        
    }
    updateTelemetry() {

    }

    removeComponent() {

    }
    removeEntity() {

    }

    clear() {

    }
    
    
}