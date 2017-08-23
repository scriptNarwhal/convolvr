import { browserHistory } from 'react-router'
import axios from 'axios'
import Voxel from '../world/voxel'
import { animate } from '../world/render'
import { 
  API_SERVER,
  GRID_SIZE
} from '../config'

export default class TerrainSystem {

    constructor ( world ) {

        this.world            = world
        this.config           = world.config.terrain
        this.octree           = world.octree
        this.phase            = 0
        this.StaticCollisions = null
        this.voxels           = []
        this.voxelList        = [] // map of coord strings to voxels
        this.lastChunkCoords  = [ 0, 0, 0 ]
        this.chunkCoords      = [ 0, 0, 0 ]
        this.cleanUpChunks    = []
        this.reqChunks        = []
        this.loaded           = false
        this.readyCallback    = () => {}

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

        let world = this.world

        this.StaticCollisions = world.systems.staticCollisions
        this.config = config

        let type  = this.config.type,
            red   = this.config.red,
            green = this.config.green,
            blue  = this.config.blue,
            geom  = null,
            mesh  = null,
            mat   = null

        if ( type != 'empty' ) {

          mat = this.world.mobile ? new THREE.MeshLambertMaterial({color: config.color }) : new THREE.MeshPhongMaterial({color: config.color})
         
          if ( !!!this.mesh ) {

            geom = new THREE.PlaneGeometry( 24000000+(3.5+world.viewDistance)*1600000, 24000000+(3.5+world.viewDistance)*1600000, 2, 2 )
            mesh = new THREE.Mesh( geom, mat )
            three.scene.add(mesh)
            this.world.octree.add(mesh)
            this.mesh = mesh

          } else {
            
            this.mesh.material = mat
            mesh = this.mesh

          }

           mesh.rotation.x = -Math.PI/2

            if (type == 'plane' ) {

                mesh.position.y = -120500

            } else {

                mesh.position.y = -( 5400000 / this.config.flatness ) + 6000
            
            }

        }

  }

