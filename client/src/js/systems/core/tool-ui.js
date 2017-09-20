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
            console.log( "adding switch tool callback", activate)
            activate && state.activate.callbacks.push( () => {
 
                this.switchTool( component, prop.toolIndex, typeof prop.toolHand == 'number' ? prop.toolHand : 0 )

            } )

            hover && state.hover.callbacks.push( () => {

                state.hover.cursorHovering = true
                component.mesh.material.wireframe = true

            } )

            lookAway && state.lookAway.callbacks.push( () => {

                state.hover.cursorHovering = false
                component.mesh.material.wireframe = false

            } )

        } else if ( prop.currentTool != undefined ) {

            // some kind of init needed here? 
          
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
            state = component.state,
            entity = component.entity,
            toolUIs = entity.componentsByProp.toolUI
        
        toolUIs.forEach( ui => {

            if ( ui.props.toolUI.currentTool ) {

                ui.mesh.position.set( -0.050 + 0.3333 * currentTools[ hand ], 0, -0.3333 )
                //ui.mesh.updateMatrix()
            }

        })

        toolbox.useTool( tool, hand, true )

    }

    updatePosition ( component ) {

      let mesh = component.entity.mesh,
          userMesh = this.world.user.avatar.mesh,
          userPos = userMesh.position,
          pPos = mesh.position

      mesh.position.set( userPos.x, userPos.y, userPos.z )
      mesh.rotation.y = three.camera.rotation.y
      mesh.updateMatrix()
      mesh.translateZ( -0.3330 )
      mesh.translateX(  0.1 )
      mesh.translateY(  1.5 )
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

