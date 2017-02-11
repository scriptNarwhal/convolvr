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

    initActionTelemetry (camera, useCursor) {
      let cPos = camera.position,
          position = [cPos.x, cPos.y, cPos.z],
          quaternion = [camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w],
          cursor = this.world.user.cursor,
          cursorPos = null
      if (useCursor) {
        if (false) { // set position from tracked controller
            // implement
        } else {
          cursor.mesh.updateMatrixWorld()
          cursorPos = cursor.mesh.localToWorld(new THREE.Vector3())
          position = [cursorPos.x, cursorPos.y, cursorPos.z]
        }
      }

      return {
        position,
        quaternion
      }
    }
    usePrimary (hand) {
      let tool = this.tools[this.currentTools[hand]],
          camera = this.world.camera,
          telemetry = this.initActionTelemetry(camera, true),
        { position, quaternion } = telemetry,
          toolAction = null
      if (tool.mesh == null) {
        tool.equip(hand)
      }
      toolAction = tool.primaryAction(telemetry)
      if (toolAction !== false) {
        this.sendToolAction(true, tool, position, quaternion, toolAction.entity, toolAction.entityId, toolAction.components)
      }
    }

    useSecondary(hand) {
      let tool = this.tools[this.currentTools[hand]],
          camera = this.world.camera,
          telemetry = this.initActionTelemetry(camera, true),
        { position, quaternion } = telemetry,
          toolAction = false
      if (tool.mesh == null) {
          tool.equip(hand)
      }
      toolAction = tool.secondaryAction(telemetry)
      if (toolAction !== false) {
        this.sendToolAction(false, tool, position, quaternion, toolAction.entity, toolAction.entityId, toolAction.components)
      }
    }

    sendToolAction (primary, tool, position, quaternion, entity, entityId = -1, components = []) {
      let camera = this.world.camera,
          cPos = camera.position,
          coords = [Math.floor(cPos.x / 464000), 0, Math.floor(cPos.z / 403680)],
          toolName = tool.name

      let actionData = {
        tool: toolName,
        world: this.world.name,
        user: this.world.user.username,
        userId: this.world.user.id,
        position,
        quaternion,
        options: tool.options,
        coords,
        components,
        entity,
        entityId,
        primary
      }
      console.log("tool action", actionData)
      send("tool action", actionData)
    }
}
