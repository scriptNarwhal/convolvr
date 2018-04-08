import Entity from '../../../core/entity'
import Component from '../../../core/component'
import chatText from '../../components/chat-text'

let THREE = (window as any).THREE;
// default avatar
let avatar = (assetSystem: any, config: any, voxel: number[]) => { // wholeBody == true == not just 'vr hands'
  
  console.log("init avatar: config: ", config )
        let mesh = null, // new THREE.Object3D();
            entity = null,
            component = null,
            componentB = null,
            components = [],
            cursorRot = new THREE.Quaternion(),
            cursorComponent = null,
            cursorAxis = new THREE.Vector3( 1, 0, 0 ),
            wholeBody = !!config ? config.wholeBody : false,
            id = !!config && !!config.id ? config.id : assetSystem.autoEntityID(),
            userData = { 
              id: config.userId, 
              name: config.userName ? config.userName : id,
              data: assetSystem.world.user.data ? 
                assetSystem.world.user.data : 
                { avatar: "default" } 
            },
            n = 2
        
        console.log("init avatar ", id)
        cursorRot.setFromAxisAngle( cursorAxis, Math.PI / 2 )
        cursorComponent = (spotLight = false) => {
          return {
            attrs: {
              cursor: true,
              geometry: {
                shape: "open-cylinder", // "open-box",
                size: [ 0.10, 0.10, 0.1 ]
              },
              material: {
                name: "wireframe",
                color: 0xffffff
              },
              light: {
                type: spotLight ? "spot" : "point",
                intensity: 0.86,
                color: 0xffffff,
                distance: 1.500
              }
            },
            position: [ 0, 0, 0 ],
            quaternion: cursorRot.toArray()
          }
          
        }

      if ( wholeBody ) {
        component = {
             attrs: { 
                geometry: {
                  shape: "box",
                  size: [ 0.48, 0.72, 0.48 ]
                },
                material: {
                  color: 0xffffff,
                  name: "plastic",
                },
                user: userData
             },
             position: [ 0, 0.2+(n - 1)*0.16, 0 ],
             quaternion: [ 0, 0, 0, 1 ]
        }
       components.push(component)
       cursorAxis.fromArray( [ 0, 1, 0 ] )
       cursorRot.setFromAxisAngle( cursorAxis, Math.PI / 2 )
       
       componentB = {
             attrs: { 
                geometry: {
                  shape: "frustum",
                  size: [ 0.8, 0.8, 0.8 ],
                },
                material: {
                  color: 0xf0f0f0,
                  name: "metal",
                }
             },
             position: [ 0, (n - 1)*0.025, 0 ],
             quaternion: cursorRot.toArray()
         }
         components.push( componentB )
         n = 0
      
        while (n < 2) {
          components.push(Object.assign({}, {
            attrs: {
              noRaycast: true,
              geometry: {
                size: [ 0.44, 0.88, 0.66 ],
                shape: "box"
              },
              material: {
                name: "metal",
                color: 0x3b3b3b,
              }
            },
            quaternion: [0, 0, 0, 1],
            position: [ 0.4+(n - 1) * 0.8, 0, 0],
            components: []
          }))
          ++n
        }
      } else {
        components.push(Object.assign({}, {
          attrs: {
            geometry: {
                shape: "box",
                size: [ 1, 1, 1 ],
            },
            material: {
              color: 0xffffff,
              name: "plastic"
            },
            user: userData
          },
          position: [ 0, 0, 0 ],
          quaternion: [ 0, 0, 0, 1 ],
          components: [
            Object.assign( {}, cursorComponent(false) )
          ]
        }))
      }
      n = 0;
      while (n < 2) {
        components.push(Object.assign({}, {
          attrs: {
            hand: n,
            noRaycast: true,
            geometry: {
              size: [0.16, 0.05, 0.24],
              shape: "box",
              faceNormals: false
            },
            material: {
              name: "metal",
              color: 0x000000,
            }
          },
          quaternion: [0, 0, 0, 1],
          position: [(n - 1) * 1.2, -3, 0],
          components: [
            Object.assign({}, cursorComponent(false)) //n==1))
          ]
        }))
        ++n
      }
    components.push( chatText(config) )
    entity = new Entity( id, components, [0,0,0], [0,0,0,1], voxel )

    return entity
}

export default avatar