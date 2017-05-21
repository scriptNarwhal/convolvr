import Entity from '../entity'

// TODO: hook into user.toolbox interfaces (primaryAction, etc.. )

export default class ToolSystem {

    constructor (world) {

        this.world = world
        this.panels = []

    }

    init (component) { 

        let prop = component.props.tool,
            contentProps = prop.panel.content ? prop.panel.content.props : {},
            factories = null,
            panel = null

        if (prop.panel) {
           
            panel = new Entity(-1, [
                {
                    props: { // colored top bar
                        geometry: {
                            shape: "box",
                            size: [60000, 10000, 2000]
                        },
                        material: {
                            name: "metal",
                            color: prop.panel.color
                        },
                        components: [
                            {
                                props: { // title for top bar
                                    geometry: {
                                        shape: "box",
                                        size: [60000, 10000, 2000]
                                    },
                                    material: {
                                        name: "metal",
                                        color: 0x000000
                                    },
                                    text: {
                                        lines: [ prop.panel.title ],
                                        color: "#ffffff",
                                        background: "#000000"
                                    }
                                },
                                position: [0, 0, 7000]
                            }
                        ]
                        
                    },
                    position: [0, 0, 0]
                },
                {
                    props: Object.assign({}, contentProps, { // content area, holds all factories, controls for this panel
                        geometry: {
                            shape: "box",
                            size: [60000, 80000, 2000]
                        },
                        material: {
                            name: "metal",
                            color: 0x808080
                        },
                    }),
                    components: [],
                    position: [0, -45000, 0] // position & init the panel once the tool is equipped
                }
            ], [0, 0, 0], false)
            this.panels.push(panel)
            
        }

        return {
            panel
        }

    }

}

