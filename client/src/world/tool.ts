import ToolboxSystem from "../systems/tool/toolbox";
import Component from "../model/component";
import Entity from "../model/entity";
import Convolvr from "./world";

export default class Tool {
  public mesh: any;
  public data: any;
  public entity: Entity;
  private world: Convolvr;
  public toolbox: ToolboxSystem;

    constructor ( data: any, world: Convolvr, toolbox: ToolboxSystem ) {
      this.data = data
      this.world = world
      this.toolbox = toolbox
    }

    initMesh () {
      this.entity.init((window as any).three.scene)
      this.mesh = this.entity.mesh
      return this.mesh
    }

    equip (hand: number) {
      let input = this.world.userInput,
          hands = this.world.user.avatar.componentsByAttr.hand, //this.toolbox.hands,
          //toolPanel = this.entity.componentsByAttr.tool ? this.entity.componentsByAttr.tool[0].state.tool.panel : false,
          component = null,
          toolMesh = null

      if ( this.mesh == null ) {
        toolMesh = this.initMesh()
      } else {
        toolMesh = this.mesh
        toolMesh.visible = true
      }

      component = this.entity.componentsByAttr.tool[0]
      component.state.tool.equip( hand )
    }

    preview( cursor: any ) {
      let components = this.entity.componentsByAttr
      
      if ( components && components.tool )
        this.entity.componentsByAttr.tool[0].state.tool.preview.show( cursor )

    }

    hidePreview(  ) {
      let components = this.entity.componentsByAttr

      if ( components && components.tool )
        components.tool[0].state.tool.preview.hide()
      
    }

    unequip (hand: number) {

      if ( this.mesh != null && this.mesh.parent != null )
          this.mesh.parent.remove( this.mesh )

    }

    initLabel (component: Component, value: string) {

      return {
            attrs: {
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
            // position: [ 0.15, 0.18, 0.18 ],
            
            position: [ 0.15, 0.18, -2.18 ],
            quaternion: [0, 0, 0, 1]
        }        
    }
}
