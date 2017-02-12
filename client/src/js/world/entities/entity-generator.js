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
          props: { structure: true },
          shape: "box",
          size: [10000, 10000, 400],
          color: 0xf5f5f5,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [-0, 0, 0]
        },
        {
          props: { structure: true },
          shape: "box",
          size: [9000, 9000, 400],
          color: 0xf5f5f5,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [-250, -200, 400]
        }
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
    this.entities["panel2"] = {
      id: 0,
      components: [
        {
          props: { structure: true },
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [-4625, 0, 0]
        },
        {
          props: { structure: true },
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [4625, 0, 0]
        },
        {
          props: { structure: true },
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [-10250, 0, 0]
        },
        {
          props: { structure: true },
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [10250, 0, 0]
        },
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
    this.entities["panel3"] = {
      id: 0,
      components: [
        {
          props: { structure: true },
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [-0, 10250, 0]
        },
        {
          props: { structure: true },
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [0, 4625, 0]
        },
        {
          props: { structure: true },
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [-0, -10250, 0]
        },
        {
          props: { structure: true },
          shape: "box",
          size: [8000, 8000, 200],
          color: 0x404040,
          material: "plastic",
          text: "",
          quaternion: null,
          position: [0, -4625, 0]
        },
      ],
      aspects: [],
      position: null,
      quaternion: null
    }
    this.entities["block"] = {
      id: 0,
      components: [
        {
          props: { structure: true },
          shape: "box",
          size: [6000, 6000, 6000],
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
          props: { structure: true },
          shape: "box",
          size: [3000, 32000, 3000],
          material: "plastic",
          color: 0xffffff,
          text: "",
          quaternion: null,
          position: [0, 0, 0]
        },{
          props: { structure: true },
          shape: "box",
          size: [6000, 2000, 6000],
          material: "plastic",
          color: 0xffffff,
          text: "",
          quaternion: null,
          position: [0, -16000, 0]
        },{
          props: { structure: true },
          shape: "box",
          size: [6000, 2000, 6000],
          material: "plastic",
          color: 0xffffff,
          text: "",
          quaternion: null,
          position: [0, 16000, 0]
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
          props: { structure: true },
          shape: "box",
          size: [12000, 12000, 12000],
          material: "wireframe",
          color: 0xff00ff,
          text: "",
          quaternion: null,
          position: [0, 0, 0]
        },
        {
          props: { structure: true },
          shape: "box",
          size: [6000, 6000, 6000],
          material: "wireframe",
          color: 0xffffff,
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
