import Tool from '../../../../world/tool'
import Entity from '../../../../core/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

/* delete (component | entity) tool */

export default class DeleteTool extends Tool  {

    constructor (data, world, toolbox) {

      super(data, world, toolbox)

      let cameraPos = world.three.camera.position,
         coords = GLOBAL_SPACE


      this.mesh = null
      this.name = "Delete Tool"
      this.options = {

      }
      this.entity = new Entity(-1, [
          {
            attrs: {
              geometry: {
                shape: "box",
                size: [ 0.5, 0.34, 1.333 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                
              }
            },
            components: [
              this.initLabel( false, "Delete")
            ]
          }
        ], null, null, coords)

    }

    primaryAction (telemetry) { // remove entity

      let cursor = telemetry.cursor,
          user = this.world.user,
          cursorSystem = three.world.systems.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          coords = [ 0, 0, 0 ],
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false
      
      if ( !!!selected ) {
        
        return false 

      } else {

        coords = selected.voxel

      }

      return {
        coords,
        entityId: selected.id,
      }
    }

    secondaryAction (telemetry, value) { // remove component?
      // implement
    }

    configure ( config ) {

    }

    generatePreview( component, preset, data ) {
      
      let preview = null
      
      return preview
      
    }
    
}
