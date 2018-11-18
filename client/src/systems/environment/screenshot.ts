import Convolvr from "../../world/world";
import Component from "../../model/component";

export default class ScreenshotSystem {
    private world: Convolvr

    constructor (world: Convolvr) {

        this.world = world

    }

    init(component: Component) { 
        
        let attr = component.attrs.screenshot;

        // generate cube maps for portals
        // also allow narrow / traditional screenshots, accesible via file, media systems, etc

        if ( attr.mode == "narrow" ) {

            // implement

        } else {

            // implement

        }

        return {
            
        }
    }
}