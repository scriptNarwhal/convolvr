import Entity from './entity'

export default class EntityGenerator {
  constructor () {
    this.entities = []
    this.entities["panel"] = {
      id: 0,
      components: [
        {
          type: "structure",
          shape: "box",
          size: {x: 2000, y: 2000, z: 200},
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
      id: 1,
      components: [
        {
          type: "structure",
          shape: "box",
          size: {x: 2000, y: 2000, z: 2000},
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
      id: 2,
      components: [
        {
          type: "structure",
          shape: "box",
          size: {x: 1000, y: 4000, z: 1000},
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
