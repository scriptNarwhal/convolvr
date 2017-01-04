import Entity from './entity'

export default class EntityGenerator {
  constructor () {
    this.entities = []
    this.init()
  }
  makeEntity (type) {
    return this.entities[type]
  }
  init () {
    this.entities["panel"] = {
      id: 0,
      components: [
        {
          type: "structure",
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [0, 0, 0]
        }
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
    this.entities["block"] = {
      id: 0,
      components: [
        {
          type: "structure",
          shape: "box",
          size: [4000, 4000, 4000],
          color: 0xff0000,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [0, 0, 0]
        }
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
    this.entities["column"] = {
      id: 0,
      components: [
        {
          type: "structure",
          shape: "box",
          size: [3000, 24000, 3000],
          material: "plastic",
          color: 0x808080,
          text: "",
          quaternion: null,
          position: [0, 0, 0]
        }
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
    this.entities["wirebox"] = {
      id: 0,
      components: [
        {
          type: "structure",
          shape: "box",
          size: [10000, 10000, 10000],
          material: "wireframe",
          color: 0x808080,
          text: "",
          quaternion: null,
          position: [0, 0, 0]
        }
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
  }
}
