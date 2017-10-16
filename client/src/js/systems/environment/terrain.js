import { browserHistory } from 'react-router'
import axios from 'axios'
import Voxel from '../../world/voxel'
import { animate } from '../../world/render'
import Entity from '../../entity'
import { 
  GLOBAL_SPACE,
  GRID_SIZE,
  API_SERVER
} from '../../config'

export default class TerrainSystem {

    constructor ( world ) {

        this.world            = world
        this.config           = world.config.terrain
        this.octree           = world.octree
        this.phase            = 0
        this.mesh             = null
        this.distantTerrain   = null
        this.StaticCollisions = null
        this.physicsVoxels    = []
        this.voxels           = []
        this.voxelList        = [] // map of coord strings to voxels
        this.lastChunkCoords  = [ 0, 0, 0 ]
        this.chunkCoords      = [ 0, 0, 0 ]
        this.cleanUpChunks    = []
        this.reqChunks        = []
        this.loadedVoxels     = []
        this.loaded           = false
        this.readyCallback    = () => {}

        let globalVoxel = new Voxel( { 
          cell: GLOBAL_SPACE, 
          name: "Global Voxel", 
          visible: true, 
          altitude: 0, 
          entities: [] 
        }, GLOBAL_SPACE, this.world )

        this.voxels[ GLOBAL_SPACE.join(".") ] = globalVoxel

    }

    init ( component ) { // system to render terrain voxels from now on..

        let prop = component.props.tab,
            state = {}
            
        return state
    }

    tick ( delta, time ) {

      this.bufferVoxels( false, this.phase )

    }

    initTerrain ( config ) {

      let world = this.world,
          terrainSystem = this,
          materials = world.systems.material

      this.StaticCollisions = world.systems.staticCollisions
      this.config = config

      let type           = this.config.type,
          red            = this.config.red,
          green          = this.config.green,
          blue           = this.config.blue,
          distantTerrain = null,
          yPosition      = 0,
          geom           = null,
          mesh           = null,
          mat            = null

      if (!!this.mesh) {

        world.octree.remove(this.mesh)
        three.scene.remove(this.mesh)
        this.distantTerrain = null

      }

      if ( type != 'empty' ) {

        yPosition = type == 'plane' || type == "both" ? -120 / this.config.flatness : 0

        distantTerrain = new Entity( -1, [{
            props: {
              geometry: {
                shape: "plane",
                size: [ (64+world.viewDistance)*GRID_SIZE[0]*2, (64+world.viewDistance)*GRID_SIZE[0]*2, 0 ]
              },
              material: {
                color: config.color,
                envMap: world.systems.assets.envMaps.default,
                shading: "physical"
              }
            },
            components: [],
            position: [0,0,0],
            quaternion: [0,0,0]
          }], [0, yPosition, 0], [0,0,0,1], world.getVoxel())

        distantTerrain.init( three.scene, { noVoxel: true }, (terrainEnt) => {

          terrainSystem.mesh = terrainEnt.mesh
          terrainEnt.mesh.rotation.x = -Math.PI/2
          terrainEnt.mesh.updateMatrix()

        })
        this.distantTerrain = distantTerrain

      }

  }

  loadVoxel ( coords, callback ) {

    let voxels     = this.voxels,
        voxelList  = this.voxelList,
        voxelKey   = coords[0]+".0."+coords[2], // debugging this.. 
        voxelData  = { cell: [coords[0], 0, coords[2]], name: "unloaded voxel", visible: true, altitude: 0, entities: [] },
        v          = null
    
    if ( voxels[ voxelKey ] == null ) {

        v = new Voxel( voxelData, [coords[0], 0, coords[2]], this.world )
        voxels[ voxelKey ] = v
        voxelList.push( v )

    } else {

      v = voxels[ voxelKey ]

    }

    if ( v.loaded == false )

      v.fetchData( callback )


    return v

  }

