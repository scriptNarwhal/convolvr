//@flow
import axios from 'axios'
import { THREE } from 'three'
import Entity from './entity'
import Convolvr from '../world/world'
import { 
    API_SERVER
} from '../config'

export class Bounds {

    from: number[]
    to:   number[]

    constructor(from: number[], to: number[]) {
        this.from = from;
        this.to = to;
    }
} 

export default class Voxel {

    data:     Object
    world:    Convolvr
    entities: Array<Entity>
    meshes:   Array<THREE.Mesh>
    voxels:   Array<Voxel>
    coords:   Array<number>
    bounds:  Bounds | null
    cleanUp:  boolean
    loaded:   boolean
    fetching: boolean

    constructor ( data: Object, cell: Array<number>, world: Convolvr) {
        let visible:  boolean     = data.visible,
            scene:    THREE.Scene = world.three.scene,
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

    setData ( data: Object ) {
        data.cell = this.coords
        this.data = data
        this.loaded = true
        this.fetching = false
    }

    fetchData ( callback: Function ) {
        let v = this,
            coords = this.coords,
            system = this.world.systems,
            collisions = system.staticCollisions ? system.staticCollisions : {},
            oimo = system.oimo ? system.oimo : {},
            worldName  = this.world.name != "" ? this.world.name : "Overworld";

        if ( this.fetching ) {
            setTimeout( ()=> { callback( v )}, 2000 )
            return 
        }

        this.fetching = true
        axios.get(`${API_SERVER}/api/chunks/${worldName}/${coords.join("x")}`).then(response => {
            let physicsVoxels = []
            typeof response.data.map == 'function' && response.data.map(c => {
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
        }).catch(response => {
            v.fetching = false
            console.log("Load Voxel Error", response)
        })
    }

    loadInnerVoxels() {
        // implement

    }

    loadDistantEntities () {
        let scene:  Object        = this.world.three.scene,
            coords: Array<number> = this.coords

        !!this.data.entities && this.data.entities.map( ( e, i ) => {
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
