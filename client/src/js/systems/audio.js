export default class AudioSystem {
    constructor (world) {
        this.world = world
        this.listener = new THREE.AudioListener()
        this.systems = world.systems
    }

    init (component) { 
        let prop = component.props.audio
        // find out what kind of node...

        //Create the PositionalAudio object (passing in the listener)
        var sound = new THREE.PositionalAudio( this.listener )
        this.systems.assets.loadSound('/sounds/wind.ogg', sound, ()=>{
            component.mesh.add(sound)
            sound.setRefDistance( 100000 )
            sound.play()
        })
       
        return {
            start: (position) => {
                //this.start(component, position)
            },
            stop: () => {
                //this.stop(component)
            }
        }
    }
}

