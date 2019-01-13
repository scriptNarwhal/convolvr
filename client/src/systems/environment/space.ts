import axios from 'axios'
import Voxel from '../../model/voxel'
import { animate } from '../../world/render'
import Entity from '../../model/entity'
import { 
  GLOBAL_SPACE,
  GRID_SIZE,
  API_SERVER
} from '../../config'
import StaticCollisions from './physics/static-collisions';
import Component, { DBComponent } from '../../model/component';
import Convolvr from '../../world/world';
import { navigateTo } from '../../2d-ui/redux/actions/app-actions';
import { fetchSpaces } from '../../2d-ui/redux/actions/world-actions';
import { SpaceConfig } from '../../model/space';

export default class SpaceSystem {

  private world: Convolvr
  config: any
  live: boolean

  public mesh: any
  public phase: number
  public distantTerrain: Entity
  public StaticCollisions: StaticCollisions

  private hasBuffered: boolean;
  public loaded: boolean  
  public readyCallback: Function

  public lastChunkCoords: number[]
  public chunkCoords: number[]

  public cleanUpVoxels: any[]
  public reqVoxels: any[]
  public loadedVoxels: any[]
  public physicsVoxels: any
  public voxelList: any[]
  public voxels: { [coords: string]: Voxel }
  public dispatchAction: Function

    constructor (world: Convolvr) {
      this.world            = world
      this.config           = null
      this.phase            = 0
      this.mesh             = null
      this.distantTerrain   = null
      this.StaticCollisions = null
      this.physicsVoxels    = [];
      this.voxels           = {};
      this.voxelList        = []; // map of coord strings to voxels
      this.lastChunkCoords  = [ 0, 0, 0 ]
      this.chunkCoords      = [ 0, 0, 0 ]
      this.cleanUpVoxels    = []
      this.reqVoxels        = []
      this.loadedVoxels     = []
      this.loaded           = false
      this.hasBuffered      = false;
      this.live             = true
      this.readyCallback    = () => {}

      let globalVoxel = new Voxel( { 
        cell: GLOBAL_SPACE, 
        name: "Global Voxel", 
        visible: true, 
        altitude: 0, 
        entities: [] 
      }, GLOBAL_SPACE, this.world )
      this.voxels[ GLOBAL_SPACE.join(".") ] = globalVoxel
      this.dispatchAction = this.world.store ? this.world.store.dispatch : () => {};
      this.dispatchAction(fetchSpaces((spaces: SpaceConfig[])=>{
        console.log("fetch spaces ", spaces)
        this.world.systems.assets.setSpaces(spaces);
      }));
    }

    public init(component: Component) {
        let state: any = {}
            
        return state
    }

    public tick(delta: number, time: number) {
      this.bufferVoxels( false, this.phase )
    }

    public initTerrain(config: any) {
      let world = this.world,
          SpaceSystem = this,
          materials = world.systems.material

      this.StaticCollisions = world.systems.staticCollisions
      this.config = config

      let type           = this.config.type,
          // red            = this.config.red,
          // green          = this.config.green,
          // blue           = this.config.blue,
          distantTerrain = null,
          yPosition      = 0;

      if (!!this.mesh) {
        // world.octree.remove(this.mesh)
        world.three.scene.remove(this.mesh)
        this.distantTerrain = null
      }

      if (type != 'empty') {
        yPosition = type == 'plane' || type == "both" ? -120 / this.config.flatness : 0
        distantTerrain = new Entity( -1, [{
            attrs: {
              geometry: {
                shape: "plane",
                size: [ (64+world.settings.viewDistance)*GRID_SIZE[0]*2, (64+world.settings.viewDistance)*GRID_SIZE[0]*2, 0 ]
              },
              material: {
                color: config.color,
                envMap: world.systems.assets.envMaps.default,
                shading: "physical"
              }
            },
            components: [] as DBComponent[],
            position: [0,0,0],
            quaternion: [0,0,0]
          }] as DBComponent[], [0, yPosition, 0], [0,0,0,1], GLOBAL_SPACE)
         
        distantTerrain.init(world.three.scene, { noVoxel: true }, (terrainEnt: Entity) => {
          SpaceSystem.mesh = terrainEnt.mesh
          terrainEnt.mesh.rotation.x = -Math.PI/2
          terrainEnt.mesh.updateMatrix()
        });
        this.distantTerrain = distantTerrain
      }
  }

