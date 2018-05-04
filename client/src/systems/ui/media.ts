import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class MediaSystem {

    private world: Convolvr

    constructor (world: Convolvr) {
        this.world = world
    }

    init(component: Component) {

        let attr = component.attrs.media

        if ( attr.playPause ) {

        } else if ( attr.title ) {

        } else if ( attr.queue ) {

        } else if ( attr.add ) {
            
        } else if ( attr.remove ) {

        }

        return {
            
        }
    }
}