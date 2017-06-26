export default class DatGUIVRPluginSystem {

    constructor ( world ) {
        this.world = world
    }

    init ( component ) { 
        
        let prop = component.props.datgui,
            gui = null,
            state = null,
            property = [],
            controller = null,
            controllerData = null,
            controllers = prop.controllers,
            c = 0

        // implement updating entities for changes requiring re-init

        if ( prop.gui ) {

            gui = dat.GUIVR.create( prop.gui.name )
            three.scene.add( gui )

        } else if ( component.parent && component.parent.props.datgui && component.parent.props.datgui.gui ) {

            gui = component.parent.state.datgui.gui

        }
        
        if ( gui && controllers ) {

            c = 0

            while ( c < controllers.length ) {

                state = null
                controllerData = controllers[ c ]
                

                if ( controllerData.value.statePath ) {

                    
                    path = controllerData.value.statePath
                    property = path.splice( path.length-1, 1 )
                    state = this.getByPath( component.state, path )

                } else if ( controllerData.value.propsPath ) {

                    path = controllerData.value.propsPath
                    property = path.splice( path.length-1, 1 )
                    state = this.getByPath( component.props, path )

                } else {

                    path = controllerData.value.path
                    property = path.splice( path.length-1, 1 )
                    state = this.getByPath( component, path )

                }

                if ( typeof state[ property ] == 'boolean' || typeof state[ property ] == 'function' ) {

                    controller = gui.add( state, property );

                } else if ( typeof state[ property ] == 'number' ) {

                    controller = gui.add( state, property, controllerData.min, controllerData.max );

                }

                c += 1
            }
            

        }

        return {
            gui,
            controller
        }
    }

    getByPath ( obj, path ) { // based off of https://stackoverflow.com/a/20424385/2961114

        let parts = path.split('.'),
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