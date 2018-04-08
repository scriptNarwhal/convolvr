import Entity from '../../../core/entity'
import Component from '../../../core/component'
import chatText from '../../components/chat-text'

let THREE = (window as any).THREE;
let hero = (assetSystem: any, config: any, voxel: number[]) => { // wholeBody == true == not just 'vr hands'

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
            heroMatProp = {
              color: 0xffffff,
              name: "basic",
              repeat: ["wrapping", 1, 1],
              config: {
                transparent: true
              }
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
             attrs: { 
                geometry: {
                  shape: "box",
                  size: [ 1.5, 1.5, 0.01 ]
                },
                material: {
                  ...heroMatProp,
                  map: "/data/images/textures/beings/hero/hero-back-512.png"
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
             attrs: { 
                geometry: {
                  shape: "box",
                  size: [ 0.01, 1.5, 1.5 ],
                },
                material: {
                  ...heroMatProp,
                  map: "/data/images/textures/beings/hero/hero-side-512.png"
                },
             },
             position: [ 0, 0, 0 ],
             quaternion: [0,0,0,1]
         }
         components.push( componentB )
        
         components.push({
            attrs: { 
              geometry: {
                shape: "box",
                size: [ 1.5, 1.5, 0.01 ],
              },
              material: {
                ...heroMatProp,
                map: "/data/images/textures/beings/hero/hero-front-512.png"
              },
          },
          position: [ 0, 0, -0.01 ],
          quaternion: [0,0,0,1]
         })
      

      } else {

        components.push(Object.assign({}, {
          attrs: {
            geometry: {
                shape: "box",
                size: [ 0.25, 0.25, 0.25 ],
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
          attrs: {
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
        
    components.push( chatText( config ) )
    entity = new Entity( id, components, [0,0,0], [0,0,0,1], voxel )
    return entity
}

export default hero