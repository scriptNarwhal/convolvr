/* toolbox */
import ComponentTool from './component-tool'
import EntityTool from './entity-tool'
import DeleteTool from './delete-tool'
import VoxelTool from './voxel-tool'
import ProjectileTool from './projectile-tool'
import CustomTool from './custom-tool'

export default class Toolbox {
    constructor (world) {
      this.world = world;
      this.fadeTimeout = 0;
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

    showMenu() {
      this.updateUI();
      this.world.user.hud.show();
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = setTimeout(()=>{
        this.world.user.hud.hide();
      },1000)
    }

    updateUI() {
      this.world.user.hud.update();
    }

    nextTool(direction, hand = 0) {
      this.showMenu();
      this.currentTools[hand] += direction;
      if (this.currentTools[hand] < 0) {
        this.currentTools[hand] = this.tools.length - 1;
      } else if (this.currentTools[hand] >= this.tools.length) {
        this.currentTools[hand] = 0;
      }
      console.log("next tool", direction, this.currentTools[hand]);
    }

    useTool (index, hand) {
      this.showMenu();
      this.currentTools[hand] = index;
      this.tools[index].equip(hand);
      console.log(this.tools[index])
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

    usePrimary (hand) {
      console.log("use primary tool action for hand: ", hand, this.tools[this.currentTools[hand]]); // remove this
      this.tools[this.currentTools[hand]].primaryAction();
    }

    useSecondary(hand) {
      this.tools[this.currentTools[hand]].secondaryAction();
    }
}
