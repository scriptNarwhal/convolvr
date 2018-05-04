import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class SocialMediaSystem {

    private world: Convolvr
    public friends: any[]

    constructor ( world: Convolvr ) {

        this.world = world
        this.friends = []

    }

    init(component: Component) { 
        
        let attr = component.attrs.socialMedia

        //TODO: implement

        return {
            
        }
    }
}