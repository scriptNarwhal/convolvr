import axios from 'axios'
import Voxel from '../world/voxel'
import { animate } from '../world/render'
import { API_SERVER } from '../config'

export default class TerrainSystem {

    constructor (world) {

        this.world = world
        this.config = world.config.terrain
        this.octree = world.octree
        this.WorldPhysics = null
        this.EntityPhysics = null
        this.voxels = []
        this.voxelList = [] // map of coord strings to voxels
        this.lastChunkCoords = [0, 0, 0]
        this.chunkCoords = [0, 0, 0]
        this.cleanUpChunks = []
        this.reqChunks = []

    }

    init ( component ) { // system to render terrain voxels from now on..

        let prop = component.props.tab,
            state = {}
            
        return state
    }

    initTerrain ( config ) {

        let world = this.world
        this.WorldPhysics = world.systems.worldPhysics
        this.EntityPhysics = world.systems.entityPhysics
        this.config = config
        let type = this.config.type,
            red = this.config.red,
            green = this.config.green,
            blue = this.config.blue,
            terrainColor = new THREE.Color(`rgb( ${Math.floor(255*red)}, ${Math.floor(255*green)}, ${Math.floor(255*blue)})`)

        if ( type != 'empty' ) {

            let geom = new THREE.PlaneGeometry(24000000+world.viewDistance*800000, 24000000+world.viewDistance*800000, 2, 2),
                mat = this.world.mobile ? new THREE.MeshLambertMaterial({color: terrainColor.getHex() }) : new THREE.MeshPhongMaterial({color: terrainColor.getHex()}),
                mesh = new THREE.Mesh(geom, mat)

            this.config.color = terrainColor.getHex() // temporary hack..
            this.mesh = mesh
            mesh.rotation.x = -Math.PI/2

            if (type == 'plane' || type == 'both') {

                mesh.position.y = -120500

            } else {

                mesh.position.y = -(5400000 / this.config.flatness) + 6000 //-168000 - 125000 / this.config.flatness
            
            }

            three.scene.add(mesh)
            this.world.octree.add(mesh)

        }

  }

  bufferChunks ( force, phase ) {

    let voxels = this.voxels,
        voxelList = this.voxelList,
        config = this.config,
        world = this.world,
        scene = three.scene,
        systems = world.systems,
        octree = world.octree,
        voxel = null,
        removePhysicsChunks = [],
        cleanUpVoxels = [],
        chunkPos = [],
        pCell = [0,0,0],
        position = three.camera.position,
        terrainChunk = null,
        c = 0,
        coords = [ Math.floor(position.x/928000), 0, Math.floor(position.z/807360) ],
        lastCoords = this.lastChunkCoords,
        moveDir = [coords[0]-lastCoords[0], coords[2] - lastCoords[2]],
        viewDistance = (this.world.mobile ? 5 : 6) + this.world.viewDistance,
        removeDistance = viewDistance + 2 + (window.innerWidth > 2100 ?  2 : 1),
        endCoords = [coords[0]+viewDistance, coords[2]+viewDistance],
        x = coords[0]-phase,
        y = coords[2]-phase
        this.chunkCoords = coords

    if ( force || coords[0] != lastCoords[0] || coords[1] != lastCoords[1] || coords[2] != lastCoords[2] ) {

      lastCoords = this.lastChunkCoords = [coords[0], coords[1], coords[2]]
      force = false 	// remove old chunks

      for (c in voxelList) {

          voxel = voxelList[c]
          pCell = voxel.data.cell

          if (!!!voxel.cleanUp && (pCell[0] < coords[0] - removeDistance ||
                                      pCell[0] > coords[0] + removeDistance ||
                                      pCell[2] < coords[2] - removeDistance ||
                                      pCell[2] > coords[2] + removeDistance)
            ) { 	// mark voxels for removal

              voxel.cleanUp = true
              this.cleanUpChunks.push({
                physics: {
                  cell: [pCell[0], 0, pCell[2]]
                }, 
                cell: pCell[0]+".0."+pCell[2]
              })

          }

        }

      }

      c = 0
      cleanUpVoxels = this.cleanUpChunks

      this.cleanUpChunks.map((cleanUp, i) => {

          if (c < 4) {

              if ( !!cleanUp ) {

                terrainChunk = voxels[cleanUp.cell]

                if ( terrainChunk ) {
                  
                  if ( terrainChunk.entities ) {

                    terrainChunk.entities.map(e => {

                      if ( !!e.mesh ) {

                        octree.remove(e.mesh)
                        three.scene.remove(e.mesh)

                      } 

                    })

                  }

                  if ( terrainChunk.mesh ) {

                    three.scene.remove(terrainChunk.mesh)

                  }

                }
                
                removePhysicsChunks.push(cleanUp.physics)
                voxelList.splice(voxelList.indexOf(terrainChunk), 1)
                delete voxels[cleanUp.cell]
                cleanUpVoxels.splice(i, 1)
                
            }

            c ++

          }

      })

      c = 0
      
      while (x <= endCoords[0]) { // load new terrain voxels

        while (y <= endCoords[1]) {

            if (c < 6 && voxels[x+".0."+y] == null) { // only if its not already loaded

                voxels[x+".0."+y] = true
                c ++
                this.reqChunks.push(x+"x0x"+y)
      
            }

            y += 1

        }

        y = coords[2]-viewDistance
        x += 1

      }

      if ( this.reqChunks.length >= 6 ) {

        let chunks = ""

        this.reqChunks.map( (rc, i) => {
          if (i > 0) {
            chunks += ","
          }
          chunks += rc
        })

        this.reqChunks = [] // empty array
        let showVoxels = true

        if ( !!config ) {

          showVoxels = config.type == "voxels" || config.type == "both"

        }

        axios.get(`${API_SERVER}/api/chunks/${this.world.name}/${chunks}`).then(response => {

             let physicsVoxels = []
             typeof response.data.map == 'function' && response.data.map(c =>{
                 let voxelData = {visible: showVoxels, altitude: c.altitude, color: c.color, entities: c.entities, structures: c.structures || []},
                     chunk = new Voxel(voxelData, [c.x, 0, c.z])

              if (!!chunk.geometry != "space") { // if its not empty space

                     three.scene.add(chunk.mesh)

              }

              physicsVoxels.push(chunk.data)
              voxelList.push(chunk)
              voxels[c.x+".0."+c.z] = chunk

            })

             if (physicsVoxels.length > 0) { //console.log("physics voxels", physicsVoxels)
               
               systems.worldPhysics.worker.postMessage(JSON.stringify({
                     command: "add voxels",
                     data: physicsVoxels
                }))
                systems.entityPhysics.worker.postMessage(JSON.stringify({
                    command: "add voxels",
                    data: physicsVoxels
                }))
                if (world.IOTMode) {
                  animate(world, Date.now(), 0)
                }

             }

          }).catch(response => {
             console.log("Chunk Error", response)
          })

      }

      if (removePhysicsChunks.length > 0) {
        let removeChunkData = JSON.stringify(removePhysicsChunks)
        this.WorldPhysics.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
        this.EntityPhysics.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
      }

      lastCoords[0] = coords[0]
      lastCoords[1] = coords[1]
      lastCoords[2] = coords[2]
      phase ++

      if (phase > viewDistance) {
        phase = 1
      }

      setTimeout(() => { this.bufferChunks(force, phase) }, 32)

    }

}