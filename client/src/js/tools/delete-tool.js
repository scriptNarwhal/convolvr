import Tool from './tool'
import Entity from '../entity'

/* delete (component | entity) tool */

export default class DeleteTool extends Tool  {

    constructor (data, world, toolbox) {

      super(data, world, toolbox)
      this.mesh = null
      this.name = "Delete Tool"
      this.options = {

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
                
              }
            },
            components: [
              this.initLabel( false, "Delete")
            ]
          }
        ])

    }

    primaryAction (telemetry) { // remove entity

      let cursor = telemetry.cursor,
          user = this.world.user,
          cursorSystem = three.world.systems.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
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
}
