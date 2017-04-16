import Entity from '../entities/entity'
import Component from '../components/component'

export default class Avatar {

    constructor (id, wholeBody, data) { // wholeBody == true == not just 'vr hands'
        var mesh = null, // new THREE.Object3D();
            entity = null,
            component = null,
            componentB = null,
            components = [],
            userInput = three.world.userInput,
            cursorRot = new THREE.Quaternion(),
            cursorEuler = new THREE.Euler(),
            cursorComponent = {
              props: {
                cursor: true,
                geometry: {
                  shape: "open-box",
                  size: [2000, 2000, 2000]
                },
                material: {
                  name: "wireframe",
                  color: 0xffffff
                }
              },
              position: [0, 0, 0],
              quaternion: cursorRot.toArray()
            },
            n = 2

          // add cursors back here

      if (wholeBody) {
        component = {
             props: { 
                geometry: {
                  shape: "cylinder",
                  size: [1800, 1200, 1800]
                },
                material: {
                  color: 0xffffff,
                  name: "plastic",
                }
             },
             position: [0, (n-1)*600, 0],
             quaternion: false
        }
       components.push(component)
       componentB = {
             props: { 
                geometry: {
                  shape: "octahedron",
                  size: [2800, 2800, 2800],
                },
                material: {
                  color: 0xffffff,
                  name: "wireframe",
                }
             },
             position: [0, (n-1)*600, 0],
             quaternion: false
         }
         components.push(componentB)
      } else {
        components.push(Object.assign({},{
          props: {
            geometry: {
                shape: "box",
                size: [1, 1, 1],
            },
            material: {
              color: 0xffffff,
              name: "plastic"
            }
          },
          position: [0, 0, 0],
          quaternion: false,
          components: [
            Object.assign({}, cursorComponent)
          ]
        }))
      }

        n = 0
        while (n < 2) {
          components.push(Object.assign({}, {
            props: {
                hand: n,
                noRaycast: true,
                geometry: {
                  size: [2500, 1500, 4000],
                  shape: "box"
                },
                material: {
                  name: "plastic",
                  color: 0xffffff,
                }
            },
            quaternion: null,
            position: [(n-1)*1500, 0, 0],
            components: [
              Object.assign({}, cursorComponent)
            ]
          }))
          ++n
        }
        
        entity = new Entity(id, components)
        entity.init(three.scene)
        this.entity = entity
        this.mesh = entity.mesh
        this.hands = entity.hands
        this.cursors = entity.cursors
        this.wholeBody = wholeBody
        this.data = data
        if (userInput.trackedControls == false && userInput.leapMotion == false) {
          this.toggleTrackedHands(false)
        }
    }

    toggleTrackedHands (toggle = true) {
      console.log('toggle hands')
      let scene = window.three.scene
      this.hands.map((hand, i) => {
        hand.parent.remove(hand)
        if (toggle) { 
            scene.add(hand)
        } else {
            this.mesh.add(hand)
            hand.position.set(-6000+ i*12000, -4000, -6000)
            hand.updateMatrix()
        }
      })
    }
}
