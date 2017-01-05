export default class ComponentGenerator {
  constructor () {
    this.components = []
    this.init()
  }
  makeEntity (type) {
    return this.components[type]
  }
  init () {
    this.components["panel"] = {
      type: "structure",
      shape: "box",
      size: [8000, 8000, 200],
      color: 0x404040,
      material: "plastic",
      text: "",
      quaternion: null,
      position: [0, 0, 0]
    }
    this.components["block"] = {
      type: "structure",
      shape: "box",
      size: [4000, 4000, 4000],
      color: 0xff0000,
      material: "plastic",
      text: "",
      quaternion: null,
      position: [0, 0, 0]
    }
    this.components["column"] = {
        type: "structure",
        shape: "box",
        size: [3000, 24000, 3000],
        material: "plastic",
        color: 0x808080,
        text: "",
        quaternion: null,
        position: [0, 0, 0]
    }
    this.components["wirebox"] = {
      type: "structure",
      shape: "box",
      size: [10000, 10000, 10000],
      material: "wireframe",
      color: 0x808080,
      text: "",
      quaternion: null,
      position: [0, 0, 0]
    }
  }
}
