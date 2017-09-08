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
                            size: [60000, 10000, 2000],
                            faceNormals: false
                        },
                        material: {
                            name: "metal",
                            color: prop.panel.color
                        },
                        components: [
                            {
                                position: [ 0, 2000, -14000 ],
                                props: { // title for top bar
                                    text: {
                                        label: true,
                                        lines: [ prop.panel.title ],
                                        color: "#ffffff",
                                        background: "#000000"
                                    },
                                    geometry: {
                                        shape: "box",
                                        size: [ 60000, 10000, 2000 ]
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
                    position: [0, -45000, 0], // position & init the panel once the tool is equipped
                    props: Object.assign({}, contentProps, { // content area, holds all factories, controls for this panel
                        geometry: {
                            shape: "box",
                            size: [ 60000, 80000, 2000 ]
                        },
                        material: {
                            name: "metal",
                            color: 0x404050
                        },
                    }),
                    components: []
                }
            ], [0, 0, 0], [0,0,0,1], component.entity.voxel)
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

        let previewBox = component.state.tool.preview ? component.state.tool.preview.box : null,
            assets = this.world.systems.assets,
            preview = null

        if ( !previewBox ) {

            preview = assets.makeEntity( "preview-box", true, {}, component.entity.voxel )
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
          toolMesh.position.set( 1500-( 3000 * hand ), -800, -1550 )

      } else {

          hands[ hand ].mesh.add( toolMesh ) // add to respective hand 

      }

      if ( toolPanel ) {
        
        if ( toolPanel.mesh == null )
            
            toolPanel.init( three.scene )


        let userPos = this.world.user.avatar.mesh.position.toArray()
        userPos[1] += 42000
        toolPanel.update(userPos)
        toolPanel.mesh.rotation.y = three.camera.rotation.y - Math.PI / 8
        toolPanel.mesh.translateZ(-72000)
        toolPanel.mesh.translateX(35000)
        toolPanel.mesh.updateMatrix()

        this.panels.map( panel => {
            console.log("panel distance ", toolPanel.mesh.position.sub( panel.mesh.position ).length())
            if ( panel.id != toolPanel.id && toolPanel.mesh.position.sub( panel.mesh.position ).length() < 40000 ) {

                panel.mesh.translateX(100000)
                panel.mesh.translateZ(100000)
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
                size: [ 8000, 3000, 2000 ]
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
            position: [ 6000, 3000, 3000 ]
        }

    }

}

