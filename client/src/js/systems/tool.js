import Entity from '../entity'

export default class ToolSystem {

    constructor (world) {

        this.world = world
        this.panels = []

    }
    // hook into user.toolbox interfaces (primaryAction, etc.. )
    init (component) { 

        let prop = component.props.tool,
            contentProps = prop.panel.content ? prop.panel.content.props : {},
            factories = null,
            panel = null

        if (prop.panel) {
           
            panel = new Entity(-1, [
                {
                    props: {
                        geometry: {
                            shape: "box",
                            size: [22000, 4000, 1000]
                        },
                        material: {
                            name: "glass",
                            color: 0x000000
                        },
                        text: {
                            lines: [ prop.panel.title ],
                            color: "#ffffff",
                            background: "#000000"
                        }
                    },
                    position: [0, 0, 0]
                },
                {
                    props: Object.assign({}, contentProps, {
                        geometry: {
                            shape: "box",
                            size: [22000, 44000, 1000]
                        },
                        material: {
                            name: "metal",
                            color: 0x200030
                        },
                    }),
                    components: [],
                    position: [0, -24000, 0] // position & init the panel once the tool is equipped
                }
            ], [0, 0, 0], false)
            this.panels.push(panel)
            
        }

        return {
            panel
        }

    }

}

