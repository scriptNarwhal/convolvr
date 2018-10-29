import Tool from '../../../../world/tool'
import Entity from '../../../../core/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class MaterialTool extends Tool {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)

    let cameraPos = world.three.camera.position,
        coords = GLOBAL_SPACE

    this.mesh = null
    this.name = "Material Tool"
    this.options = {
      color: 0xffffff,
      name: "",
      basic: false,
      faceNormals: true
    }

      this.entity = new Entity(-1, [{
          attrs: {
            geometry: {
              shape: "box",
              size: [ 0.5, 0.34, 1.333 ]
            },
            material: {
              name: "metal"
            },
            tool: {
              panels: [
                {
                  title: "Colors",
                  color: 0x07ffff,
                  content: {
                    attrs: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "attr", // entity, attr
                        attrName: "material",
                        dataSource: this.world.systems.assets.attrs.material.color
                      },
                      layout: {
                        type: "grid",
                        mode: "factory", // child components will ignore layout
                        columns: 3,
                        gridSize: 0.8
                      }
                    }
                  }
                }, {
                  title: "Materials",
                  color: 0x07ffff,
                  content: {
                    attrs: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "attr", // entity, attr
                        attrName: "material",
                        dataSource: this.world.systems.assets.attrs.material.material.filter((v, i, a) => { return v.name != "stars" })
                      },
                      layout: {
                        type: "grid",
                        mode: "factory", // child components will ignore layout
                        columns: 3,
                        gridSize: 0.8
                      }
                    }
                  }
                },
                

              ]
            }
          },
          components: [
            this.initLabel( false, "Material")
          ]
        }
      ], null, null, coords)
    }

    primaryAction ( telemetry ) {
      
      let color           = this.options.color,
          material        = this.options.material,
          basic           = this.options.basic,
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
          

      console.log(" ( Material Tool ) ", componentPath )
      attrs = selected.componentsByAttr
      
      if ( !!!selected || attrs.miniature || attrs.activate ) {
          console.warn("no tool action, calling activation callbacks")
          return false 
      
      } else {
          coords = selected.voxel
      }
      
      if ( !! cursorComponent && !! selected) {

        componentPath = cursorComponent.path
        component = Object.assign({}, {
          position: cursorComponent.data.position,
          quaternion: cursorComponent.data.quaternion,
          attrs: cursorComponent.attrs,
          components: cursorComponent.components
        })
        console.log("set material", component)
        component.attrs.material = Object.assign( {}, component.attrs.material, this.options )
        components = [ component ]

      } else {
        return false
      }

      return {
        coords,
        component,
        componentPath,
        entity,
        entityId,
        components
      }

    }

    secondaryAction ( telemetry, value ) {
    
    }
    
    configure ( config ) {

      let newComp = null

      if ( typeof config == 'object' && Object.keys(config).length > 0 ) {

        this.options = Object.assign( {}, this.options, config.data )
        console.log("Configuring tool ", this.options)
        newComp = Object.assign({}, this.entity.components[0], {
          attrs: Object.assign({}, this.entity.components[0].attrs, {
              material: this.options
          })
        })
        this.entity.update(false, false, false, newComp, [0] )

      }


    }

    generatePreview( component, preset, data ) {
      
      let preview = null
      
      return preview
      
    }

}
