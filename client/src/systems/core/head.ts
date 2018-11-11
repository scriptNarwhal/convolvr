import Convolvr from "../../world/world";
import Component from "../../model/component";

export default class HeadSystem { // decides where to position camera in user avatar
    
    private world: Convolvr
    constructor ( world: Convolvr ) {
        this.world = world
    }

    init(component: Component) {

        // implement
        
        return {
     
        }
    }
}