//@flow
import Convolvr from '../world/world'
import Component from '../component'
import { THREE } from 'three'

export default class FBXPluginSystem { // allows use of imported .fbx models

    world: Convolvr
    loader: Object
    manager: Object
    mixers: Array<Object>

    constructor ( world: Convolvr ) {

        this.world = world
        this.loader = {}
        this.manager = {}
        this.mixers = []

    }

    init ( component: Component ) { 
        
        let manager = this.manager || new THREE.LoadingManager(),
            mixers = this.mixers,
            prop = component.props.fbx

		manager.onProgress = ( item, loaded, total ) => {

			console.log( item, loaded, total );

        }
        
        this.loader = this.loader ||  new THREE.FBXLoader( manager );
        this.manager = manager
		this.loader.load( prop.url, fbx => {

			fbx.mixer = new THREE.AnimationMixer( fbx )
			mixers.push( fbx.mixer )

			var action = fbx.mixer.clipAction( fbx.animations[ 0 ] )
			action.play()

            component.mesh.add( fbx )
            component.state.fbx.fbx = fbx


		}, this._onProgress, this._onError );

        return {
           url: prop.url,
           fbx: null
        }
        
    }

    play ( component: Component, animationIndex: number = 0 ) {

        this._getClipAction( component, animationIndex ).play()

    }

    stop ( component: Component, animationIndex: number = 0 ) {

        this._getClipAction( component, animationIndex ).stop()

    }

    tick ( delta: number, time: number ) {

        let mixers = this.mixers

        if ( mixers.length > 0 ) {

			for ( let i = 0; i < mixers.length; i ++ ) {

				mixers[ i ].update( delta )

			}

		}

    }

    _getClipAction ( component: Component, index: number ) {

        let model: Object = component.state.fbx.fbx
        
        return model.mixer.clipAction( model.animations[ index ] )

    } 

    _onProgress ( xhr: Object ) {

		if ( xhr.lengthComputable ) {

			let percentComplete = xhr.loaded / xhr.total * 100
			console.log( Math.round( percentComplete ) + '% done loading model' )

		}

    }
        
    _onError ( xhr: Object ) {

		console.error( xhr )

	}
}