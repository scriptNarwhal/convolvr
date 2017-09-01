export default class Tool {

    constructor ( data, world, toolbox ) {

      this.data = data
      this.world = world
      this.toolbox = toolbox

    }

    initMesh () {

      this.entity.init(three.scene)
      this.mesh = this.entity.mesh
      return this.mesh

    }

    equip ( hand ) {

      let input = this.world.userInput,
          hands = this.world.user.avatar.componentsByProp.hand, //this.toolbox.hands,
          toolPanel = this.entity.componentsByProp.tool ? this.entity.componentsByProp.tool[0].state.tool.panel : false,
          toolMesh = null

      if ( this.mesh == null ) {

        toolMesh = this.initMesh(this.data)

      } else {

        toolMesh = this.mesh
        toolMesh.visible = true

      }

      if ( !input.trackedControls && !input.leapMotion ) {

          this.world.user.mesh.add(toolMesh)
          toolMesh.position.set(1500-(3000*hand), -800, -1550)

      } else {

          hands[hand].mesh.add(toolMesh) // add to respective hand 

      }

      if ( toolPanel ) {
        
        if ( toolPanel.mesh == null ) {
            
            toolPanel.init(three.scene)

        }

        let userPos = this.world.user.avatar.mesh.position.toArray()
        userPos[1] += 40000
        toolPanel.update(userPos)
        toolPanel.mesh.rotation.y = three.camera.rotation.y + Math.PI / 6
        toolPanel.mesh.translateZ( -76000 )
        toolPanel.mesh.translateX( -34000 )
        toolPanel.mesh.updateMatrix()

      }

    }

    unequip ( hand ) {

      if (this.mesh != null) {
        
        if (this.mesh.parent != null) {
          
          this.mesh.parent.remove(this.mesh)

        }

      }

    }

    initLabel ( component, value ) {

      return {
            props: {
              geometry: {
                shape: "box",
                size: [ 8000, 2000, 1000 ]
              },
              material: {
                name: "plastic"
              },
              text: {
                background: "#000000",
                color: "#ffffff",
                lines: [
                  value
                ]
              }
            },
            position: [ 6000, 3000, 3000 ],
            quaternion: [0, 0, 0, 1]
        }
        
    }

}
