import Tool from './tool'
import { GRID_SIZE } from '../../../../config'

export default class CustomTool extends Tool {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)

    let cameraPos = world.three.camera.position,
       coords =  [ cameraPos.x, 0, cameraPos.z ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )


      this.mesh = null
      this.name = data ? data.name : "New Custom Tool"
      this.options = {

      }

    }


    primaryAction () {

    }

    secondaryAction (telemetry, value) {

    }
    
    configure ( config ) {

    }

    generatePreview( component, preset, data ) {
      
      let preview = null
      
      return preview
      
    }

}
