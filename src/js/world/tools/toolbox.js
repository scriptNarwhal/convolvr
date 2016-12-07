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
        new ComponentTool({}, world.user),
        new EntityTool({}, world.user),
        new DeleteTool({}, world.user),
        new VoxelTool({}, world.user),
        new ProjectileTool({}, world.user)
        //new CustomTool(),
      ];
      this.currentTools = [0, 0];
    }

    nextTool(direction, hand = 0) {
      let current = this.currentTools[hand];

      current += direction;
      if (current[hand] < 0) {
        current[hand] = this.tools.length - 1;
      } else if (current[hand] >= this.tools.length) {
        current[hand] = 0;
      }
      console.log("before "+this.currentTools[hand]);
      this.currentTools[hand] = current;
      console.log("after "+this.currentTools[hand]);
    }

    useTool (index, hand) {
      this.currentTools[hand] = index;
      this.tools[index].equip(hand);
    }

    getTools () {
      return this.tools;
    }

    getCurrentTool (hand) {
      return this.tools[this.currentTools[hand]];
    }

    addTool (data) {
      this.tools.push(new CustomTool(data))
    }

}
