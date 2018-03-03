import Component from '../../core/component'
import Convolvr from '../../world/world'

export default class ToolUISystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
    }

    init ( component: Component ) { // allows component to cycle tools / select one for the user 

        let attrs = component.attrs,
            state = component.state,
            attr = attrs.toolUI,
            hover = attrs.hover,
            activate = attrs.activate,  // add hover / activation callbacks
            lookAway = attrs.lookAway

        if ( attr.menu ) {

        } else if ( attr.toolIndex != undefined ) {
            console.log( "adding switch tool callback", activate)
            activate && state.activate.callbacks.push( () => {
                console.info("Switch tool callback")
                this.switchTool( component, attr.toolIndex, typeof attr.toolHand == 'number' ? attr.toolHand : 0 )
            })

            hover && state.hover.callbacks.push( () => {
                state.hover.cursorHovering = true
                component.mesh.material.wireframe = true
            })

            lookAway && state.lookAway.callbacks.push( () => {
                state.hover.cursorHovering = false
                component.mesh.material.wireframe = false
            })

        } else if ( attr.currentTool != undefined ) {

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

    switchTool ( component: Component, tool: number, hand: number ) {

        let toolbox = this.world.user.toolbox,
            currentTools = toolbox.currentTools,
            tools = toolbox.tools,
            attrs = component.attrs,
            state = component.state,
            entity = component.entity,
            toolUIs = entity.componentsByProp.toolUI
        
        toolUIs.forEach( ui => {
            if ( ui.attrs.toolUI.currentTool ) {
                ui.mesh.position.set( -0.050 + 0.3333 * hand, 0, -0.3333 )
                //ui.mesh.updateMatrix()
            }
        })
        toolbox.useTool( tool, hand, true )
    }

    updatePosition ( component: Component ) {

      let mesh = component.entity.mesh,
          userMesh = this.world.user.avatar.mesh,
          userPos = userMesh.position,
          pPos = mesh.position

      mesh.position.set( userPos.x, userPos.y, userPos.z )
      mesh.rotation.y = three.camera.rotation.y
      mesh.updateMatrix()
      mesh.translateZ( -1.5 )
      mesh.translateX(  0.1 )
      mesh.translateY( -2.25 )
      mesh.updateMatrix()
    }

    hide ( component: Component ) {
      component.entity.mesh.visible = false
    }

    show ( component: Component ) {
      component.entity.mesh.visible = true
      this.updatePosition( component )
    }
}

