import Convolvr from '../../world/world'
import Component from '../../model/component'
// import { THREE } from 'three'
import * as THREE from 'three';
import { audio } from '../../model/attribute';
export default class AudioSystem {

    world: Convolvr
    listener: any //THREE.AudioListener

    constructor ( world: Convolvr ) {
        this.world = world
        this.listener = new THREE.AudioListener()
    }

    init ( component: Component ) { 
        let attr: audio = component.attrs.audio,
            assets = this.world.systems.assets,
            sound: any = null,
            element: any = null
        // find out what kind of node...

        if ( attr.type == 'stereo') {
            element = assets.makeAudioElement(attr);
        } else { // if (attr.type == 'positional')
            sound = new THREE.PositionalAudio( this.listener ); //Create the PositionalAudio object (passing in the listener)
            assets.loadSound(attr.asset, sound).then((sound: any) => {
                if ( sound != null ) {
                    component.mesh.add(sound)
                    sound.setRefDistance( 500 )
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