  public destroy() {
    let world = this.world;
    for (const v of this.voxelList) {
			for (const e of v.entities) {
				if (e.mesh ) {
					// world.octree.remove( e.mesh )
					world.three.scene.remove( e.mesh )
				}					
			}

			if (v.mesh )				
        world.three.scene.remove( v.mesh )
    }

		this.voxels = { GLOBAL_SPACE: this.voxels[GLOBAL_SPACE.join(".")]};
		this.voxelList = []
  }

  public loadVoxel(coords: number[], callback: Function) {
    let voxels              = this.voxels,
        voxelList           = this.voxelList,
        voxelKey            = coords[0]+".0."+coords[2], // debugging this.. 
        entities:  Entity[] = [],
        voxelData           = { cell: [coords[0], 0, coords[2]], name: "unloaded voxel", visible: true, altitude: 0, entities },
        v                   = null;

    if (voxels[ voxelKey ] == null ) {
        v = new Voxel( voxelData, [coords[0], 0, coords[2]], this.world )
        voxels[ voxelKey ] = v
        voxelList.push( v )
    } else {
      v = voxels[ voxelKey ]
    }

    if (v.loaded == false )
      v.fetchData( callback )

    return v
  }

  private bufferVoxels(force: boolean, phase: number) {
    let voxels              = this.voxels,
        voxelList           = this.voxelList,
        config              = this.config,
        terrain             = this,
        world               = this.world,
        systems             = world.systems,
        voxel               = null,
        removePhysicsVoxels: any[] = [],
        cleanUpVoxels:       any[] = [],
        pCell               = [ 0, 0, 0 ],
        position            = world.three.camera.position,
        voxelToRemove       = null,
        coords              = [ Math.floor( position.x / GRID_SIZE[ 0 ] ), Math.floor( position.y / GRID_SIZE[ 1 ] ), Math.floor( position.z / GRID_SIZE[ 2 ] ) ],
        lastCoords          = this.lastChunkCoords,
        // moveDir             = [coords[0]-lastCoords[0], coords[2] - lastCoords[2]],
        viewDistance        = (world.mobile ? 5 : 7) + world.settings.viewDistance,
        removeDistance      = viewDistance + 2,
        x                   = coords[ 0 ] - phase,
        y                   = coords[ 2 ] - phase,
        c                   = 0;

 if ((window as any).noBuffer) {
   return;
 }
  const endCoords = [coords[0]+viewDistance, coords[2]+viewDistance];

    this.chunkCoords = coords
    force = phase == 0
    if (this.world.name == "" ) { return }

    if (!this.hasBuffered || coords[0] != lastCoords[0] || coords[1] != lastCoords[1] || coords[2] != lastCoords[2] ) {
        this.hasBuffered = true;
        lastCoords = this.lastChunkCoords = [ coords[0], coords[1], coords[2] ]
        let userName = world.userName || "convolvr",
            pageName = window.location.pathname,
            shortURLView = pageName.indexOf('/files') > -1 || pageName.indexOf('/inventory') > -1 || pageName.indexOf('/settings') > -1

        if (phase > 0 && this.loaded && !shortURLView ){
          window.history.pushState({}, this.world.name, "/"+userName+"/"+world.name+"/at/"+coords.join("."));
          // this.world.store.dispatch(navigateTo("/"+userName+"/"+world.name+"/at/"+coords.join("."), true))
        }
        force = false 	// remove old voxels

        for (var v in voxelList) {
          voxel = voxelList[v]
          pCell = voxel.data.cell
          //console.log("space system::bufferVoxels::cell", pCell);
          if (pCell[0] == 0 && pCell[2] == 0) {
            continue;
          }
          if (!!!voxel.cleanUp && (pCell[0] <= coords[0] - removeDistance || pCell[0] >= coords[0] + removeDistance ||
            pCell[2] <= coords[2] - removeDistance || pCell[2] >= coords[2] + removeDistance)) { 	// mark voxels for removal

            voxel.cleanUp = true;
            this.cleanUpVoxels.push({
              physics: {
                cell: [pCell[0], 0, pCell[2]]
              },
              cell: pCell[0] + ".0." + pCell[2]
            })
          }
        }
      }

      c = 0
      cleanUpVoxels = this.cleanUpVoxels

      for (let i = 0, cuvl = this.cleanUpVoxels.length; i < cuvl; i++) {
        const cleanUp = this.cleanUpVoxels[i];

        if (c < 3 && cleanUp ) {
          voxelToRemove = voxels[ cleanUp.cell ];

          if (voxelToRemove && voxelToRemove.entities ) {
            voxelToRemove.entities.map( (e: any) => {
              if (!!e && !!e.mesh ) {
                // this.world.octree.remove( e.mesh );
                this.world.three.scene.remove( e.mesh );
              } 
            })

            removePhysicsVoxels.push( cleanUp.physics )
            voxelList.splice( voxelList.indexOf( voxelToRemove ), 1)
            delete voxels[ cleanUp.cell ]
            cleanUpVoxels.splice( i, 1 )
          }   
          c += 1
        }
      }

      c = 0;
      while ( x <= endCoords[ 0 ] && c < 2 ) { // load new terrain voxels
        while ( y <= endCoords[ 1 ] ) {
          if (voxels[x+".0."+y] == null ) { // only if its not already loaded
            this.initializeVoxel( [ x, 0, y ], x+".0."+y )
            c += 1
            this.reqVoxels.push( x+"x0x"+y )
          }
          y += 1
        }
        y = coords[2]-viewDistance
        x += 1
      }
      
      if (this.reqVoxels.length >= 6 ) {
        let voxels = "";

        this.reqVoxels.map( ( rc, i ) => {
          if (i > 0 )
            voxels += ","
          
          voxels += rc
        })

        this.reqVoxels = []
        axios.get(`${API_SERVER}/api/voxels/${this.world.name}/${voxels}`).then( (response: any) => {

          typeof response.data.map == 'function' && response.data.map( (c: any) => {
                terrain.loadedVoxels.push( c )
          })

        }).catch((response: any) => {
          console.error("Voxel Error", coords, response)
        });

      }

      if (removePhysicsVoxels.length > 0 ) {
        let removeChunkData = JSON.stringify(removePhysicsVoxels);

        this.StaticCollisions.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
        //this.Oimo.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
      }

      this.initializeEntities( config )

      if (this.physicsVoxels.length > 0) { //console.log("physics voxels", physicsVoxels)
      
        systems.staticCollisions.worker.postMessage(JSON.stringify({
              command: "add voxels",
              data: this.physicsVoxels
        }))
        // systems.oimo.worker.postMessage(JSON.stringify({
        //     command: "add voxels",
        //     data: physicsVoxels
        // }))

        this.physicsVoxels = []

        if (world.settings.IOTMode ) 
          animate(world, Date.now(), 0)

      }

      lastCoords[0] = coords[0]
      lastCoords[1] = coords[1]
      lastCoords[2] = coords[2]
      phase ++

      if (phase > viewDistance )
        phase = 0
      
      //setTimeout(() => { this.bufferVoxels(force, phase) }, 32 ) // experiment // 32)
      this.phase = phase
    }

