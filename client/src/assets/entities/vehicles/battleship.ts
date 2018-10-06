import Entity from '../../../core/entity'
import THREE from 'three';
import AssetSystem from '../../../systems/core/assets';
import { DBComponent } from '../../../core/component';
/* battleship.. multiple decks, turrets, multiple occupants, vehicle factory / bay, runway */

let cursorAxis = new THREE.Vector3( 1, 0, 0 )

let battleship = ( assetSystem: AssetSystem, config: any, voxel: number[] ) => {  // implement

        var mesh = null,
            entity = null,
            components = [] as DBComponent[],
            id = !!config && !!config.id ? config.id : assetSystem.autoEntityID(),
            n = 2
       
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
          quaternion: [ 0, 0, 0, 1 ],
          components: [
            
          ]
        } as DBComponent)
        
    entity = new Entity( id, components, null, null, voxel )
  
    return entity

}

export default battleship