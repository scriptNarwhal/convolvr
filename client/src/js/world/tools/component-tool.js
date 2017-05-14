import Tool from './tool'
import Component from '../../component'
import Entity from '../../entity'
import ComponentGenerator from '../../component-generator'
import EntityGenerator from '../../entity-generator'

export default class ComponentTool extends Tool {
  constructor ( data, world, toolbox ) {

    super( data, world, toolbox )

        this.mesh = null;
        this.name = "Component Tool"
        this.icon = this.initIcon()
        this.entities = new EntityGenerator()
        this.components = new ComponentGenerator()
        this.options = {
          componentType: "panel"
        }
        this.all = ["panel", "column", "panel2", "column2"] // deprecated, migrating toward tool option panels
        this.current = 0
        this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [2600, 2200, 8000]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Components",
                  color: 0x003bff,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "component", // entity, prop
                        dataSource: this.world.systems.assets.components
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel("Component")
            ]
          }
        ])

    }

    initIcon () {

      this.entities = this.entities || new EntityGenerator()
      let entity = this.entities.makeEntity( "icon", true )

      entity.components.push({
        props: {
          geometry: {
            shape: "box",
            size: [4500, 4500, 4500]
          },
          material: {
            name: 'metal',
            color: 0x003bff
          }
        },
        position: [0, 0, 0],
        quaternion: null
      })

      return entity

    }

    primaryAction ( telemetry, params = {} ) { // place component (into entity if pointing at one)
      
      let cursor = telemetry.cursor,
          cursorSystem = three.world.systems.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          componentType = !!params.component ? params.component : this.options.componentType,
          entityId = -1,
          components = [],
          component = this.components.makeComponent( componentType ),
          entity = null

      entity = new Entity( 0, [component], [0, 0, 0], quat )
      
      if ( (!!!selected || cursorState.distance > 165000 ) && cursorSystem.entityCoolDown < 0 )  { // switch back to entity tool, if the user is clicking into empty space
      
        this.world.user.toolbox.useTool( 0, 0 )
        this.world.user.hud.show()
        this.world.user.toolbox.usePrimary( 0, entity )
        return false

      }

      entityId = selected.id

      if ( components.length == 0 ) {
        components = [component]
      }

      !!selected && !!selected.mesh && selected.mesh.updateMatrixWorld()
      let selectedPos = !!selected && !!selected.mesh ? selected.mesh.localToWorld(new THREE.Vector3()) : false
      
      components.map(( comp, i ) => { // apply transformation and offset to components

        if ( !!comp ) {

          if ( selectedPos ) {

            comp.position = [
              position[0] - selectedPos.x,
              position[1] - selectedPos.y,
              position[2] - selectedPos.z
            ]

          }
          
          comp.quaternion = quat

        }

      })

      return {
        entity,
        entityId,
        components
      }

    }

    secondaryAction ( telemetry, value ) {

      this.current += value // cycle components

      if (this.current >= this.all.length) {

        this.current = 0

      } else if (this.current < 0) {

        this.current = this.all.length - 1

      }

      this.options.componentType = this.all[this.current]
      return false // no socket event

    }

}
