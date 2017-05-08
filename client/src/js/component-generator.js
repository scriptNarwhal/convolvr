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
          merge: true,
          shape: "box",
          size: [42000, 42000, 1500]
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
          merge: true,
          shape: "hexagon",
          size: [12000, 30000, 12000]
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
          merge: true,
          shape: "box",
          size: [22000, 22000, 1500]
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
          merge: true,
          shape: "box",
          size: [8000, 72000, 8000]
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
