import Tool from './tool'
import Entity from '../../entity'
import EntityGenerator from '../../entity-generator'
/* terrain voxel tool */
export default class SystemTool extends Tool {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)
    this.mesh = null;
    this.name = "System Tool"
    this.icon = this.initIcon()
    this.options = {

    }
    this.all = [ "structures", "vehicles", "media", "interactivity" ]
    this.current = 0
    
    this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [1600, 4200, 6000]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Systems",
                  color: 0xffff07,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "prop", // entity, prop
                        propName: "vehicles",
                        dataSource: this.world.systems.assets.props.systems
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel("System")
            ]
          }
        ])
        
    }

    initIcon () {

      let entity = null
      this.generator = this.generator || new EntityGenerator()
      entity = this.generator.makeEntity("icon", true)
      entity.components.push({
        props: {
          geometry: {
            shape: "box",
            size: [4500, 4500, 4500]
          },
          material: {
            name: 'metal',
            color: 0xffff07
          }
        },
        position: [0, 0, 0],
        quaternion: null
      })
      return entity

    }

    primaryAction ( telemetry) {
      
    }

    secondaryAction ( telemetry, value) {
      
    }
}