  bufferVoxels ( force, phase ) {

    let voxels              = this.voxels,
        voxelList           = this.voxelList,
        config              = this.config,
        terrain             = this,
        world               = this.world,
        scene               = three.scene,
        systems             = world.systems,
        octree              = world.octree,
        voxel               = null,
        removePhysicsChunks = [],
        cleanUpVoxels       = [],
        loadedVoxels        = [],
        chunkPos            = [],
        pCell               = [ 0, 0, 0 ],
        position            = three.camera.position,
        terrainChunk        = null,
        coords              = [ Math.floor( position.x / GRID_SIZE[ 0 ] ), Math.floor( position.y / GRID_SIZE[ 1 ] ), Math.floor( position.z / GRID_SIZE[ 2 ] ) ],
        lastCoords          = this.lastChunkCoords,
        moveDir             = [coords[0]-lastCoords[0], coords[2] - lastCoords[2]],
        viewDistance        = (this.world.mobile ? 4 : 7) + this.world.viewDistance,
        removeDistance      = viewDistance + 2,
        x                   = coords[ 0 ] - phase,
        y                   = coords[ 2 ] - phase,
        c                   = 0

  const endCoords = [coords[0]+viewDistance, coords[2]+viewDistance]
        
    this.chunkCoords = coords
    force = phase == 0
    if ( this.world.name == "" ) { return }

    if ( force || coords[0] != lastCoords[0] || coords[1] != lastCoords[1] || coords[2] != lastCoords[2] ) {

        lastCoords = this.lastChunkCoords = [ coords[0], coords[1], coords[2] ]
        let userName = world.userName || "convolvr"

        phase > 0 && this.loaded && browserHistory.push( "/"+userName+"/"+world.name+"/at/"+coords.join("."))

        force = false 	// remove old chunks

        for (var v in voxelList) {

          voxel = voxelList[v]
          pCell = voxel.data.cell

          if (!!!voxel.cleanUp && (pCell[0] <= coords[0] - removeDistance || pCell[0] >= coords[0] + removeDistance ||
            pCell[2] <= coords[2] - removeDistance || pCell[2] >= coords[2] + removeDistance)) { 	// mark voxels for removal

            voxel.cleanUp = true
            this.cleanUpChunks.push({
              physics: {
                cell: [pCell[0], 0, pCell[2]]
              },
              cell: pCell[0] + ".0." + pCell[2]
            })

          }

        }

      }

      c = 0
      cleanUpVoxels = this.cleanUpChunks
      loadedVoxels = this.loadedVoxels

      this.cleanUpChunks.map(( cleanUp, i ) => {

        if ( c < 3 && cleanUp ) {

          terrainChunk = voxels[ cleanUp.cell ]

          if ( terrainChunk && terrainChunk.entities ) {
          
            terrainChunk.entities.map( e => {

              if ( !!e && !!e.mesh ) {

                octree.remove( e.mesh )
                three.scene.remove( e.mesh )

              } 

            })

            removePhysicsChunks.push( cleanUp.physics )
            voxelList.splice( voxelList.indexOf( terrainChunk ), 1)
            delete voxels[ cleanUp.cell ]
            cleanUpVoxels.splice( i, 1 )

          }
              
          c += 1

        }

      })

      c = 0
      
      while ( x <= endCoords[ 0 ] && c < 2 ) { // load new terrain voxels

        while ( y <= endCoords[ 1 ] ) {

          if ( voxels[x+".0."+y] == null ) { // only if its not already loaded
              
            this.initializeVoxel( [ x, 0, y ], x+".0."+y )

            c += 1
            this.reqChunks.push( x+"x0x"+y )
      
          }

          y += 1

        }

        y = coords[2]-viewDistance
        x += 1

      }

      if ( this.reqChunks.length >= 6 ) {

        let chunks = ""

        this.reqChunks.map( ( rc, i ) => {

          if ( i > 0 )

            chunks += ","
          
          chunks += rc

        })

        this.reqChunks = []
        axios.get(`${API_SERVER}/api/chunks/${this.world.name}/${chunks}`).then( response => {

          typeof response.data.map == 'function' && response.data.map( c => {

                terrain.loadedVoxels.push( c )

          })

        }).catch(response => {
          console.error("Voxel Error", coords, response)
        })

      }

      if ( removePhysicsChunks.length > 0 ) {

        let removeChunkData = JSON.stringify(removePhysicsChunks)
        this.StaticCollisions.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
        //this.Oimo.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
        
      }

      this.initializeEntities( config )

      if ( this.physicsVoxels.length > 0 ) { //console.log("physics voxels", physicsVoxels)
      
        systems.staticCollisions.worker.postMessage(JSON.stringify({
              command: "add voxels",
              data: this.physicsVoxels
        }))
        // systems.oimo.worker.postMessage(JSON.stringify({
        //     command: "add voxels",
        //     data: physicsVoxels
        // }))

        this.physicsVoxels = []

        if ( world.IOTMode ) 

          animate(world, Date.now(), 0)

      }

      lastCoords[0] = coords[0]
      lastCoords[1] = coords[1]
      lastCoords[2] = coords[2]
      phase ++

      if ( phase > viewDistance )

        phase = 0
      
      //setTimeout(() => { this.bufferVoxels(force, phase) }, 32 ) // experiment // 32)
      this.phase = phase

    }

    initializeVoxel ( cell, key ) {

      let emptyVoxel = new Voxel( { 
        cell, 
        name: "empty voxel", 
        visible: true, 
        altitude: 0, 
        entities: [] 
      }, cell, this.world )

      this.voxelList.push( emptyVoxel )
      this.voxels[ key ] = emptyVoxel

      return emptyVoxel

    }

    initializeEntities (config) {

      let initialLoad   = this.world.initialLoad,
          showVoxels    = true,
          terrain       = this,
          loadedVoxels  = this.loadedVoxels,
          cam           = three.camera,
          cameraKey     = Math.floor(cam.position.x / GRID_SIZE[0]) + ".0." + Math.floor(cam.position.z / GRID_SIZE[2]),
          c             = 0

      if ( !!config )

        showVoxels = config.type == "voxels" || config.type == "both"

     // loadedVoxels.map((newVoxel, i) => {

        if ( loadedVoxels.length > 0 ) {

          let newVoxel = loadedVoxels[ 0 ],
              voxelKey = newVoxel.x + ".0." + newVoxel.z,
              voxelData = { coords: [newVoxel.x, 0, newVoxel.z], name: newVoxel.name, visible: showVoxels, altitude: newVoxel.altitude, entities: newVoxel.entities },
              v = this.voxels[ voxelKey ]
              
          if ( !!!v )

            v = this.initializeVoxel( [ newVoxel.x, 0, newVoxel.z], newVoxel.x + ".0." + newVoxel.z )

          if ( !!!v ) {

            console.error("Voxel couldn't load: ", [ newVoxel.x, 0, newVoxel.z])
            return

          }

          v.setData(newVoxel)
          this.physicsVoxels.push(v.data)
          v.loadDistantEntities()

          if ( initialLoad == false && cameraKey == voxelKey ) {

            this.world.initialLoad = true
            this.loaded = true
            this.world.loadedCallback()
            this.readyCallback()

          } else if ( this.loaded == false && cameraKey == voxelKey ) {

            this.loaded = true
            this.readyCallback()

          }

          loadedVoxels.splice(0, 1)

        }

        //c += 1

      //})

    }

}