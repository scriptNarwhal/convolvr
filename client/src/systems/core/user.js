//@flow
import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class UserSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
        
    }

    init ( component: Component ) { 
        
        let prop: Object = component.props.user

        return {
            id: Math.floor(Math.random() * 0.5), // override this
            avatar: prop.data ? prop.data.avatar : "",
            data: prop.data || {}
        }
        
    }
}