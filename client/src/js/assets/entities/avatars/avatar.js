import Entity from '../../../entity'
import Component from '../../../component'
// default avatar

let cursorAxis = new THREE.Vector3( 1, 0, 0 )

let avatar = ( assetSystem, config ) => { // wholeBody == true == not just 'vr hands'
    
  console.log("init avatar, assetSystem ", assetSystem )

        var mesh = null, // new THREE.Object3D();
            entity = null,
            component = null,
            componentB = null,
            components = [],
            userInput = three.world.userInput,
            cursorRot = new THREE.Quaternion(),
            cursorComponent = null,
            wholeBody = !!config ? config.wholeBody : false,
            id = !!config && !!config.id ? config.id : assetSystem.autoEntityID(),
            userData = { id },
            n = 2
        
        console.log("init avatar ", id)

        cursorRot.setFromAxisAngle( cursorAxis, Math.PI / 2 )
        cursorComponent = {
          props: {
              cursor: true,
              geometry: {
                shape: "open-box",
                size: [ 1500, 1500, 1500 ]
              },
              material: {
                name: "wireframe",
                color: 0xffffff
              },
              light: {
                type: "point",
                intensity: 0.9,
                color: 0xffffff,
                distance: 20000
              }
            },
            position: [ 0, 0, 0 ],
            quaternion: cursorRot.toArray()
        }

      if ( wholeBody ) {

        component = {
             props: { 
                geometry: {
                  shape: "cylinder",
                  size: [ 1800, 1200, 1800 ]
                },
                material: {
                  color: 0xffffff,
                  name: "plastic",
                },
                user: userData
             },
             position: [ 0, (n-1)*600, 0 ],
             quaternion: [ 0, 0, 0, 1 ]
        }
       components.push(component)
       componentB = {
             props: { 
                geometry: {
                  shape: "octahedron",
                  size: [ 2800, 2800, 2800 ],
                },
                material: {
                  color: 0xffffff,
                  name: "wireframe",
                }
             },
             position: [ 0, (n-1)*600, 0 ],
             quaternion: [ 0, 0, 0, 1 ]
         }
         components.push( componentB )

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
            Object.assign( {}, cursorComponent )
          ]
        }))

      }

      n = 0

        while ( n < 2 ) {

          components.push(Object.assign({}, {
            props: {
                hand: n,
                noRaycast: true,
                geometry: {
                  size: [2200, 1200, 3200],
                  shape: "box",
                  faceNormals: false
                },
                material: {
                  name: "metal",
                  color: 0xffffff,
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [(n-1)*1500, 0, 0],
            components: [
              Object.assign( {}, cursorComponent )
            ]
          }))
          ++n

        }
        
    entity = new Entity( id, components, [0, 0, 0], [ 0, 0, 0, 1 ] )
  
    return entity

}

export default avatar