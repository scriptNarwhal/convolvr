import Tool from '../../../../world/tool'
import Entity from '../../../../model/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class AttributeTool extends Tool {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)

    let cameraPos = world.three.camera.position,
        coords = GLOBAL_SPACE

    this.mesh = null;
    this.name = "Attribute Tool"
    this.options = {
      system: {
        none: true
      }
    }
    this.all = [ "structures", "vehicles", "media", "interactivity" ]
    this.current = 0
    
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
                panels: [
                  {
                    title: "Attributes",
                    color: 0xff0707,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "attr", // entity, component, attr
                          attrName: "structures",
                          dataSource: this.world.systems.assets.attrs.systems
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },
                  {
                    title: "Vehicular",
                    color: 0xff0707,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "attr", // entity, component, attr
                          attrName: "vehicles",
                          dataSource: this.world.systems.assets.attrs.systems
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },
                  {
                    title: "Media",
                    color: 0xff0707,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "attr", // entity, component, attr
                          attrName: "media",
                          dataSource: this.world.systems.assets.attrs.systems
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },
                  {
                    title: "Interactivity",
                    color: 0xff0707,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "attr", // entity, component, attr
                          attrName: "interactivity",
                          dataSource: this.world.systems.assets.attrs.systems
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  }
                ]
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
          user            = this.world.user,
          systems         = this.world.systems,
          assetSystem     = systems.assets,
          cursorSystem    = systems.cursor,
          cursorState     = cursor.state.cursor || {},
          componentPath   = cursorState.componentPath,
          position        = telemetry.position,
          quat            = telemetry.quaternion,
          selected        = !!cursorState.entity ? cursorState.entity : false,
          coords          = telemetry.voxel,
          attrs           = {},
          components      = [ ],
          component       = {},
          cursorComponent = cursorState.component,
          entity          = telemetry.entity,
          entityId        = selected ? selected.id : -1
      
      if ( options.system && options.system.none ) return

      attrs = selected.componentsByAttr
      
      if ( !!!selected || attrs.miniature || attrs.activate ) {
          console.warn("no tool action, calling activation callbacks")
          return false 
      } else {
          coords = selected.voxel
      }

      if ( !! cursorComponent && !! selected ) {
        componentPath = cursorComponent.path
        component = Object.assign({}, {
          position: cursorComponent.data.position,
          quaternion: cursorComponent.data.quaternion,
          attrs: cursorComponent.attrs,
          components: cursorComponent.components
        })
        console.log("set system", this.preset, this.options, component)
        component.attrs[ this.preset ] = this.options
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
        this.options = Object.assign( {}, config.data )
        this.preset = config.preset
        console.log("Configuring tool ", this.options)
      }
  }

  generatePreview( component, preset, data ) {
    let preview = null
    
    return preview
  }
    
}
