import Entity from '../../entity'
import { GRID_SIZE } from '../../config'

// TODO: hook into user.toolbox interfaces (primaryAction, etc.. )

export default class ToolSystem {

    constructor ( world ) {

        this.world = world
        this.panels = []

    }

    init ( component ) { 

        let prop = component.props.tool,
            contentProps = prop.panel && prop.panel.content ? prop.panel.content.props : {},
            factories = null,
            panel = null

        if ( prop.panel ) {
           
            panel = new Entity(-1, [ // move panels to asset system perhaps.. or define below*
                {
                    position: [0, 0, 0],
                    props: { // colored top bar                      
                        geometry: {
                            shape: "box",
                            size: [3, 0.5, 0.1],
                            faceNormals: false
                        },
                        material: {
                            name: "metal",
                            color: prop.panel.color
                        },
                        components: [
                            {
                                position: [ 0, 0, -0.66 ],
                                props: { // title for top bar
                                    text: {
                                        label: true,
                                        lines: [ prop.panel.title ],
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
                            name: "metal",
                            color: 0x404050
                        },
                    }),
                    components: []
                }
            ], [0, 1.5, 0], [0,0,0,1], [ 0,1,0 ] ) // component.entity.voxel
            this.panels.push( panel )
            
        }

        return {
            panel,
            preview: {
                box: null,
                show: cursor => {

                    this._showPreview( component, cursor )

                },
                hide: () => {

                    this._hidePreview( component )

                } 
            },
            equip: ( hand ) => {
            
                this._equip( component, hand )
            
            },
            unequip: ( hand ) => {
            
                this._unequip( component, hand )
            
            },
            initLabel: ( value ) => {

                this.initLabel( component, value )
            
            }
        }

    }

    _showPreview ( component, cursor ) {

        console.warn(" Show Preview ", cursor)

        let previewBox = component.state.tool.preview ? component.state.tool.preview.box : null,
            assets = this.world.systems.assets,
            preview = null

        if ( !previewBox && cursor ) {

            preview = assets.makeEntity( "preview-box", true, {}, component.entity.voxel )
            preview.components[0].props.noRaycast = {}
            preview.init( cursor.mesh, {} )
            component.state.tool.preview.box = preview
            // preview = this.generatePreview( component, preset, data )

        } else {

            previewBox.mesh.visible = true

        }

    }

    _hidePreview ( component ) {

        let previewBox = component.state.tool.preview ? component.state.tool.preview.box : null
        
        if ( previewBox )

            previewBox.mesh.visible = false


    }

    _equip ( component, hand ) {

        let input = this.world.userInput,
            hands = this.world.user.avatar.componentsByProp.hand, //this.toolbox.hands,
            toolPanel = component.entity.componentsByProp.tool ? component.entity.componentsByProp.tool[0].state.tool.panel : false,
            toolMesh = component.entity.mesh
      
      if ( !input.trackedControls && !input.leapMotion ) {

          this.world.user.mesh.add( toolMesh )
          toolMesh.position.set( 0.05-( 0.08 * hand ), -0.333, -0.05 )

      } else {

          hands[ hand ].mesh.add( toolMesh ) // add to respective hand 

      }

      if ( toolPanel ) {
        
        if ( toolPanel.mesh == null )
            
            toolPanel.init( three.scene )


        let userPos = this.world.user.avatar.mesh.position.toArray()
        userPos[1] += 1.8
        toolPanel.update(userPos)
        toolPanel.mesh.rotation.y = three.camera.rotation.y - Math.PI / 8
        toolPanel.mesh.translateZ(-3)
        toolPanel.mesh.translateX(1.25)
        toolPanel.mesh.updateMatrix()

        this.panels.map( panel => {
            console.log("panel distance ", toolPanel.mesh.position.sub( panel.mesh.position ).length())
            if ( panel.id != toolPanel.id && toolPanel.mesh.position.sub( panel.mesh.position ).length() < 4 ) {

                panel.mesh.translateX(0.5,0)
                panel.mesh.translateZ(0.5,0)
                panel.mesh.updateMatrix()

            }

        })

      }

    }

    _unequip ( component, hand ) {

        let compMesh = component.mesh

        if ( compMesh != null && compMesh.parent != null )
            
            compMesh.parent.remove( compMesh )


    }

    initLabel ( component, value ) {

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

