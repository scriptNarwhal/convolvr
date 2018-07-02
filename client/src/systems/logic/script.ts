import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class ScriptSystem { 
    
    world: Convolvr

    constructor (world: Convolvr) {

        this.world = world
        
    }

    init (component: Component) {

        return {
           
        }

    }
    
    configure (data: any) {

        // implement 

    }
}