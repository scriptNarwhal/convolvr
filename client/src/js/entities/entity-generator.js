import Entity from './entity'

export default class EntityGenerator {
  constructor () {
    this.entities = []
    this.init()
  }
  makeEntity (type, instantiate) {

    if (!!instantiate) {

      let ent = this.entities[type]
      return new Entity (0, ent.components, ent.position, ent.quaternion)
    
    } else {

      return this.entities[type]

    }

  }
  init () {
    this.entities["panel"] = {
      id: 0,
      components: [
        {
          props: {
            geometry: {
              merge: true, //can be combined to save cpu
              shape: "box",
              size: [42000, 42000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            },
            // audio: { // remove this.. merely a test
            //   asset: "/sounds/Partition.wav[Re-Edit].ogg"
            // }
          },
          quaternion: null,
          position: [0, 0, 0]
        },
        {
          props: {
            geometry: {
              merge: true,
              shape: "box",
              size: [42000, 42000, 1500]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [-250, -200, 400]
        }
      ],
      position: null,
      quaternion: null
    }
    this.entities["panel2"] = {
      id: 0,
      components: [
        {
          props: {
            geometry: {
              merge: true,
              shape: "hexagon",
              size: [28000, 28000, 1500]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [-4625, 0, 0]
        },
        {
          props: {
            geometry: {
              merge: true,
              shape: "torus",
              size: [42000, 42000, 15000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [4625, 0, 0]
        },
        {
          props: {
            geometry: {
              merge: true,
              shape: "hexagon",
              size: [28000, 28000, 15000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [-10250, 0, 0]
        },
        {
          props: {
            geometry: {
              merge: true,
              shape: "cylinder",
              size: [18000, 18000, 1500]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [10250, 0, 0]
        },
      ],
      position: null,
      quaternion: null
    }
    this.entities["panel3"] = {
      id: 0,
      components: [
        {
         props: {
            geometry: {
              merge: true,
              shape: "box",
              size: [42000, 42000, 4000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [-0, 10250, 0]
        },
        {
          props: {
            geometry: {
              merge: true,
              shape: "hexagon",
              size: [18000, 18000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [0, 4625, 0]
        },
        {
         props: {
            geometry: {
              merge: true,
              shape: "box",
              size: [10000, 22000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [-0, -10250, 0]
        },
        {
          props: {
            geometry: {
              merge: true,
              shape: "hexagon",
              size: [28000, 18000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [0, -4625, 0]
        },
      ],
      position: null,
      quaternion: null
    }
    this.entities["block"] = {
      id: 0,
      components: [
        {
          props: {
            geometry: {
              merge: true,
              shape: "box",
              size: [42000, 42000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [0, 0, 0]
        }
      ],
      position: null,
      quaternion: null
    }
    this.entities["column"] = {
      id: 0,
      components: [
        {
         props: {
            geometry: {
              merge: true,
              shape: "box",
              size: [10000, 22000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [0, 0, 0]
        },{
         props: {
            geometry: {
              merge: true,
              shape: "hexagon",
              size: [16000, 18000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [0, -16000, 0]
        },{
          props: {
            geometry: {
              merge: true,
              shape: "hexagon",
              size: [18000, 18000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [0, 16000, 0]
        }
      ],
      position: null,
      quaternion: null
    }
    this.entities["wirebox"] = {
      id: 0,
      components: [
        {
          props: {
            geometry: {
              merge: true,
              shape: "hexagon",
              size: [16000, 16000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [0, 0, 0]
        },
        {
          props: {
            geometry: {
              merge: true,
              shape: "torus",
              size: [16000, 16000, 1000]
            },
            material: {
              color: 0x808080,
              name: "plastic"
            }
          },
          quaternion: null,
          position: [0, 0, 0]
        }
      ],
      position: null,
      quaternion: null
    }
    this.entities["icon"] = {
      id: 0,
      components: initButtonComponents(),
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
        gazeOver: true,
        geometry: {
          
          shape: "node",
          size: [0, 0, 0]
        },
        material: {
          name: "plastic",
          color: 0
        }
      },
      position: [0,0,0],
  })
  while (x > 0) {
    components.push({
      props: {
        geometry: {
          //merge: true,
          size: [160, 10000, 4000],
          shape: "box"
        },
        material: {
          color: color,
          name: "plastic"
        }
      },
      position: [-5000+(x>1?10000:0), 0, 0],
      quaternion: null
    })
    x --
  }
  x = 2;
  while (x > 0) {
    components.push({
      props: {
        geometry: {
          //merge: true,
          size: [10000, 160, 4000],
          shape: "box"
        },
        material: {
          color: color,
          name: "plastic"
        }
      },
      position: [0, -5000+(x>1?10000:0), 0],
      quaternion: null
    })
    x --
  }
  return components
}
