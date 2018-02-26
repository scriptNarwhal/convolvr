//@flow
import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class StateSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) { 
        
        let prop = component.props.state

        //TODO: implement

        return {
            set: ( key: string, value: any ) => {
                this.set( component, key, value )
            },
            get: ( key: string) => {
                return this.get( component, key )
            }
        }
    }

    set ( component: Component, key: string, value: any ) {

        let prop = component.props.emote
        component.state.state[ key ] = value
    }

    get ( component: Component, key: string ): any {
        
        let prop = component.props.emote
        return component.state.state[ key ]
    }

}