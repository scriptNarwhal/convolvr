import Entity from '../../../core/entity'
import Component from '../../../core/component'
/* battleship.. multiple decks, turrets, multiple occupants, vehicle factory / bay, runway */

let cursorAxis = new THREE.Vector3( 1, 0, 0 )

let battleship = ( assetSystem, config, voxel ) => {  // implement

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
                size: [ 150, 150, 150 ]
              },
              material: {
                name: "wireframe",
                color: 0xffffff
              },
              light: {
                type: "point",
                intensity: 0.9,
                color: 0xffffff,
                distance: 0.090
              }
            },
            position: [ 0, 0, 0 ],
            quaternion: cursorRot.toArray()
        }

        components.push(Object.assign({}, {
          props: {
            geometry: {
                shape: "box",
                size: [ 15000, 0.09, 0.10 ],
            },
            material: {
              color: 0xffffff,
              name: "plastic"
            }
          },
          position: [ 0, 0, 0 ],
          quaternion: [ 0, 0, 0, 1 ],
          components: [
            Object.assign( {}, cursorComponent )
          ]
        }))
        
    entity = new Entity( id, components, null, null, voxel )
  
    return entity

}

export default battleship