//@flow
import Convolvr from '../../world/world'
import Component from '../../model/component'
import Systems, { System } from '..';

export default class DebugSystem implements System { // gather helpful info & display as text
    
    world: Convolvr
    systems: Systems

    private debugViews: Component[] = [];

    constructor ( world: Convolvr ) {
        this.world = world
        this.systems = world.systems;
    }

    public log(message: string) {
        for (const view of this.debugViews) {
            if (view.attrs.text) {
                view.state.text.write(message);
            } else {
                this.systems.extendComponent(view, "text", {color: "#ffffff", background: "#0000ff", lines: [message]})
            }
        }
    }


    init ( component: Component ) { // implement
        this.debugViews.push(component);

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

        
        
        if ( attr.position ) {
            text.write( 'position: '+ entity.mesh.position.toArray().join(' : ') )
        }

        if ( attr.voxel ) {
            text.write( 'voxel:    '+ entity.getVoxel(false, true).join('.') )
        }

        if ( attr.user ) { // check the following, assuming the entity is the user's avatar
            entity = this.world.user.avatar
            if ( attr.cursors ) {
                text.write( 'cursors: ');
                entity.componentsByAttr.cursor.map( ( cursor, c ) => {
                    if ( cursorIndex == undefined || c == cursorIndex ) {
                        !!cursor.state.cursor.component && text.write( JSON.stringify( cursor.state.cursor.component ) )
                    }  
                });
            }
        }
        
        text.update()
    }
}