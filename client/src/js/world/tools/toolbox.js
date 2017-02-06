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
      let tool = this.tools[this.currentTools[hand]],
          camera = this.world.camera,
          entity = null
      if (tool.mesh == null) {
        tool.equip(hand)
      }
      entity = tool.primaryAction() || null
      this.sendToolAction(true, tool, camera, entity)
    }

    useSecondary(hand) {
      let tool = this.tools[this.currentTools[hand]],
          camera = this.world.camera,
          entity = false
      if (tool.mesh == null) {
          tool.equip(hand)
      }
      entity = tool.secondaryAction()
      if (entity === false) {
        return
      }
      this.sendToolAction(false, tool, camera, entity)
    }

    sendToolAction (primary, tool, camera, entity, entityId = -1, components = []) {
      let cPos = camera.position,
          coords = [Math.floor(cPos.x / 464000), 0, Math.floor(cPos.z / 403680)],
          position = [cPos.x, cPos.y, cPos.z],
          quaternion = [camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w],
          cursor = this.world.user.cursor,
          selected = cursor.entity,
          toolName = tool.name

      if (selected) {
        if (cursor.distance < 33000 &&
            (tool.name == "Entity Tool" || tool.name == "Component Tool")) {
            toolName = "Component Tool"
            entityId = selected.id
            components = entity.components
            console.log("ADDING COMPONENTS TO ENTITY")
            // components may have to be translated before setting Action Position
        }
      }

      send("tool action", {
        tool: toolName,
        world: this.world.name,
        user: this.world.user.username,
        userId: this.world.user.id,
        position: position,
        quaternion: quaternion,
        options: tool.options,
        coords,
        components,
        entity,
        entityId,
        primary
      })
    }
}
