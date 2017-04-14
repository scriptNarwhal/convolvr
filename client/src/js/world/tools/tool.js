export default class Tool {
    constructor (data, world, toolbox) {
      this.data = data
      this.world = world
      this.toolbox = toolbox
    }

    initMesh () {
      this.entity.init(three.scene)
      this.mesh = this.entity.mesh
      return this.mesh
    }

    equip (hand) {
      let input = this.world.userInput,
          hands = this.toolbox.hands

      if (this.mesh == null) {
        let toolMesh = this.initMesh(this.data)
        if (!input.trackedControls && !input.leapMotion) {
          this.world.user.mesh.add(toolMesh)
          toolMesh.position.set(1500-(2500*hand), -700, -1550)
        } else {
          hands[hand].add(toolMesh)
        }
        // add to respective hand (when implemented)
      } else {
        this.mesh.visible = true;
      }
    }

    unequip (hand) {
      if (this.mesh != null) {
        if (this.mesh.parent != null) {
          this.mesh.parent.remove(this.mesh)
        }
      }
    }
}
