import Tool from './tool'
import Component from '../../component'
import Entity from '../../entity'
import ComponentGenerator from '../../assets/component-generator'

export default class ComponentTool extends Tool {
  constructor ( data, world, toolbox ) {

    super( data, world, toolbox )

        this.mesh = null;
        this.name = "Component Tool"
        this.components = new ComponentGenerator()
        this.options = {
          componentType: "column"
        }
        this.all = [ "column", "panel", "panel2", "column2" ] // deprecated, migrating toward tool option panels // actually, these will turn into categories
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

    primaryAction ( telemetry, params = {} ) { // place component (into entity if pointing at one)
      
      let cursor = telemetry.cursor,
          user = this.world.user,
          cursorSystem = three.world.systems.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          componentType = !!params.component ? params.component : this.options.componentType,
          entityId = -1,
          components = [],
          component = this.components.makeComponent( componentType ),
          entity = null,
          tooManyComponents = !!selected && selected.components.length >= 48,
          coords = [ 0, 0, 0 ] 

      //console.log("Selected ", tooManyComponents, selected, selected.components)

      entity = new Entity( 0, [ component ], [ 0, 0, 0 ], quat )
      
      if ( ( !!!selected || cursorState.distance > 200000 || ( cursorState.distance < 200000 && tooManyComponents ) )
           && cursorSystem.entityCoolDown < 0 
         )  { // switch back to entity tool, if the user is clicking into empty space //  console.log("switching to entity tool for whatever reason...")
       
        user.toolbox.useTool( 1, telemetry.hand )
        user.hud.componentsByProp.toolUI[0].state.toolUI.show()
        user.toolbox.usePrimary( 0, entity  )
        return false

      }

      if ( tooManyComponents && cursorSystem.entityCoolDown > 0 ) {

        return false // stop spamming lol.. // console.log("too many components; waiting for entity cooldown; aborting")

      }

      entityId = selected.id

      if ( components.length == 0 ) {
        components = [component]
      }

      if ( !!!selected ) {
        
        return false 

      } else {

        coords = selected.voxel

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
        coords,
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