  loadVoxel ( coords ) {

    let voxels     = this.voxels,
        voxelList  = this.voxelList,
        collisions = this.world.systems.staticCollisions ? this.world.systems.staticCollisions : {},
        voxelKey   = coords[0]+".0."+coords[2], // debugging this.. 
        voxelData  = { cell: [coords[0], 0, coords[2]], name: "generated space", visible: true, altitude: 0, entities: [] },
        v          = new Voxel( voxelData, [coords[0], 0, coords[2]], this.world )
                
        voxels[ voxelKey ] = v
        voxelList.push( v )

     axios.get(`${API_SERVER}/api/chunks/${this.world.name}/${coords.join("x")}`).then( response => {

        let physicsVoxels = []
        typeof response.data.map == 'function' && response.data.map( c => {

          v.preLoadEntities()
          collisions.worker.postMessage(JSON.stringify({
            command: "add voxels",
            data: [ v.data ]
          }))
          // systems.oimo.worker.postMessage(JSON.stringify({
                //     command: "add voxels",
                //     data: physicsVoxels
                // }))
      })

    }).catch(response => {
        console.log("Load Voxel Error", response)
    })

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
        chunkPos            = [],
        pCell               = [ 0, 0, 0 ],
        position            = three.camera.position,
        terrainChunk        = null,
        coords              = [ Math.floor( position.x / GRID_SIZE[ 0 ] ), Math.floor( position.y / GRID_SIZE[ 1 ] ), Math.floor( position.z / GRID_SIZE[ 2 ] ) ],
        lastCoords          = this.lastChunkCoords,
        moveDir             = [coords[0]-lastCoords[0], coords[2] - lastCoords[2]],
        viewDistance        = (this.world.mobile ? 5 : 8) + this.world.viewDistance,
        removeDistance      = viewDistance + 1 + (window.innerWidth > 2100 ?  2 : 1),
        endCoords           = [coords[0]+viewDistance, coords[2]+viewDistance],
        x                   = coords[ 0 ] - phase,
        y                   = coords[ 2 ] - phase,
        c                   = 0

    this.chunkCoords = coords
    force = phase == 0

    if ( force || coords[0] != lastCoords[0] || coords[1] != lastCoords[1] || coords[2] != lastCoords[2] ) {

        lastCoords = this.lastChunkCoords = [ coords[0], coords[1], coords[2] ]
        let userName = world.userName || "convolvr"

        phase > 0 && this.loaded && browserHistory.push( "/"+userName+"/"+world.name+"/at/"+coords.join("."))

        force = false 	// remove old chunks

        for ( c in voxelList ) {

            voxel = voxelList[ c ]
            pCell = voxel.data.cell

            if (!!!voxel.cleanUp && (pCell[0] < coords[0] - removeDistance || pCell[0] > coords[0] + removeDistance ||
                                    pCell[2] < coords[2] - removeDistance || pCell[2] > coords[2] + removeDistance) ) { 	// mark voxels for removal

                voxel.cleanUp = true
                this.cleanUpChunks.push({
                  physics: {
                    cell: [ pCell[0], 0, pCell[2] ]
                  }, 
                  cell: pCell[0]+".0."+pCell[2]
                })

            }

          }

      }

      c = 0
      cleanUpVoxels = this.cleanUpChunks

      this.cleanUpChunks.map(( cleanUp, i ) => {

        if ( c < 2  && cleanUp ) {

          terrainChunk = voxels[ cleanUp.cell ]

          if ( terrainChunk && terrainChunk.entities ) {

            terrainChunk.entities.map( e => {

              if ( !!e && !!e.mesh ) {

                octree.remove(e.mesh)
                three.scene.remove(e.mesh)

              } 

              removePhysicsChunks.push(cleanUp.physics)
              voxelList.splice(voxelList.indexOf(terrainChunk), 1)
              delete voxels[cleanUp.cell]
              cleanUpVoxels.splice(i, 1)

            })

          }
              
          c += 1

        }

      })

      c = 0
      
      while ( x <= endCoords[0] ) { // load new terrain voxels

        while ( y <= endCoords[1] ) {

            if ( c < 6 && voxels[x+".0."+y] == null ) { // only if its not already loaded
              
                voxels[ x+".0."+y ] = true
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
        let showVoxels = true

        if ( !!config )

          showVoxels = config.type == "voxels" || config.type == "both"


        axios.get(`${API_SERVER}/api/chunks/${this.world.name}/${chunks}`).then( response => {

             let physicsVoxels = []
             typeof response.data.map == 'function' && response.data.map( c => {

                let cam = three.camera,
                    cameraKey = Math.floor( cam.position.x / GRID_SIZE[0] )+".0."+Math.floor( cam.position.z / GRID_SIZE[2] ),
                    voxelKey = c.x+".0."+c.z, // debugging this.. 
                    voxelData = { coords: [c.x, 0, c.z], name: c.name, visible: showVoxels, altitude: c.altitude, entities: c.entities },
                    v = new Voxel( voxelData, [c.x, 0, c.z], this.world ),
                    initialLoad = terrain.world.initialLoad
                
                voxels[ voxelKey ] = v
                voxelList.push( v )
                physicsVoxels.push( v.data )
                v.preLoadEntities()
        
                if ( initialLoad == false && cameraKey == voxelKey ) {

                  terrain.world.initialLoad = true
                  terrain.world.loadedCallback()
                  terrain.readyCallback()

                } else if ( terrain.loaded == false && cameraKey == voxelKey ) {

                  terrain.loaded = true
                  terrain.readyCallback()

                }

            })

             if ( physicsVoxels.length > 0 ) { //console.log("physics voxels", physicsVoxels)
               
                systems.staticCollisions.worker.postMessage(JSON.stringify({
                     command: "add voxels",
                     data: physicsVoxels
                }))
                // systems.oimo.worker.postMessage(JSON.stringify({
                //     command: "add voxels",
                //     data: physicsVoxels
                // }))

                if ( world.IOTMode ) 

                  animate(world, Date.now(), 0)

             }

          }).catch(response => {
             console.log("Voxel Error", coords, response)
          })

      }

      if ( removePhysicsChunks.length > 0 ) {

        let removeChunkData = JSON.stringify(removePhysicsChunks)
        this.StaticCollisions.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
        //this.Oimo.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
        
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

}