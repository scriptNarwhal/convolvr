import Entity from '../entities/entity'

export default class ToolSystem {
    constructor (world) {
        this.world = world
    }
    // hook into user.toolbox interfaces (primaryAction, etc.. )
    init (component) { 
        let prop = component.props.tool,
            contentProps = prop.panel.content ? prop.panel.content.props : false,
            factories = null,
            panel = null

        if (prop.panel) {
            factories = []

            if (contentProps.metaFactory) {

            }

            panel = new Entity(-1, [
                {
                    props: {
                        geometry: {
                            shape: "box",
                            size: [12000, 4000, 1000]
                        },
                        material: {
                            name: "glass",
                            color: 0x000000
                        },
                        text: {
                            lines: [prop.panel.title],
                            color: "#ffffff",
                            background: "#000000"
                        }
                    },
                    position: [0, 0, 0]
                },
                {
                    components: factories,
                    position: [0, -4000, 0]
                }
            ], [0, 0, 0], false)
        }

        return {
            panel
        }
    }
}

