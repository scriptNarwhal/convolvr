import Convolvr from '../../world/world'
import Component, { DBComponent, EntityPath } from '../../model/component'
import Entity, { DBEntity } from '../../model/entity';
import { script } from '../../model/attribute';
import { AnyObject } from '../../util';
import { TextState } from '../ui/text';

type ECSMessage = {
    command: "return value" | "native call" | "internal error",
    env: string
    path?: string
    data: AnyObject | ECSNativeCall
}

type ECSNativeCall = {
    method: string,
    args: any[]
    env?: any
}

export type ScriptState = {
    eval: (code: string, callback: (data: any) => void) => void,
    handleReturnValue: (value: any) => void,
    env: [string, number, number]
}

export default class ScriptSystem { 
    
    world: Convolvr
    worker: Worker
    envComponents: {[_:string]: Component}

    constructor (world: Convolvr, worker: Worker) {
        this.envComponents = {};
        this.world = world
        this.worker = worker;
        this.worker.onmessage = (message: MessageEvent) => {
            let msg: ECSMessage = JSON.parse(message.data),
                data = msg.data,
                env = msg.env ? msg.env : msg.path,
                component = this.envComponents[env];

            switch(msg.command) {
                case "return value":
                    if (component && component.state) {
                        component.state.script.handleReturnValue(data);
                    }
                break;
                case "native call":
                    this.nativeCall(component, data  as ECSNativeCall);
                break;
                case "internal error":
                    this.internalError(data)
                break;
            }
        }
    }

    init (component: Component): ScriptState {
        let attr: script = component.attrs.script,
            env = this.getComponentScriptEnv(component),
            handleReturnValue = (data: any) => {};

        this.envComponents[env.join(",")] = component;

        const evalInComponent = (code: string, callback: (data: any) => void) => {
            this.evaluate(code, env);

            handleReturnValue = callback;
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
            handleReturnValue,
            env
        }
    }

    
    /**
     * Send data TO web worker
     */

    public evaluate (code: string, env: any[]) {
        this.worker.postMessage('{"command": "eval", "data": { "env": ["'+env[0]+'",'+env[1]+','+env[2]+'], "code": "'+code+'"}}');
    }

    public evaluateForComponent(component: Component, code: string) {
        this.evaluate(code, this.getComponentScriptEnv(component));
    }

    public command(commandName: string, commandArgs: any[], env: any[]) {
        this.worker.postMessage(`{"command": "command", "data": {"commandName":"${commandName}", 
                                              commandArgs:${JSON.stringify(commandArgs)}, "env": ["${env[0]}",${env[1]},${env[2]}],`);
    }

    public nativeReturn(value: any, call: string, env: any[]) {
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

    private getComponentScriptEnv(component: Component): [string,number,number] {
        return [component.entity.voxel.join("."), component.entity.id, component.index];
    }

    private nativeCall(component: Component, data: ECSNativeCall) {
        switch(data.method) {
            case "component.setPosition":
                component.mesh.position.set(data.args[0]); break;
            case "component.setRotation":
                component.mesh.rotation.set(data.args[0]); break;
            case "component.setAttrs":
                break;
            case "component.setProps":
                
            break;
            case "component.setState":
            break;
            case "component.addComponent":
                component.components.push(data.args[0])
                component.entity.init(this.world.three.scene);
            break;
            case "component.removeComponent":
                component.components.splice(data.args[0], 1)
                component.entity.init(this.world.three.scene);
            break;
            case "entity.setPosition":
                component.entity.update(data.args[0]); break;
            case "entity.setRotation":
                component.entity.update(null, data.args[0]); break;
            case "entity.addComponent":
                component.entity.components.push(data.args[0])
                component.entity.init(this.world.three.scene);
            break;
            case "entity.removeComponent":
                component.entity.components.splice(data.args[0], 1)
                component.entity.init(this.world.three.scene);
            break;
            case "print":
                this.print(component, data.args);
            break;
        }
    }

    private print(component: Component, args: any[]) {
        const entity: Entity = component && component.entity;

        if (!entity) {
            return; 
        }
        
        const outputComponent = entity.componentsByAttr.text ? entity.componentsByAttr.text[0] : null,
        stdout: TextState = outputComponent ? outputComponent.state.text : null;
        if (stdout) {
            for (const line of args) {
                stdout.write(line);
            }
        }
    }

    private internalError(data: any) {
        console.error("Internal Error: "+JSON.stringify(data))
    }
}