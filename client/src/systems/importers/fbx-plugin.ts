// not using flow yet..
import Convolvr from '../../world/world'
import Component from '../../model/component'
import * as THREE from 'three';
import { System } from '..';

type FBXState = {
    url: string
    fbx: any
}

export default class FBXPluginSystem implements System { // allows use of imported .fbx models
    public world: Convolvr
    public loader: any
    public manager: any
    public mixers: Array<any>
    public live: boolean

    constructor ( world: Convolvr ) {
        this.world = world
        this.loader = {}
        this.manager = {}
        this.mixers = []
        this.live = true
    }

    init (component: Component ): FBXState { 
        let manager = this.manager || new THREE.LoadingManager(),
            mixers = this.mixers,
            attr = component.attrs.fbx

		manager.onProgress = ( item: any, loaded: number, total: number ) => {

			console.log( item, loaded, total );

        }
        
        this.loader = this.loader ||  new THREE.FBXLoader( manager );
        this.manager = manager
		this.loader.load( attr.url, (fbx: any) => {

			fbx.mixer = new THREE.AnimationMixer( fbx )
			mixers.push( fbx.mixer )

			var action = fbx.mixer.clipAction( fbx.animations[ 0 ] )
			action.play()

            component.mesh.add( fbx )
            component.state.fbx.fbx = fbx


		}, this._onProgress, this._onError );

        return {
           url: attr.url,
           fbx: null
        }
    }

    play (component: Component, animationIndex: number = 0 ) {
        this._getClipAction( component, animationIndex ).play()
    }

    stop (component: Component, animationIndex: number = 0 ) {
        this._getClipAction( component, animationIndex ).stop()
    }

    tick (delta: number, time: number ) {
        let mixers = this.mixers;

        if ( mixers.length > 0 ) {
			for ( let i = 0; i < mixers.length; i ++ ) {
				mixers[ i ].update( delta )
			}
		}
    }

    _getClipAction (component: Component, index: number ) {
        let model: any = component.state.fbx.fbx
        
        return model.mixer.clipAction( model.animations[ index ] )
    } 

    _onProgress (xhr: any ) {
		if ( xhr.lengthComputable ) {
			let percentComplete = xhr.loaded / xhr.total * 100
			console.log( Math.round( percentComplete ) + '% done loading model' )
		}
    }
        
    _onError (xhr: any ) {
		console.error( xhr )
	}
}