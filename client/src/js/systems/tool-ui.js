export default class ToolUISystem {
    constructor (world) {
        this.world = world
    }

    init (component) { // allows component to cycle tools / select one for the user 
        let prop = component.props.toolUI,
            state = {}

        return state
    }

    switchTool (tool, hand) {
        let toolbox = this.world.user.toolbox
        toolbox.switchTool(tool, hand)
    }
}

