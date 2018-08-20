import Entity from '../../../core/entity'
import Component from '../../../core/component'
import AssetSystem from '../../../systems/core/assets';
import THREE from 'three';
/* car.js / halo style, two front seats, one turret as back seat */

let cursorAxis = new THREE.Vector3( 1, 0, 0 )

let car = ( assetSystem: AssetSystem, config: any, voxel: number[] ) => {  // implement

        var mesh = null,
            entity = null,
            component = null,
            componentB = null,
            components = [],
            cursorRot = new THREE.Quaternion(),
            cursorComponent = null,
            id = !!config && !!config.id ? config.id : assetSystem.autoEntityID(),
            n = 2

        cursorRot.setFromAxisAngle( cursorAxis, Math.PI / 2 )
        cursorComponent = {
          attrs: {
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
                distance: 0.090
              }
            },
            position: [ 0, 0, 0 ],
            quaternion: cursorRot.toArray()
        }

        components.push(Object.assign({}, {
          attrs: {
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
          quaternion:  [ 0, 0, 0, 1 ],
          components: [
            Object.assign( {}, cursorComponent )
          ]
        }))
        
    entity = new Entity( id, components, null, null, voxel )
  
    return entity

}

export default car