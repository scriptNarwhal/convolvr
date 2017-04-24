export default class WebRTCSystem {
    constructor (world) {
        this.world = world
    }

    connect (params) {

    }
    
    disconnect (params) {

    }
    getVideo (params) {

    }
    init (component) { 
        
        return {
            connect: (params) => {
                this.connect(params)
            },
            disconnect: (params) => {
                this.disconnect(params)
            },
            getVideo: (params) => {
                this.getVideo(params)
            }
        }
    }
}

