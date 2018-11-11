import Tool from '../../../../world/tool'
import Entity from '../../../../model/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class PropertyTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )
      let cameraPos = world.three.camera.position,
          coords = GLOBAL_SPACE;

      this.mesh = null;
      this.name = "Property Tool"
      this.options = {}

      this.entity = new Entity(-1, [
          {
            attrs: {
              geometry: {
                shape: "box",
                size: [0.08, 0.05, 0.333]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Properties",
                  color: 0x07ffff,
                  content: {
                    attrs: {
                      // implement  metafactory.type == "prop"
                      // get a data source of props.. for the current user + some generic ones
                      
                      // metaFactory: { // generates factory for each item in dataSource
                      //   type: "attr", // entity, attr
                      //   attrName: "assets",
                      //   dataSource: this.world.systems.assets.attrs.assets
                      // },
                      // layout: {
                      //   type: "grid",
                      //   mode: "factory", // child components will ignore layout
                      //   columns: 3
                      // }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Property Tool")
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
