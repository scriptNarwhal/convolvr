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
          //toolPanel = this.entity.componentsByProp.tool ? this.entity.componentsByProp.tool[0].state.tool.panel : false,
          component = null,
          toolMesh = null

      if ( this.mesh == null ) {
        toolMesh = this.initMesh(this.data)
      } else {
        toolMesh = this.mesh
        toolMesh.visible = true
      }

      component = this.entity.componentsByProp.tool[0]
      component.state.tool.equip( hand )
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
                size: [ 0.333, 0.13, 0.05 ]
              },
              material: {
                name: "plastic",
                color: 0xffffff
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
