import Entity from './entity'

export default class EntityGenerator {
  constructor () {
    this.entities = []
    this.entities["panel"] = {
      components: [
        {
          type: "structure",
          shape: "box",
          size: {x: 3000, y: 3000, z: 200},
          color: 0x404040,
          text: "",
          quaternion: null,
          position: {x: 0, y: 0, z: 0},
        }
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
    this.entities["block"] = {
      components: [
        {
          type: "structure",
          shape: "box",
          size: {x: 3000, y: 3000, z: 3000},
          color: 0xff0000,
          text: "",
          quaternion: null,
          position: {x: 0, y: 0, z: 0},
        }
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
    this.entities["column"] = {
      components: [
        {
          type: "structure",
          shape: "box",
          size: {x: 2000, y: 8000, z: 2000},
          color: 0x808080,
          text: "",
          quaternion: null,
          position: {x: 0, y: 0, z: 0},
        }
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
  }
  makeEntity (type) {
    let entity = this.entities[type],
        components = entity.components,
        aspects = entity.aspects,
        position = entity.position,
        quaternion = entity.quaternion
    return new Entity(-1, components, aspects, position, quaternion)
  }

}
