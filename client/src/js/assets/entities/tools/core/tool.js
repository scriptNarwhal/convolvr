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
          toolMesh.position.set(0.1-(0.08*hand), -0.08, -0.15)

      } else {

          hands[hand].mesh.add(toolMesh) // add to respective hand 

      }

      if ( toolPanel ) {
        
        if ( toolPanel.mesh == null )
            
            toolPanel.init(three.scene)

        let userPos = this.world.user.avatar.mesh.position.toArray()
        userPos[1] += 2
        toolPanel.update(userPos)
        toolPanel.mesh.rotation.y = three.camera.rotation.y + Math.PI / 6
        toolPanel.mesh.translateZ( -3 )
        toolPanel.mesh.translateX( -1.5 )
        toolPanel.mesh.updateMatrix()

      }

    }

    preview ( cursor ) {

      let components = this.entity.componentsByProp
      
      if ( components && components.tool )

        this.entity.componentsByProp.tool[0].state.tool.preview.show( cursor )


    }

    hidePreview (  ) {
      
      let components = this.entity.componentsByProp

      if ( components && components.tool )
      
        components.tool[0].state.tool.preview.hide()
      
      
    }

    unequip ( hand ) {

      if ( this.mesh != null && this.mesh.parent != null )
       
          this.mesh.parent.remove( this.mesh )


    }

    initLabel ( component, value ) {

      return {
            props: {
              geometry: {
                shape: "box",
                size: [ 0.333, 0.09, 0.05 ]
              },
              material: {
                name: "plastic"
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
            position: [ 0.05, 0.08, 0.08 ],
            quaternion: [0, 0, 0, 1]
        }
        
    }

}
