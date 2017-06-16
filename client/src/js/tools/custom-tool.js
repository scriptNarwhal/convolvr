import Tool from './tool'

export default class CustomTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
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

}
