//@flow
import Convolvr from '../../world/world'
import Component from '../../core/component'
import { THREE } from 'three'
import { dat } from 'datguivr'

export default class DatGUIVRPluginSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
        
    }

    init ( component: Component ) { 
        
        let attr = component.attrs.datgui,
            path = "",
            gui = null,
            state = null,
            attrerty = [],
            controller = null,
            controllerData = null,
            controllers = attr.controllers,
            c = 0

        // implement updating entities for changes requiring re-init

        if ( attr.gui ) {

            gui = dat.GUIVR.create( attr.gui.name )
            this.world.three.scene.add( gui )

        } else if ( component.parent && component.parent.attrs.datgui && component.parent.attrs.datgui.gui ) {

            gui = component.parent.state.datgui.gui

        }
        
        if ( gui && controllers ) {

            c = 0

            while ( c < controllers.length ) {

                state = null
                controllerData = controllers[ c ]
                

                if ( controllerData.value.statePath ) {

                    path = controllerData.value.statePath
                    attrerty = path.splice( path.length-1, 1 )
                    state = this.getByPath( component.state, path )

                } else if ( controllerData.value.attrsPath ) {

                    path = controllerData.value.attrsPath
                    attrerty = path.splice( path.length-1, 1 )
                    state = this.getByPath( component.attrs, path )

                } else {

                    path = controllerData.value.path
                    attrerty = path.splice( path.length-1, 1 )
                    state = this.getByPath( component, path )

                }

                if ( typeof state[ attrerty ] == 'boolean' || typeof state[ attrerty ] == 'function' ) {

                    controller = gui.add( state, attrerty );

                } else if ( typeof state[ attrerty ] == 'number' ) {

                    controller = gui.add( state, attrerty, controllerData.min, controllerData.max );

                }

                c += 1
            }
            

        }

        return {
            gui,
            controller
        }
    }

    getByPath ( obj: Object, path: string ) { // based off of https://stackoverflow.com/a/20424385/2961114

        let parts: Array<string> = path.split('.'),
            o = obj

        if ( parts.length > 1 ) {

            for (var i = 0; i < parts.length - 1; i++) {
                if (!o[parts[i]])
                    o[parts[i]] = {};
                o = o[parts[i]];
            }

        }

        return o[ parts[ parts.length - 1 ] ]
    }


}