import Tool from '../../../../world/tool'
import Entity from '../../../../core/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class GeometryTool extends Tool {
  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

      let cameraPos = world.three.camera.position,
          coords = GLOBAL_SPACE

      this.mesh = null
      this.name = "Geometry Tool"
      this.options = {
        shape: 'box', 
        size: [1.1, 1.1, 0.110]
      }
      this.entity = new Entity(-1, [
          {
            attrs: {
              geometry: {
                shape: "box",
                size: [ 0.5, 0.5, 0.4 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Geometries",
                  color: 0xff8007,
                  content: {
                    attrs: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "attr", // entity, attr
                        attrName: "geometry",
                        dataSource: this.world.systems.assets.attrs.geometry
                      },
                      layout: {
                        type: "grid",
                        mode: "factory", // child components will ignore layout
                        columns: 3
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Geometry")
            ]
          }
        ], coords )
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
          entityId        = selected ? selected.id : -1,
          size            = [1,1,1]
          
      console.log(" ( Geometry Tool ) ", componentPath )
      
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
        console.log("set geometry", component)
        if (component.attrs.geometry.size) {
          component.attrs.geometry = Object.assign( {}, cursorComponent.attrs.geometry, this.options, { size: component.attrs.geometry.size } )  
        } else {
          component.attrs.geometry = Object.assign( {}, cursorComponent.attrs.geometry, this.options ) 
        }
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

      let newComp = null,
          oldComp = null

      if ( typeof config == 'object' && Object.keys(config).length > 0 ) {
      
        this.options = Object.assign( {}, this.options, { shape: config.data.shape } )
        console.log("Configuring tool ", this.options)
        oldComp = this.entity.components[0]
        newComp = Object.assign( {}, oldComp, {
          attrs: Object.assign( {}, oldComp.attrs, {
            geometry: Object.assign( {}, oldComp.attrs.geometry, this.options )
          })
        })
        this.entity.update( false, false, false, newComp, [0] )
      } 
    }

    generatePreview( component, preset, data ) {

      let preview = null

      return preview
    }
}