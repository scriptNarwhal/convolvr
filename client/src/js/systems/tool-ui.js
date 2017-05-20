export default class ToolUISystem {

    constructor (world) {
        this.world = world
    }

    init (component) { // allows component to cycle tools / select one for the user 

        let prop = component.props.toolUI

        if ( prop.menu ) {

        } else if ( prop.toolIndex != undefined) {

        } else if ( prop.currentToolLabel != undefined ) {

        }

        // add hover / activation callbacks?

        return {
            switchTool: ( tool, hand ) => {
                this.switchTool( component, tool, hand )
            },
            updatePosition: ( ) => {    
                this.updatePosition( component )
            },
            hide: (  ) => {
                this.hide( component )
            },
            show: (  ) => {
                this.show( component )
            }
        }

    }

    switchTool (component, tool, hand ) {

        let toolbox = this.world.user.toolbox
        toolbox.switchTool(tool, hand, component )

    }

    updatePosition ( component ) {

      let mesh = component.entity.mesh,
          userMesh = this.world.user.avatar.mesh,
          userPos = userMesh.position,
          pPos = mesh.position

      mesh.position.set( pPos.x, pPos.y, pPos.z )
      mesh.translateZ(-70000)
      mesh.translateY(25000)
      mesh.rotation.y = userMesh.rotation.y
      mesh.updateMatrix()

    }

    hide ( component ) {

      component.entity.mesh.visible = false

    }

    show ( component ) {

      component.entity.mesh.visible = true
      this.updatePosition( component )

    }

}

