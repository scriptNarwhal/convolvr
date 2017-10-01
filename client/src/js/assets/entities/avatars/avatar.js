import Entity from '../../../entity'
import Component from '../../../component'
// default avatar

let avatar = ( assetSystem, config, voxel ) => { // wholeBody == true == not just 'vr hands'
    
  console.log("init avatar, assetSystem ", assetSystem )

        var mesh = null, // new THREE.Object3D();
            entity = null,
            component = null,
            componentB = null,
            components = [],
            cursorRot = new THREE.Quaternion(),
            cursorComponent = null,
            cursorAxis = new THREE.Vector3( 1, 0, 0 ),
            wholeBody = !!config ? config.wholeBody : false,
            id = !!config && !!config.id ? config.id : assetSystem.autoEntityID(),
            userData = { id },
            n = 2
        
        console.log("init avatar ", id)

        cursorRot.setFromAxisAngle( cursorAxis, Math.PI / 2 )
        cursorComponent = (spotLight = false) => {
          return {
            props: {
              cursor: true,
              geometry: {
                shape: "open-cylinder", // "open-box",
                size: [ 0.05, 0.05, 0.05 ]
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
             props: { 
                geometry: {
                  shape: "box",
                  size: [ 0.12, 0.18, 0.26 ]
                },
                material: {
                  color: 0xffffff,
                  name: "plastic",
                },
                user: userData
             },
             position: [ 0, 0.05+(n - 1)*0.04, 0 ],
             quaternion: [ 0, 0, 0, 1 ]
        }
       components.push(component)
       cursorAxis.fromArray( [ 0, 1, 0 ] )
       cursorRot.setFromAxisAngle( cursorAxis, Math.PI / 2 )
       
       componentB = {
             props: { 
                geometry: {
                  shape: "frustum",
                  size: [ 0.2, 0.2, 0.2 ],
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
            props: {
              noRaycast: true,
              geometry: {
                size: [ 0.11, 0.22, 0.33 ],
                shape: "box"
              },
              material: {
                name: "metal",
                color: 0x3b3b3b,
              }
            },
            quaternion: [0, 0, 0, 1],
            position: [ 0.1+(n - 1) * 0.2, 0, 0],
            components: []
          }))
          ++n

        }

      } else {

        components.push(Object.assign({}, {
          props: {
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

      n = 0

      while (n < 2) {

        components.push(Object.assign({}, {
          props: {
            hand: n,
            noRaycast: true,
            geometry: {
              size: [0.08, 0.0125, 0.12],
              shape: "box",
              faceNormals: false
            },
            material: {
              name: "metal",
              color: 0x000000,
            }
          },
          quaternion: [0, 0, 0, 1],
          position: [(n - 1) * 0.05, 0, 0],
          components: [
            Object.assign({}, cursorComponent(false)) //n==1))
          ]
        }))
        ++n

      }
        
    entity = new Entity( id, components, [0,0,0], [0,0,0,1], voxel )
  
    return entity

}

export default avatar