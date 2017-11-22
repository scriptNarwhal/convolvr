//@flow
import Entity from '../../entity'
import Component from '../../component'
import { 
    GLOBAL_SPACE,
    GRID_SIZE 
} from '../../config'
import Convolvr from '../../world/world'

// TODO: hook into user.toolbox interfaces (primaryAction, etc.. )

export default class ToolSystem {

    world: Convolvr
    panels: Array<Entity>

    constructor ( world: Convolvr ) {
        this.world = world
        this.panels = []
    }

    init ( component: Component ) { 

        let prop = component.props.tool,
            toolSystem = this,
            contentProps = {},
            factories = null,
            panels = [],
            panel = null,
            newPanel = null

        if ( prop.panel ) {
            contentProps = prop.panel && prop.panel.content ? prop.panel.content.props : {}
            panel = this._initPanelUIEntity( prop.panel, contentProps )
            this.panels.push( panel )
        }

        if ( prop.panels )
            prop.panels.map( ( newPanel, p) => { console.info("init multiple panels", newPanel);
                contentProps = newPanel && newPanel.content ? newPanel.content.props : {}
                let panelEnt = toolSystem._initPanelUIEntity( newPanel, contentProps )
                console.info("panel ent ", panelEnt)
                panels.push( panelEnt )
                toolSystem.panels.push( panelEnt )
            })

        return {
            panels,
            panel,
            preview: {
                box: null,
                show: (cursor: Component) => {
                    this._showPreview( component, cursor )
                },
                hide: () => {
                    this._hidePreview( component )
                } 
            },
            equip: ( hand: number) => {
                this._equip( component, hand )
            },
            unequip: ( hand: number ) => {
                this._unequip( component, hand )
            },
            initLabel: ( value: any ) => {
                this.initLabel( component, value )
            }
        }
    }

    _initPanelUIEntity( panelProp: Object, contentProps: Object ) {

        return new Entity(-1, [ // move panels to asset system perhaps.. or define below*
            {
                position: [0, 0, 0],
                props: { // colored top bar                      
                    geometry: {
                        shape: "box",
                        detail: [4,2,2],
                        size: [3, 0.5, 0.1],
                        faceNormals: true
                    },
                    material: {
                        name: "wireframe",
                        color: panelProp.color
                    },
                    components: [
                        {
                            position: [ 0, 0, 0],
                            props: { // title for top bar
                                text: {
                                    label: true,
                                    lines: [ panelProp.title ],
                                    color: "#ffffff",
                                    background: "#000000"
                                },
                                geometry: {
                                    shape: "box",
                                    size: [ 3, 0.5, 0.1 ]
                                },
                                material: {
                                    name: "plastic",
                                    color: 0xffffff
                                }
                            },
                            components: [],
                            quaternion: [ 0, 0, 0, 1 ]
                        },
                        {
                            position: [ 0, 0, 0],
                            props: { // title for top bar
                                text: {
                                    label: true,
                                    lines: [ panelProp.title ],
                                    color: "#ffffff",
                                    background: "#000000"
                                },
                                geometry: {
                                    shape: "box",
                                    size: [ 3, 0.5, 0.1 ]
                                },
                                material: {
                                    name: "plastic",
                                    color: 0xffffff
                                }
                            },
                            components: [],
                            quaternion: [ 0, 0, 0, 1 ]
                        }
                    ]
                    
                }
            },
            {
                position: [0, -2.25, 0], // position & init the panel once the tool is equipped
                props: Object.assign({}, contentProps, { // content area, holds all factories, controls for this panel
                    geometry: {
                        shape: "box",
                        size: [ 3, 4, 0.1 ]
                    },
                    material: {
                        name: "plastic",
                        color: 0xffffff
                    },
                }),
                components: []
            }
        ], [0, 1.5, 0], [0,0,0,1], GLOBAL_SPACE )
    }

