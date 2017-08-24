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
        shape: "box"
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
      
      let shape = this.options.shape,
          cursor = telemetry.cursor,
          user = this.world.user,
          systems = this.world.systems,
          assetSystem = systems.assets,
          cursorSystem = systems.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          coords = telemetry.voxel,
          props = {},
          components = [],
          entityId = -1,
          entity = null

    }

    secondaryAction ( telemetry, value ) {
    
    }

    configure ( config ) {

      if ( config.shape ) {

        this.options.shape = config.shape

      }

    }

}