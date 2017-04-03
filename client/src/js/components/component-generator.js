export default class ComponentGenerator {
  constructor () {
    this.components = []
    this.init()
  }
  makeComponent (type) {
    return this.components[type]
  }
  init () {
    this.components["panel"] = {
      props: {
        geometry: {
          shape: "box",
          size: [16000, 16000, 1000]
        },
        material: {
          color: 0x404040,
          name: "plastic"
        }
      },
      quaternion: null,
      position: [0, 0, 0]
    }
    this.components["column"] = {
      props: {
        geometry: {
          shape: "hexagon",
          size: [8000, 40000, 8000]
        },
        material: {
          color: 0x404040,
          name: "plastic"
        }
      },
      quaternion: null,
      position: [0, 0, 0]
    }
    this.components["panel2"] = {
      props: {
        geometry: {
          shape: "box",
          size: [16000, 16000, 1000]
        },
        material: {
          color: 0x404040,
          name: "plastic"
        }
      },
      quaternion: null,
      position: [0, 0, 0]
    }
    this.components["column2"] = {
      props: {
        geometry: {
          shape: "box",
          size: [6000, 58000, 6000]
        },
        material: {
          color: 0x404040,
          name: "plastic"
        }
      },
      quaternion: null,
      position: [0, 0, 0]
    }
  }
}
