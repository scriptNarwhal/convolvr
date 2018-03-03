//@flow
import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class DebugSystem { // gather helpful info & display as text
    
    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) { // implement

        return {
            update: ( ) => {

                this._updateInfo( component )

            }            
        }

    }

    _updateInfo ( component: Component ) {

        let attr = component.attrs.debug,
            text = component.state.text,
            cursorIndex = attr.cursorIndex,
            entity = component.entity,
            lines = []

        if ( attr.user ) { // check the following, assuming the entity is the user's avatar

            entity = this.world.user.avatar

        }
        
        if ( attr.position ) {

            text.write( 'position: '+ entity.mesh.position.toArray().join(' : ') )

        }

        if ( attr.voxel ) {

            text.write( 'voxel:    '+ entity.getVoxel().join('.') )

        }

        if ( attr.cursors ) {

            text.write( 'cursors: ')
            entity.componentsByProp.cursor.map( ( cursor, c ) => {

                if ( cursorIndex == undefined || c == cursorIndex ) {

                    !!cursor.state.cursor.component && text.write( JSON.stringify( cursor.state.cursor.component ) )

                }
                
            })

        }

        text.update()

    }

}