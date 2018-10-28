import Convolvr from '../../world/world'
import Component, { DBComponent } from '../../core/component'
import { DBEntity } from '../../core/entity';
import { script } from '../../core/attribute';

export default class ScriptSystem { 
    
    world: Convolvr
    worker: Worker
    envComponents: {[_:string]: Component}

    constructor (world: Convolvr, worker: Worker) {
        this.envComponents = {};
        this.world = world
        this.worker = worker;
        this.worker.onmessage = (message: MessageEvent) => {
            let msg = JSON.parse(message.data),
                data = msg.data,
                env = msg.env,
                component = this.envComponents[env];
            console.log("component script env: ", env);
            console.log("escript component: ", component);
            switch(msg.command) {
                case "return value":
                    console.log("script return value")
                    component.state.script.getReturnValue();
                break;
                case "native call":
                    console.log("script native call")
                    this.nativeCall(component, data);
                break;
                case "internal error":
                    this.internalError(data)
                break;
            }
        }
    }

    init (component: Component) {
        let attr: script = component.attrs.script,
            env = [component.entity.voxel.join("."), component.entity.id, component.index],
            getReturnValue = {};
        console.log("init script component")
        console.log("---------------------")
        this.envComponents[env.join(",")] = component;

        const evalInComponent = (code: string, callback: (data: any) => any) => {
            this.evaluate(code, env);
            getReturnValue = callback;
        };

        if (attr.autorun !== false) {
            if (attr.program) {
                evalInComponent(attr.program, (data: any)=>{});
            }
    
            if (attr.statements) {
                //TODO: implement
            }
    
            if (attr.modules) {
                //TODO: implement
            }
    
            if (attr.repl) {
                //TODO: implement
            }
        }

        return {
            eval: evalInComponent,
            getReturnValue,
            env
        }
    }

    private nativeCall(component: Component, data: {[_:string]: any}) { //being lazy here.. // TODO: there should be a type for worker commands
        switch(data.method) {
            case "component.setPosition":
                component.mesh.position.set(data.position); break;
            case "component.setRotation":
                component.mesh.rotation.set(data.rotation); break;
            case "component.setAttrs":
                break;
            case "component.setProps":
                
            break;
            case "component.setState":
            break;
            case "component.addComponent":
                component.components.push(data.data)
                component.entity.init()
            break;
            case "component.removeComponent":
                component.components.splice(data.removeIndex, 1)
                component.entity.init()
            break;
            case "entity.setPosition":
                component.entity.update(data.position); break;
            case "entity.setRotation":
                component.entity.update(null, data.rotation); break;
            case "entity.addComponent":
                component.entity.components.push(data.data)
                component.entity.init()
            break;
            case "entity.removeComponent":
                component.entity.components.splice(data.removeIndex, 1)
                component.entity.init()
            break;
        }
    }

    private internalError(data: any) {
        console.error("Internal Error: "+JSON.stringify(data))
    }

    /**
     * Send data TO web worker
     */

    evaluate (code: string, env: any[]) {
        this.worker.postMessage('{"command": "eval", "data": { "env": ["'+env[0]+'",'+env[1]+','+env[2]+'], "code": "'+code+'"}}');
    }

    command(commandName: string, commandArgs: any[], env: any[]) {
        this.worker.postMessage(`{"command": "command", "data": {"commandName":"${commandName}", 
                                              commandArgs:${JSON.stringify(commandArgs)}, "env": ["${env[0]}",${env[1]},${env[2]}],`);
    }

    nativeReturn(value: any, call: string, env: any[]) {
        this.worker.postMessage(JSON.stringify({"command": "native-return", "data": { call, value, env }}));
    }


    /**
     * Worker Commands
     */

    addComponent(componentData: DBComponent, env: any[]) {
        this.command("add-component", [componentData], env);
    }
    addEntity(entityData: DBEntity, env: any[]) {
        this.command("add-entity", [entityData], env);
    }

    updateComponent(componentData: DBComponent, env: any[]) {
        this.command("update-component", [componentData], env);
    }
    updateEntity(entityData: DBEntity, env: any[]) {
        this.command("update-entity", [entityData], env);
    }
    updateTelemetry() {
        this.worker.postMessage('{"command": "update-telemetry", "data": {}}');
    }

    removeComponent(env: any[]) {
        this.command("remove-component", [env], env);
    }
    removeEntity(env: any[]) {
        this.command("remove-component", [env], env);
    }

    clear() {
        this.command("clear", [], ["", 0, 0, 0]);
    }
    
}