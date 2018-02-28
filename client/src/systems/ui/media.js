export default class MediaSystem {

    constructor (world) {

        this.world = world

    }

    init ( component ) {

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