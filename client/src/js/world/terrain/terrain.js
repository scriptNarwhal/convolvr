import axios from 'axios'
import Chunk from './chunk'
import { API_SERVER } from '../../config.js'

export default class Terrain {
  constructor (world) {
    this.world = world
    this.config = world.config.terrain
    this.octree = world.octree
    this.UserPhysics = world.UserPhysics
    this.EntityPhysics = world.EntityPhysics
    this.voxels = []
		this.voxelList = [] // map of coord strings to voxels
		this.lastChunkCoords = [0, 0, 0]
		this.chunkCoords = [0, 0, 0]
		this.cleanUpChunks = []
    this.reqChunks = []
  }

  init (config) {
    this.config = config
    let type = this.config.type
    if (type == 'both' || type == 'plane') {
      let geom = new THREE.PlaneGeometry(12000000, 12000000, 2, 2),
          mat = this.world.mobile ?
            new THREE.MeshLambertMaterial({color: this.config.color})
          : new THREE.MeshPhongMaterial({color: this.config.color}),
          mesh = new THREE.Mesh(geom, mat)
      this.mesh = mesh
      mesh.rotation.x = -Math.PI/2
      if (type == 'plane') {
        mesh.position.y = -64500
      } else {
        mesh.position.y = -168000 - 125000 / this.config.flatness
      }
      three.scene.add(mesh)
    }
  }

  bufferChunks (force, phase) {
    let voxels = this.voxels,
        voxelList = this.voxelList,
        config = this.config,
        plat = null,
        chunk = null,
        removePhysicsChunks = [],
        chunkPos = [],
        pCell = [0,0,0],
        position = three.camera.position,
        platform = null,
        terrainChunk = null,
        c = 0,
        coords = [Math.floor(position.x/464000), 0, Math.floor(position.z/403680)],
        lastCoords = this.lastChunkCoords,
        moveDir = [coords[0]-lastCoords[0], coords[2] - lastCoords[2]],
        viewDistance = (this.world.mobile ? 7 : 8),
        removeDistance = viewDistance + 2 + (window.innerWidth > 2100 ?  2 : 1),
        endCoords = [coords[0]+viewDistance, coords[2]+viewDistance],
        x = coords[0]-phase+1,
        y = coords[2]-phase;
        this.chunkCoords = coords;

    if (force || coords[0] != lastCoords[0] || coords[1] != lastCoords[1] || coords[2] != lastCoords[2]) {
      lastCoords = this.lastChunkCoords = [coords[0], coords[1], coords[2]];
      force = false; 	// remove old chunks
      for (c in voxelList) {
          platform = voxelList[c];
          pCell = platform.data.cell;
          if (!!!platform.cleanUp && (pCell[0] < coords[0] - removeDistance ||
                                      pCell[0] > coords[0] + removeDistance ||
                                      pCell[2] < coords[2] - removeDistance ||
                                      pCell[2] > coords[2] + removeDistance)
            ) { 	// mark voxels for removal
              platform.cleanUp = true;
              this.cleanUpChunks.push({physics: {cell: [pCell[0], 0, pCell[2]]}, cell: pCell[0]+".0."+pCell[2]});
            }
        }
      }
      c = 0;
      let cleanUpPlats = this.cleanUpChunks;
      this.cleanUpChunks.map((cleanUp, i) => {
          if (c < 4) {
              if (!!cleanUp) {
                terrainChunk = voxels[cleanUp.cell];
                if (terrainChunk) {
                  if (terrainChunk.mesh) {
                    three.scene.remove(terrainChunk.mesh);
                  }
                  if (terrainChunk.entities) {
                    terrainChunk.entities.map(e => {
                      this.octree.remove(e.mesh)
                    })
                  }
                }
                removePhysicsChunks.push(cleanUp.physics);
                voxelList.splice(voxels.indexOf(terrainChunk), 1);
                delete voxels[cleanUp.cell];
                cleanUpPlats.splice(i, 1);
            }
            c ++;
          }
      })
      c = 0;
      // load new voxels // at first just from client-side generation
      while (x <= endCoords[0]) {
        while (y <= endCoords[1]) {
            if (c < 6) {
              if (voxels[x+".0."+y] == null) { // only if its not already loaded
                  voxels[x+".0."+y] = true
                    c ++;
                    this.reqChunks.push(x+"x0x"+y)
              }
            }
            y += 1;
        }
        y = coords[2]-viewDistance;
        x += 1;
      }
      if (this.reqChunks.length >= 6) {
        let chunks = ""
        this.reqChunks.map( (rc, i) => {
          if (i > 0) {
            chunks += ","
          }
          chunks += rc
        })
        this.reqChunks = []; // empty array
        let showVoxels = true
        if (!!config) {
          showVoxels = config.type == "voxels" || config.type == "both"
        }
        axios.get(`${API_SERVER}/api/chunks/${this.world.name}/${chunks}`)
           .then(response => {
             let physicsVoxels = []
             typeof response.data.map == 'function' &&
             response.data.map(c =>{
                 let chunk = new Chunk({visible: showVoxels, altitude: c.altitude, color: c.color,
                                        entities: c.entities, voxels: c.voxels || [], structures: c.structures || []}, [c.x, 0, c.z]);
               if (!!chunk.geometry != "space") { // if its not empty space
                     three.scene.add(chunk.mesh);
                 }
                 physicsVoxels.push(chunk.data);
                 voxelList.push(chunk);
                 voxels[c.x+".0."+c.z] = chunk;
             })
             if (physicsVoxels.length > 0) {
               console.log("physics voxels", physicsVoxels)
               this.UserPhysics.worker.postMessage(JSON.stringify({
                     command: "add voxels",
                     data: physicsVoxels
                }))
                this.EntityPhysics.worker.postMessage(JSON.stringify({
                    command: "add voxels",
                    data: physicsVoxels
                }))
             }
          }).catch(response => {
             console.log("Chunk Error", response)
          });
      }

      if (removePhysicsChunks.length > 0) {
        let removeChunkData = JSON.stringify(removePhysicsChunks)
        this.UserPhysics.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
        this.EntityPhysics.worker.postMessage('{"command":"remove voxels","data":'+removeChunkData+'}')
      }

      lastCoords[0] = coords[0];
      lastCoords[1] = coords[1];
      lastCoords[2] = coords[2];
      phase ++;

      if (phase > viewDistance) {
        phase = 1;
      }
      setTimeout(() => { this.bufferChunks(force, phase); }, 32);
    }
}
