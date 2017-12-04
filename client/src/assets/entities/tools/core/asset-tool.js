import Tool from '../../../../world/tool'
import Entity from '../../../../entity'
import { GRID_SIZE } from '../../../../config'

export default class AssetTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

      let cameraPos = world.three.camera.position,
          coords =  [ cameraPos.x, 0, cameraPos.z ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

      this.mesh = null;
      this.name = "Asset Tool"
      this.options = {

      }

      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [0.08, 0.05, 0.333]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Assets",
                  color: 0x07ffff,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "prop", // entity, prop
                        propName: "assets",
                        dataSource: this.world.systems.assets.props.assets
                      },
                      layout: {
                        type: "grid",
                        mode: "factory", // child components will ignore layout
                        columns: 3
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Asset Tool")
            ]
          }
      ], null, null, coords)
  }

  primaryAction (telemetry) {
      
  }

  secondaryAction (telemetry, value) {
    
  }
    
  configure ( config ) {
      
    if ( typeof config == 'object' && Object.keys(config).length > 0 ) {

      this.options = Object.assign( {}, config.data )
      console.log("Configuring tool ", this.options)

    }
      
  }

  generatePreview( component, preset, data ) {
    
    let preview = null
    
    return preview
    
  }

}