    private initializeVoxel(cell: number[], key: string): Voxel {
      let emptyVoxel = new Voxel( { 
        cell, 
        name: "empty voxel", 
        visible: true, 
        altitude: 0, 
        entities: [] 
      }, cell, this.world )

      this.voxelList.push( emptyVoxel )
      this.voxels[ key ] = emptyVoxel

      return emptyVoxel;
    }

    private initializeEntities(config: any) {
      let initialLoad   = this.world.initialLoad,
         loadedVoxels  = this.loadedVoxels,
          cam           = (window as any).three.camera,
          cameraKey     = Math.floor(cam.position.x / GRID_SIZE[0]) + ".0." + Math.floor(cam.position.z / GRID_SIZE[2]);

      if (!!config )
        if (loadedVoxels.length > 0 ) {
          let newVoxel = loadedVoxels[ 0 ],
              voxelKey = newVoxel.x + ".0." + newVoxel.z,
              v = this.voxels[ voxelKey ]
              
          if (!!!v )
            v = this.initializeVoxel( [ newVoxel.x, 0, newVoxel.z], newVoxel.x + ".0." + newVoxel.z )

          if (!!!v ) {
            console.error("Voxel couldn't load: ", [ newVoxel.x, 0, newVoxel.z])
            return
          }

          v.setData(newVoxel);
          this.physicsVoxels.push(v.data);
          v.loadDistantEntities();
          if (initialLoad == false && cameraKey == voxelKey ) {

            this.world.initialLoad = true
            this.loaded = true
            this.world.loadedCallback()
            this.readyCallback()

          } else if (this.loaded == false && cameraKey == voxelKey ) {

            this.loaded = true
            this.readyCallback()

          }

          loadedVoxels.splice(0, 1);
        }
    }

}