    _showPreview ( component: Component, cursor: Component ) {

        let previewBox = component.state.tool.preview ? component.state.tool.preview.box : null,
            assets = this.world.systems.assets,
            preview = null

        if ( previewBox == null && cursor ) {

            preview = assets.makeEntity( "preview-box", true, {}, component.entity.voxel )
            preview.components[0].props.noRaycast = {}
            preview.init( cursor.mesh, {} )
            component.state.tool.preview.box = preview
            // preview = this.generatePreview( component, preset, data )
        } else if (previewBox != null) {
            previewBox.mesh.visible = true
        }
    }

    _hidePreview ( component: Component ) {

        let previewBox = component.state.tool.preview ? component.state.tool.preview.box : null
        
        if ( previewBox != null )
            previewBox.mesh.visible = false
    }

    _positionToolPanel( toolPanel: Entity, userPos: Array<number>, index: number ) {
        
        let userPosition = [userPos[0], userPos[ 1 ] + 2.8, userPos[2]],
            mesh = toolPanel.mesh

        toolPanel.update(userPosition)
        mesh.rotation.y = this.world.three.camera.rotation.y - Math.PI / 8
        mesh.translateZ( -3 )
        mesh.translateX( 1.25 + (index * 3) )
        mesh.updateMatrix()
    }

    _equip ( component: Component, hand: number ) { // refactor for panels[]
        
        let hands:            Array<Component> = this.world.user.avatar.componentsByProp.hand, //this.toolbox.hands,
            componentsByProp: any              = component.entity.componentsByProp,
            input                              = this.world.userInput,
            toolSystem                         = this,
            toolPanel:        Entity           = componentsByProp.tool[0].state.tool.panel,
            toolPanels:       Array<Entity>    = componentsByProp.tool[0].state.tool.panels,
            toolMesh:         any              = component.entity.mesh,
            userPos:          Array<number>    = this.world.user.avatar.mesh.position.toArray()

        if ( !input.trackedControls && !input.leapMotion ) {
            this.world.user.mesh.add( toolMesh )
            toolMesh.position.set( 0.05-( 0.08 * hand ), -0.333, -0.05 )
        } else {
            hands[ hand ].mesh.add( toolMesh ) // add to respective hand 
        }

        if ( toolPanel ) {
            if ( toolPanel.mesh == null )
                toolPanel.init( this.world.three.scene )

            this._positionToolPanel( toolPanel, userPos, 0 )
        }
        if ( toolPanels && toolPanels.length > 0 ) {
            toolPanels.map( (toolPanel, i) => {
                if ( toolPanel.mesh == null )
                    toolPanel.init( this.world.three.scene )

                toolSystem._positionToolPanel( toolPanel, userPos, i )
            })
        }

        if ( toolPanel ) {
            console.info("---"); console.warn("PANEL COLLISION CHECK");
            this.panels.map( (panel: Entity, i: number) => { 
                console.log("panel distance ", toolPanel.mesh.position.sub( panel.mesh.position ).length());
                let mesh = panel.mesh
                if ( panel.id != toolPanel.id && toolPanel.mesh.position.sub( panel.mesh.position ).length() < 8 ) {
                    mesh.translateX(7.5*i,0)
                    mesh.translateZ(7.5*i,0)
                    mesh.updateMatrix()
                }
            })
        }
    }

    _unequip ( component: Component, hand: number ) {

        let compMesh = component.mesh

        if ( compMesh != null && compMesh.parent != null )
            compMesh.parent.remove( compMesh )
    }

    initLabel ( component: Component, value: any ) {

        return {
            props: {
              geometry: {
                shape: "box",
                size: [ 0.6, 0.2, 0.2 ]
              },
              material: {
                name: "glass"
              },
              text: {
                label: true,
                background: "#000000",
                color: "#ffffff",
                lines: [
                  value
                ]
              }
            },
            position: [ 0.2, 0.08, 0.08 ]
        }
    }
}

