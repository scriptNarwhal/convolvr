import Entity from './entity'

export default class EntityGenerator {
  constructor () {
    this.entities = []
    this.init()
  }
  makeEntity (type, instantiate) {
    if (!!instantiate) {
      let ent = this.entities[type]
      return new Entity (0, ent.components, ent.aspects, ent.position, ent.quaternion)
    } else {
      return this.entities[type]
    }

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
    this.entities["icon"] = {
      id: 0,
      components: initButtonComponents(),
      aspects: [],
      position: null,
      quaternion: null
    }
  }
}

function initButtonComponents (data) {
  let color = data && data.color ? data.color : 0x404040,
      components = [],
      x = 2
  components.push({
      props:{
        activates: true,
        gazeOver: true
      },
      shape: "node",
      material: "basic",
      size: [0, 0, 0],
      position: [0,0,0],
      color: 0
  })
  while (x > 0) {
    components.push({
      props: {},
      shape: "box",
      size: [160, 10000, 4000],
      position: [-5000+(x>1?10000:0), 0, 0],
      color: color,
      quaternion: null
    })
    x --
  }
  x = 2;
  while (x > 0) {
    components.push({
      props: {},
      shape: "box",
      size: [10000, 160, 4000],
      position: [0, -5000+(x>1?10000:0), 0],
      color: color,
      quaternion: null
    })
    x --
  }
  return components
}
