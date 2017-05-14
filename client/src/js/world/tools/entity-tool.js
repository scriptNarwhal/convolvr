import Tool from './tool'
import Entity from '../../entity'
import EntityGenerator from '../../entity-generator'

export default class EntityTool extends Tool  {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)

      this.mesh = null
      this.name = "Entity Tool"
      this.icon = this.initIcon()
      this.generator = this.generator || new EntityGenerator()
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
                size: [1600, 1200, 7000]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Entities",
                  color: 0x15ff15,
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

    initIcon () {

      let mesh = null,
          entity = null
          
      this.generator = this.generator || new EntityGenerator()
      entity = this.generator.makeEntity( "icon", true )

      entity.components.push({
        props: {
          material: {
            name: "metal",
            color: 0xff0707
          },
          geometry: {
            shape: "box",
            size: [4500, 4500, 4500]
          }
        },
        position: [0, 0, 0],
        quaternion: null
      })

      return entity

    }

    primaryAction ( telemetry, params = {} ) { // place entity

      let cursor = telemetry.cursor,
          cursorState = cursor.state.cursor || {},
          cursorSystem = this.world.systems.cursor,
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          user = this.world.user,
          entity = params.entity ? params.entity : this.generator.makeEntity(this.options.entityType)
    
      // if (entity.components.length == 1) {

      //   entity.components[0].quaternion = [quat.x, quat.y, quat.z, quat.w]

      // }

      if ((selected && cursorState.distance < 164000) || cursorSystem.entityCoolDown > 30 ) { // switch to component tool
          
          user.toolbox.useTool(1, 0)
          user.hud.show()
          user.toolbox.usePrimary(0)
          return false

      }

      return {

        entity

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
