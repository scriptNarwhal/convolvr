import { Convolvr } from '../../world/world'
import { Component } from '../../core/component'
// import { THREE } from 'three'

export default class AudioSystem {

    world: Convolvr
    listener: THREE.AudioListener

    constructor ( world: Convolvr ) {

        this.world = world
        this.listener = new THREE.AudioListener()

    }

    init ( component: Component ) { 

        let attr = component.attrs.audio,
            assets = this.world.systems.assets,
            sound = null,
            element = null
        // find out what kind of node...

        if ( attr.type == 'stereo') {
          
            element = document.createElement("audio")
            element.setAttribute("src", attr.asset)
            element.setAttribute("autoplay", attr.autoPlay ? "on" : "off")
            element.setAttribute("style", "display: none;")
            document.body.appendChild(element)

        } else { // if (attr.type == 'positional')
            
            sound = new THREE.PositionalAudio( this.listener ) //Create the PositionalAudio object (passing in the listener)
            
            assets.loadSound(attr.asset, sound, () => {

                if ( sound != null ) {

                    component.mesh.add(sound)
                    sound.setRefDistance( 5000 )
                    sound.setMaxDistance(0.0800)
                    attr.autoPlay !== false && sound.play()

                }
                
            })
        }
        

        return {
            element,
            node: sound,
            start: () => {
                if ( sound != null ) 
                    sound.play()
                if (element != null )
                    element.play()
            },
            stop: () => {
                if ( sound != null )
                    sound.stop()
                if (element != null)
                    element.stop()
            }
        }

    }
    
}

