import Entity from '../../model/entity'
import Component, { DBComponent } from '../../model/component'
import { 
    GLOBAL_SPACE,
    GRID_SIZE 
} from '../../config'
import Convolvr from '../../world/world'
import { AnyObject } from '../../util';

export default class ToolSystem {

    world: Convolvr
    panels: Entity[]

    constructor ( world: Convolvr ) {
        this.world = world
        this.panels = []
    }

    public init(component: Component) { 
        let attr = component.attrs.tool,
            toolSystem = this,
            contentProps = {},
            factories = null,
            panels: Entity[] = [],
            panel = null,
            newPanel = null

        if ( attr.panel ) {
            contentProps = attr.panel && attr.panel.content ? attr.panel.content.attrs : {}
            panel = this.initPanelUIEntity( attr.panel, contentProps )
            this.panels.push( panel )
        }

        if ( attr.panels )
            attr.panels.map( ( newPanel: any, p: number) => {
                contentProps = newPanel && newPanel.content ? newPanel.content.attrs : {}
                let panelEnt = toolSystem.initPanelUIEntity( newPanel, contentProps );
                panels.push( panelEnt )
                toolSystem.panels.push( panelEnt )
            })

        return {
            panels,
            panel,
            preview: {
                box: null as any,
                show: (cursor: Component) => {
                    this.showPreview( component, cursor )
                },
                hide: () => {
                    this.hidePreview( component )
                } 
            },
            equip: ( hand: number) => {
                this.equip( component, hand )
            },
            unequip: ( hand: number ) => {
                this.unequip( component, hand )
            },
            initLabel: ( value: any ) => {
                this.initLabel( component, value )
            }
        }
    }

    private initPanelUIEntity(panelProp: AnyObject, contentProps: any) {
        return new Entity(-1, [
            {
                position: [0, 0, 0],
                attrs: { // colored top bar                      
                    geometry: {
                        shape: "box",
                        detail: [4,2,2],
                        size: [3, 1.0, 0.05],
                        faceNormals: true
                    },
                    material: {
                        name: "wireframe",
                        color: panelProp.color
                    }
                },
                components: [
                    {
                        position: [ 0, 0, 0],
                        attrs: { // title for top bar
                            text: {
                                label: true,
                                lines: [ panelProp.title ],
                                color: panelProp.titleColor || "#ffffff",
                                background: panelProp.titleBackground || "#000000"
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
                        components: [] as DBComponent[],
                        quaternion: [ 0, 0, 0, 1 ]
                    }
                ]
            } as DBComponent,
            {
                position: [0, -2.25, 0], 
                attrs: Object.assign({}, contentProps, { 
                    geometry: {
                        shape: "box",
                        size: [ 3, 4, 0.1 ]
                    },
                    material: {
                        name: "plastic",
                        color: 0xffffff
                    },
                }),
                components: [],
            }
        ], [0, -0.75, 0], [0,0,0,1], GLOBAL_SPACE, panelProp.title, ["no-raycast"])
    }

    private showPreview(component: Component, cursor: Component) {
        let previewBox = component.state.tool.preview ? component.state.tool.preview.box : null,
            assets = this.world.systems.assets,
            preview = null

        if (previewBox == null && cursor) {

            preview = assets.makeEntity( "preview-box", true, {}, component.entity.voxel ) as Entity
            preview.components[0].attrs.noRaycast = true;
            preview.init( cursor.mesh, {} )
            component.state.tool.preview.box = preview
            // preview = this.generatePreview( component, preset, data )
        } else if (previewBox != null) {
            previewBox.mesh.visible = true
        }
    }

    private hidePreview (component: Component ) {
        let previewBox = component.state.tool.preview ? component.state.tool.preview.box : null
        
        if ( previewBox != null )
            previewBox.mesh.visible = false
    }

    private positionToolPanel(toolPanel: Entity, userPos: Array<number>, index: number, length = 0) {
        let userPosition = [userPos[0], userPos[ 1 ] + 3, userPos[2]],
            mesh = toolPanel.mesh

        if (mesh) {
            toolPanel.update(userPosition)
            const span = ( index) * (2 /9 * Math.PI);
            // mesh.rotation.y = this.world.three.camera.rotation.y - span * (index/length)
            
            
            mesh.rotation.y = (this.world.three.camera.rotation.y - Math.PI / 8);

            mesh.translateZ( -4 )
            mesh.translateX( 1.25 + index * 3.2 )
            
            // mesh.translateZ( -2) //Math.cos(span * (index/length))/5)
            // mesh.translateX(2+index*3) //Math.sin(span * (index/length))*4.0 )
            mesh.updateMatrix()
        }
    }

    private equip (component: Component, hand: number ) { // refactor for panels[]
        let hands:            Component[] = this.world.user.avatar.componentsByAttr.hand, //this.toolbox.hands,
            componentsByAttr: any         = component.entity.componentsByAttr,
            input                         = this.world.userInput,
            toolSystem                    = this,
            toolPanel:        Entity      = componentsByAttr.tool[0].state.tool.panel,
            toolPanels:       Entity[]    = componentsByAttr.tool[0].state.tool.panels,
            toolMesh:         any         = component.entity.mesh,
            userPos:          number[]    = this.world.user.avatar.mesh.position.toArray()

        if (!input.trackedControls && !input.leapMotion) {
            this.world.user.avatar.mesh.add( toolMesh )
            toolMesh.position.set( -2+( 4 * hand ), -1, 0.26 )
            toolMesh.updateMatrix();
        } else {
            hands[ hand ].mesh.add( toolMesh ) // add to respective hand 
        }

        if ( toolPanel ) {
            if ( toolPanel.mesh == null )
                toolPanel.init( this.world.three.scene )

            this.positionToolPanel( toolPanel, userPos, 0 )
        }
        if ( toolPanels && toolPanels.length > 0 ) {
            toolPanels.map( (toolPanel, i) => {
                if ( toolPanel.mesh == null )
                    toolPanel.init( this.world.three.scene )

                toolSystem.positionToolPanel( toolPanel, userPos, i, toolPanels.length)
            })
        }

        if ( toolPanel ) {
            this.panels.map( (panel: Entity, i: number) => { 
                if (panel && panel.mesh) {
                    let mesh: THREE.Mesh = panel.mesh;

                    if ( panel.name != toolPanel.name && mesh.position.distanceTo(toolPanel.mesh.position) < 25 ) {
                        mesh.translateX(-1.2);
                        mesh.translateZ(-0.5);
                        mesh.updateMatrix()
                    }
                }
            })
        }
    }

    private unequip ( component: Component, hand: number ) {
        let compMesh = component.mesh

        if ( compMesh != null && compMesh.parent != null )
            compMesh.parent.remove( compMesh )
    }

    initLabel ( component: Component, value: any ) {

        return {
            attrs: {
              geometry: {
                shape: "box",
                size: [ 2, 0.6, 0.1 ]
              },
              material: {
                name: "plastic"
              },
              text: {
                label: true,
                background: "#00000000",
                color: "#00ff00",
                lines: [
                  "> "+value
                ]
              }
            },
            position: [ 0.2, -0.08, 0.08 ],
            quaternion: [0, 0, 0, 1]
        }
    }
}

