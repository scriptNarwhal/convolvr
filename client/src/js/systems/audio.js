export default class AudioSystem {

    constructor ( world ) {

        this.world = world
        this.listener = new THREE.AudioListener()

    }

    init ( component ) { 

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
                sound.setMaxDistance(300000)
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

