export default class AudioSystem {

    constructor ( world: Convolvr ) {

        this.world = world
        this.listener = new THREE.AudioListener()

    }

    init ( component: Component ) { 

        let prop = component.props.audio,
            assets = this.world.systems.assets,
            sound = null
        // find out what kind of node...

        if ( prop.type == 'stereo') {
            // implement

        } else { // if (prop.type == 'positional')
            sound = new THREE.PositionalAudio( this.listener ) //Create the PositionalAudio object (passing in the listener)
            
            assets.loadSound(prop.asset, sound, ()=>{
                component.mesh.add(sound)
                sound.setRefDistance( 5000 )
                sound.setMaxDistance(0.0800)
                prop.autoPlay !== false && sound.play()
            })
        }
        

        return {
            node: sound,
            start: () => {
                sound.play()
            },
            stop: () => {
               sound.stop()
            }
        }

    }
    
}

