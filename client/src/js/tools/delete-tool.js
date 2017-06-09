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
                size: [2600, 2200, 8000]
              },
              material: {
                name: "metal"
              },
              tool: {

              }
            }
          }
        ])
    }

    primaryAction (telemetry) {
      // remove entity
    }

    secondaryAction (telemetry, value) {
      //
    }
}
