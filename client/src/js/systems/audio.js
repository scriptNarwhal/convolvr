export default class AudioSystem {
    constructor (world) {
        this.world = world
        this.listener = new THREE.AudioListener()
    }

    init (component) { 
        let prop = component.props.audio,
            assets = this.world.systems.assets
        // find out what kind of node...

        //Create the PositionalAudio object (passing in the listener)
        var sound = new THREE.PositionalAudio( this.listener )
        
        assets.loadSound(prop.asset, sound, ()=>{
            component.mesh.add(sound)
            sound.setRefDistance( 5000 )
            sound.setMaxDistance(300000)
            sound.play()
        })
        

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

