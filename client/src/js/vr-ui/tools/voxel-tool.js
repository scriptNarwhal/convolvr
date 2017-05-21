import Tool from './tool'
import Entity from '../../entity'
/* terrain voxel tool */
export default class VoxelTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
      this.mesh = null;
      this.name = "Voxel Tool"
      this.options = {

      }
      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [1600, 1200, 7000]
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
      // create voxel
    }

    secondaryAction (telemetry, value) {
      // remove voxel
    }
}
