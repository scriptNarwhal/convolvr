import Tool from '../../../../world/tool'
import Entity from '../../../../model/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class TextTool extends Tool {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)

    let cameraPos = world.three.camera.position,
        coords = GLOBAL_SPACE

    this.mesh = null;
    this.name = "Text Editor"
    this.options = ["Hello World"]
    
    this.entity = new Entity(-1, [
          {
            attrs: {
              geometry: {
                shape: "box",
                size: [0.08, 0.5, 2]
              },
              material: {
                name: "metal"
              },
              tool: {
                  panel: {
                    title: "Text Editor",
                    color: 0x1e1f1c,
                    content: {
                      attrs: {
                        text: {
                            lines: [
                                "# Click Here",
                                "  to start editing "
                            ],
                            background: "#272822",
                            color: "#a6e22e"
                        }

                      }
                    }
                  }
              }
            },
            components: [
              this.initLabel( false, "Attribute")
            ]
          }
        ], null, null, coords)
        
    }

    primaryAction (telemetry) {
      let options         = this.options,
          cursor          = telemetry.cursor,
          cursorState     = cursor.state.cursor || {},
          componentPath   = cursorState.componentPath,
          selected        = !!cursorState.entity ? cursorState.entity : false,
          coords          = telemetry.voxel,
          attrs           = {},
          components      = [ ],
          component       = {},
          cursorComponent = cursorState.component,
          entity          = telemetry.entity,
          entityId        = selected ? selected.id : -1
      
     if ( !!!selected || attrs.miniature || attrs.activate ) {
          console.warn("no tool action, calling activation callbacks")
          return false 
      } else {
          coords = selected.voxel;
      }

      if ( !! cursorComponent && !! selected ) {
        componentPath = cursorComponent.path
        component = Object.assign({}, {
          position: cursorComponent.data.position,
          quaternion: cursorComponent.data.quaternion,
          attrs: cursorComponent.attrs,
          components: cursorComponent.components
        });
        const attr = component.attrs.text;

        if (attr) {
            component.state.text.update({
                lines: this.options
            })
        } else {
            this.world.systems.extendComponent(component, "text", {
                lines: this.options,
                color: "#ffffff", 
                background:  "#000000"
            })
        }

        components = [ component ]

      } else {
        return false
      }

      return {
        coords,
        component,
        components,
        componentPath,
        entity,
        entityId,
        components
      }
        
    }

    secondaryAction ( telemetry, value) {
      
    }

    configure ( config ) {
      if ( typeof config == 'object' && Object.keys(config).length > 0 ) {
        this.options = config.data;
        this.preset = config.preset;
        console.log("Configuring tool ", this.options)
      }
  }

  generatePreview( component, preset, data ) {
    let preview = null
    
    return preview
  }
    
}
