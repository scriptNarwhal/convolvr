/* toolbox */
import {send} from '../../network/socket'
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
      console.log(world.user)
      this.tools = [
        new EntityTool({}, world),
        new ComponentTool({}, world),
        new DeleteTool({}, world),
        new VoxelTool({}, world),
        new ProjectileTool({}, world)
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
      this.tools[this.currentTools[hand]].unequip()
      this.currentTools[hand] = index
      this.tools[index].equip(hand)
      this.showMenu()
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
      //console.log("use primary tool action for hand: ", hand, this.tools[this.currentTools[hand]]); // remove this
      let tool = this.tools[this.currentTools[hand]],
          camera = this.world.camera
      tool.primaryAction()
      this.sendToolAction(true, tool, camera)
    }

    useSecondary(hand) {
      let tool = this.tools[this.currentTools[hand]],
          camera = this.world.camera
      if (tool.secondaryAction() === false) {
        return
      }
      this.sendToolAction(false, tool, camera)
    }

    sendToolAction (primary, tool, camera) {
      send("tool action", {
        tool: tool.name,
        world: this.world.name,
        user: this.world.user.username,
        userId: this.world.user.id,
        position: [camera.position.x, camera.position.y, camera.position.z],
        quaternion: [camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w],
        options: tool.options,
        primary
      })
    }
}
