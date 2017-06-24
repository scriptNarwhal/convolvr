export default class DatGUIVRPluginSystem {

    constructor ( world ) {
        this.world = world
    }

    init ( component ) { 
        
        let prop = component.props.datgui,
            gui = null,
            state = null,
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

                    state = this.getByPath( component.state, controllerData.value.statePath )

                } else if ( controllerData.value.propsPath ) {

                    state = this.getByPath( component.props, controllerData.value.propsPath )

                } else {

                    state = this.getByPath( component, controllerData.value.path )

                }

                if (typeof state == 'boolean') {

                    controller = gui.add( state, controllerData.label );

                } else if ( typeof state == 'number' ) {

                    controller = gui.add( state, controllerData.label, controllerData.min, controllerData.max );

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