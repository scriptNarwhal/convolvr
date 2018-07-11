import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class ScriptSystem { 
    
    world: Convolvr

    constructor (world: Convolvr) {

        this.world = world
        
    }

    init (component: Component) {
        let attr = component.attrs.script;

        return {
           
        }

    }

    evaluate: (code: string ) {

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