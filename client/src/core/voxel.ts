import axios from 'axios'
import Entity, { DBEntity } from './entity'
import Convolvr from '../world/world'
import { 
    API_SERVER
} from '../config'
import StaticCollisions from '../systems/environment/physics/static-collisions';

export class Bounds {
    public from: number[]
    public to:   number[]

    constructor(from: number[], to: number[]) {
        this.from = from;
        this.to = to;
    }
} 

export class DBVoxel {
    
    public entities: DBEntity[];
    public voxels:   DBVoxel[];
    public path:     number[];
    public bounds:   Bounds;
    public coords:   number[];

    public setData(data: any) {

    }
}

export default class Voxel {

    public data:     any
    private world:   Convolvr
    public entities: Entity[]
    public meshes:   any[]
    public voxels:   Voxel[]
    public coords:   number[]
    public bounds:   Bounds | null
    
    public cleanUp:  boolean
    public loaded:   boolean
    public fetching: boolean

    constructor ( data: any, cell: Array<number>, world: Convolvr) {
        let visible:  boolean     = data.visible,
            scene:    any = world.three.scene,
            altitude: number      = 0

        this.coords = cell
        this.voxels = data.voxels || []
        this.bounds = data.bounds ? data.bounds : null
        this.entities = []  
        this.meshes = []
        this.world = world
        
        altitude = data.altitude || 0

        if ( !! cell ) {
            data.cell = cell
        } else {
            data.position = [ 0, 0, 0 ]
        }

        this.data = data
        this.cleanUp = false
        this.loaded = false
        this.fetching = false
    }

    public setData ( data: any ) {
        data.cell = this.coords
        this.data = data
        this.loaded = true
        this.fetching = false
    }

    public fetchData ( callback: Function ) {
        let v = this,
            coords = this.coords,
            system = this.world.systems,
            collisions: StaticCollisions = system.staticCollisions,
            oimo = system.oimo ? system.oimo : {},
            worldName  = this.world.name != "" ? this.world.name : "Overworld";

        if (!collisions) {
            console.warn("StaticCollision system not loaded yet")
            return
        }

        if ( this.fetching ) {
            setTimeout( ()=> { callback( v )}, 2000 )
            return 
        }

        this.fetching = true
        axios.get(`${API_SERVER}/api/voxels/${worldName}/${coords.join("x")}`).then((response: any) => {
            let physicsVoxels = []
            typeof response.data.map == 'function' && response.data.map((c: any) => {
                v.setData(c)
                v.loadDistantEntities()
                callback && callback(v)
                collisions.worker.postMessage(JSON.stringify({
                    command: "add voxels",
                    data: [ v.data ]
                }))
                // oimo.worker.postMessage(JSON.stringify({
                //     command: "add voxels",
                //     data: physicsVoxels
                // }))
            })
        }).catch((response: any) => {
            v.fetching = false
            console.log("Load Voxel Error", response)
        })
    }

    public loadInnerVoxels() {
        // implement

    }

    public loadDistantEntities () {
        let scene:  any        = this.world.three.scene,
            coords: Array<number> = this.coords

        !!this.data.entities && this.data.entities.map( ( e: any, i: number  ) => {
            let entity: Entity = new Entity( e.id, e.components, e.position, e.quaternion, coords )

            if ( i < 2 ) {
                entity.init( scene )
                if ( i == 0 )
                    this.data.position = e.position

            }
            this.entities.push( entity ) // init later  
        })
    }
}
