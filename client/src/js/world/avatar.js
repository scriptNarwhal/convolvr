import Entity from '../entities/entity'
import Component from '../components/component'

let cursorAxis = new THREE.Vector3( 1, 0, 0 )

export default class Avatar {

    constructor (id, wholeBody, data) { // wholeBody == true == not just 'vr hands'
        var mesh = null, // new THREE.Object3D();
            entity = null,
            component = null,
            componentB = null,
            components = [],
            userInput = three.world.userInput,
            cursorRot = new THREE.Quaternion(),
            cursorComponent = null,
            n = 2
        
        cursorRot.setFromAxisAngle(cursorAxis, Math.PI / 2 )
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
        }

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
        n = 0
        while (n < 2) {
          components.push(Object.assign({}, {
            props: {
                hand: n,
                noRaycast: true,
                geometry: {
                  size: [2200, 1200, 3200],
                  shape: "box"
                },
                material: {
                  name: "metal",
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
      }
        
        entity = new Entity(id, components)
        entity.init(three.scene)
        this.entity = entity
        this.mesh = entity.mesh
        this.hands = entity.hands
        this.cursors = entity.cursors
        this.wholeBody = wholeBody
        this.data = data
        console.log("Init Avatar: Tracked Controls", userInput.trackedControls)
        if (!wholeBody && userInput.trackedControls == false && userInput.leapMotion == false) {
          this.toggleTrackedHands(false)
        }
    }

    toggleTrackedHands (toggle = true) {
      console.log('toggle hands', toggle)
      let scene = window.three.scene,
          position = this.mesh.position,
          avatar = this

      this.hands.map((hand, i) => {
        //hand.parent.remove(hand)
        if (toggle) { 
            //this.headMountedCursor.mesh.visible = false // activate under certain conditions..
            scene.add(hand)
            hand.position.set(position.x -6000+ i*12000, position.y -12000, position.z -6000)
            if (i > 0) {
              if (!!hand.children[0]) {
                hand.children[0].visible = true
              }  
            }
        } else {
            this.mesh.add(hand)
            if (i > 0) {
              if (!!hand.children[0]) {
                hand.children[0].visible = false
              }  
            }
            hand.position.set(-6000+ i*12000, -6000, -6000)
        }
        hand.updateMatrix()
      })
    }
}
