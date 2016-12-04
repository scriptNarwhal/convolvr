/* toolbox */
import ComponentTool from './component-tool'
import EntityTool from './entity-tool'
import DeleteTool from './delete-tool'
import VoxelTool from './voxel-tool'
import ProjectileTool from './projectile-tool'
import CustomTool from './custom-tool'

export default class Toolbox {
    constructor (world) {
      this.tools = [
        new ComponentTool(),
        new EntityTool(),
        new DeleteTool(),
        new VoxelTool(),
        new ProjectileTool()
        //new CustomTool(),
      ];
      this.currentTool = 0;
    }

    nextTool(direction) {
      this.currentTool += direction;
      if (this.currentTool < 0) {
        this.currentTool = this.tools.length - 1;
      } else if (this.currentTool >= this.tools.length) {
        this.currentTool = 0;
      }
    }

    getTools () {
      return this.tools;
    }

    getCurrentTool () {
      return this.currentTool;
    }

    addTool (data) {
      this.tools.push(new CustomTool(data))
    }

}
