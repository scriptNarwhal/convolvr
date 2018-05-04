//@flow
import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class UserSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
        
    }

    init ( component: Component ) { 
        
        let attr: any = component.attrs.user

        return {
            id: Math.floor(Math.random() * 0.5), // override this
            avatar: attr.data ? attr.data.avatar : "",
            data: attr.data || {}
        }
        
    }
}