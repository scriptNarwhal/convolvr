import Tool from './tool'
import Entity from '../../../../entity'
import { GRID_SIZE } from '../../../../config'

export default class GeometryTool extends Tool {
  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

      let cameraPos = world.three.camera.position,
          coords =  [ cameraPos.x, 0, cameraPos.z ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

      this.mesh = null
      this.name = "Geometry Tool"
      this.options = {
        shape: 'box', 
        size: [28000, 28000, 28000]
      }

      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [ 2200, 2200, 9000 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Geometries",
                  color: 0xff8007,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "prop", // entity, prop
                        propName: "geometry",
                        dataSource: this.world.systems.assets.props.geometry
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
              this.initLabel( false, "Geometry")
            ]
          }
        ], coords )

    }

    primaryAction ( telemetry ) {
      
      let color         = this.options.color,
          material      = this.options.material,
          basic         = this.options.basic,
          cursor        = telemetry.cursor,
          user          = this.world.user,
          systems       = this.world.systems,
          assetSystem   = systems.assets,
          cursorSystem  = systems.cursor,
          cursorState   = cursor.state.cursor || {},
          componentPath = cursorState.componentPath,
          position      = telemetry.position,
          quat          = telemetry.quaternion,
          selected      = !!cursorState.entity ? cursorState.entity : false,
          coords        = telemetry.voxel,
          props         = {},
          components    = [ ],
          component     = telemetry.component,
          entityId      = -1,
          entity        = telemetry.entity

      console.log(" ( Geometry Tool ) ", componentPath )
          
      if ( component != null ) {
    
        console.log("set geometry")
        component.props.geometry = this.options
        components = [ component ]
    
      }
    
      return {
        coords,
        component,
        componentPath,
        entity,
        entityId,
        components
      }


    }

    secondaryAction ( telemetry, value ) {
    
    }

    configure ( config ) {

            if ( typeof config == 'object' && Object.keys(config).length > 0 ) {
      
              this.options = Object.assign( {}, config.data )
              console.log("Configuring tool ", this.options)

            }
      
      
    }

}