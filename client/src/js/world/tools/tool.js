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
          toolMesh.position.set(1500-(3000*hand), -800, -1550)
        } else {
          hands[hand].add(toolMesh) // add to respective hand 
        }
        
      } else {
        this.mesh.visible = true
      }
    }

    unequip (hand) {
      if (this.mesh != null) {
        if (this.mesh.parent != null) {
          this.mesh.parent.remove(this.mesh)
        }
      }
    }

    initLabel (value) {
      return {
            props: {
              geometry: {
                shape: "box",
                size: [8000, 3000, 2000]
              },
              material: {
                name: "glass"
              },
              text: {
                label: true,
                background: "#000000",
                color: "#ffffff",
                lines: [
                  value
                ]
              }
            },
            position: [6000, 3000, 3000]
        }
    }

}
