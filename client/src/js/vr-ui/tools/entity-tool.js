import Tool from './tool'
import Entity from '../../entity'

export default class EntityTool extends Tool  {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)

      this.mesh = null
      this.name = "Entity Tool"
      this.options = {
        entityType: "panel"
      }
      this.all = [ "panel", "panel2", "panel3", "block", "column", "wirebox" ]  // deprecated, migrating toward tool option panels
      this.current = 0
      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [ 1600, 1200, 7000 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Entities",
                  color: 0xff0707,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "entity", // component, prop
                        // propName: "userEntities", // toggle to user's entities
                        dataSource: this.world.systems.assets.entities
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel("Entity")
            ]
          }
        ])

    }

    primaryAction ( telemetry, params = {} ) { // place entity

      let cursor = telemetry.cursor,
          cursorState = cursor.state.cursor || {},
          systems = this.world.systems,
          cursorSystem = systems.cursor,
          assetSystem = systems.assets,
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          user = this.world.user,
          entity = params.entity ? params.entity : assetSystem.makeEntity(this.options.entityType), // console.log("Entity Tool"); console.log(JSON.stringify(entity.components))
          tooManyComponents = !!selected && selected.components.length >= 48

      if ( ! tooManyComponents ) {

        if ((selected && cursorState.distance < 200000) || cursorSystem.entityCoolDown > 10 ) { // switch to component tool
            
            user.toolbox.useTool( 0, telemetry.hand )
            user.hud.componentsByProp.toolUI[0].state.toolUI.show()
            user.toolbox.usePrimary(0)
            return false

        }

      }
      
      if ( cursorSystem.entityCoolDown < 0 ) {

        return {
          entity
        }

      } else {

        return false

      }

    }

    secondaryAction ( telemetry, value ) {
      
      this.current += value // cycle entities

      if (this.current >= this.all.length) {

        this.current = 0

      } else if (this.current < 0) {

        this.current = this.all.length -1
        
      }

      this.options.entityType = this.all[this.current]
      return false // no socket event

    }

}
