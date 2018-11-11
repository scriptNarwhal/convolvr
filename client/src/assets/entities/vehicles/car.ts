import Entity from '../../../model/entity'
import Component, { DBComponent } from '../../../model/component'
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
            id = !!config && !!config.id ? config.id : assetSystem.autoEntityID()

        components.push({
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
          components: []
        } as DBComponent);
        
    entity = new Entity( id, components, null, null, voxel )
  
    return entity

}

export default car