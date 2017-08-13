import Entity from '../../../entity'
import Component from '../../../component'
/* car.js / halo style, two front seats, one turret as back seat */

let cursorAxis = new THREE.Vector3( 1, 0, 0 )

let car = ( assetSystem, config, voxel ) => {  // implement

        var mesh = null,
            entity = null,
            component = null,
            componentB = null,
            components = [],
            userInput = three.world.userInput,
            cursorRot = new THREE.Quaternion(),
            cursorComponent = null,
            id = !!config && !!config.id ? config.id : assetSystem.autoEntityID(),
            n = 2

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

        components.push(Object.assign({}, {
          props: {
            geometry: {
                shape: "box",
                size: [ 15000, 2000, 25000 ],
            },
            material: {
              color: 0xffffff,
              name: "plastic"
            }
          },
          position: [ 0, 0, 0 ],
          quaternion: false,
          components: [
            Object.assign( {}, cursorComponent )
          ]
        }))
        
    entity = new Entity( id, components )
  
    return entity

}

export default car