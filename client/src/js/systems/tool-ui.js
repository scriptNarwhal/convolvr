export default class ToolUISystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) { // allows component to cycle tools / select one for the user 

        let props = component.props,
            state = component.state,
            prop = props.toolUI,
            hover = props.hover,
            activate = props.activate,  // add hover / activation callbacks
            lookAway = props.lookAway

        if ( prop.menu ) {

        } else if ( prop.toolIndex != undefined ) {

            activate && state.activate.callbacks.push( () => {
 
                    this.switchTool( component, prop.toolIndex, prop.toolHand )

            } )

            hover && state.hover.callbacks.push( () => {

                component.mesh.material.wireframe = true

            } )

            lookAway && state.lookAway.callbacks.push( () => {

                component.mesh.material.wireframe = false

            } )

        } else if ( prop.currentToolLabel != undefined ) {

            // if ( props.text ) {

            //    props.text.lines = [ tools[ currentTools[ !!prop.toolHand * 1 ] ] ] 

            // }

        }

       

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

    switchTool ( component, tool, hand ) {

        let toolbox = this.world.user.toolbox,
            currentTools = toolbox.currentTools,
            tools = toolbox.tools,
            props = component.props,
            state = component.state

        toolbox.switchTool( tool, hand, component )

        if ( props.text ) {

            props.text.lines = [ tools[ currentTools[ !!prop.toolHand * 1 ] ] ] 
            state.text.update()

        }

    }

    updatePosition ( component ) {

      let mesh = component.entity.mesh,
          userMesh = this.world.user.avatar.mesh,
          userPos = userMesh.position,
          pPos = mesh.position

      mesh.position.set( userPos.x, userPos.y, userPos.z )
      mesh.rotation.y = three.camera.rotation.y
      mesh.updateMatrix()
      mesh.translateZ(-70000)
      mesh.translateY(35000)
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

