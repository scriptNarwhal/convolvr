export default class ToolUISystem {
    constructor (world) {
        this.world = world
    }

    init (component) { // allows component to cycle tools / select one for the user 

        let prop = component.props.toolUI,
            state = {}

        if ( prop.menu ) {

        } else if ( prop.toolIndex != undefined) {

        } else if ( prop.currentToolLabel != undefined ) {

        }

        // add hover / activation callbacks?

        return state
    }

    switchTool (tool, hand) {
        let toolbox = this.world.user.toolbox
        toolbox.switchTool(tool, hand)
    }
}

