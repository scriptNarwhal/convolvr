import axios from 'axios'
import Chunk from './chunk'
import { API_SERVER } from '../../config.js'

export default class Terrain {
  constructor (world) {
    this.world = world;
    this.config = world.config.terrain;
    this.seed = world.seed;
    this.worldPhysics = world.worldPhysics;
    this.platforms = [];
		this.pMap = []; // map of coord strings to platforms
		this.lastChunkCoords = [0, 0, 0];
		this.chunkCoords = [0, 0, 0];
		this.cleanUpChunks = [];
    this.reqChunks = [];
  }

  init (config) {
    this.config = config
    let geom = new THREE.PlaneGeometry(8000000, 8000000, 2, 2),
        mat = new THREE.MeshPhongMaterial({color: this.config.color}),
        mesh = new THREE.Mesh(geom, mat)
    this.mesh = mesh
    mesh.rotation.x = -Math.PI/2
    mesh.position.y = -168000 - 125000 / this.config.flatness
    three.scene.add(mesh)
  }

  bufferChunks (force, phase) {
    let platforms = this.platforms,
        plat = null,
        chunk = null,
        removePhysicsChunks = [],
        chunkPos = [],
        pCell = [0,0,0],
        pMap = this.pMap,
        position = three.camera.position,
        platform = null,
        physicalPlat = null,
        c = 0,
        coords = [Math.floor(position.x/232000), 0, Math.floor(position.z/201840)],
        lastCoords = this.lastChunkCoords,
        moveDir = [coords[0]-lastCoords[0], coords[2] - lastCoords[2]],
        viewDistance = (this.world.mobile ? 6 : 11),
        removeDistance = viewDistance + 2 + (window.innerWidth > 2100 ?  2 : 1),
        endCoords = [coords[0]+viewDistance -2, coords[2]+viewDistance],
        x = coords[0]-phase+1,
        y = coords[2]-phase;
        this.chunkCoords = coords;

    if (force || coords[0] != lastCoords[0] || coords[1] != lastCoords[1] || coords[2] != lastCoords[2]) {
      lastCoords = this.lastChunkCoords = [coords[0], coords[1], coords[2]];
      force = false; 	// remove old chunks
      for (c in platforms) {
          platform = platforms[c];
          pCell = platform.data.cell;
          if (!!!platform.cleanUp && (pCell[0] < coords[0] - removeDistance ||
                                      pCell[0] > coords[0] + removeDistance ||
                                      pCell[2] < coords[2] - removeDistance ||
                                      pCell[2] > coords[2] + removeDistance)
            ) { 	// park platforms for removal
              platform.cleanUp = true;
              this.cleanUpChunks.push({physics: {cell: [pCell[0], 0, pCell[2]]}, cell: pCell[0]+".0."+pCell[2]});
            }
        }
      }
      c = 0;
      let cleanUpPlats = this.cleanUpChunks;
      this.cleanUpChunks.forEach(function (plat, i) {
          if (c < 4) {
            if (!!plat) {
              physicalPlat = pMap[plat.cell];
              !! physicalPlat && !! physicalPlat.mesh && three.scene.remove(physicalPlat.mesh);
              removePhysicsChunks.push(plat.physics);
              platforms.splice(platforms.indexOf(physicalPlat), 1);
              delete pMap[plat.cell];
              cleanUpPlats.splice(i, 1);
            }
            c ++;
          }
        })
        c = 0;
        // load new platforms // at first just from client-side generation

          while (x <= endCoords[0]) {
            while (y <= endCoords[1]) {
              if (c < 6) {
                  //console.log("checking", x, y);
                  if (pMap[x+".0."+y] == null) { // only if its not already loaded
                    pMap[x+".0."+y] = true
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
        axios.get(`${API_SERVER}/api/chunks/${this.world.name}/${chunks}`)
           .then(response => {
             let physicalChunks = []
             typeof response.data.map == 'function' &&
             response.data.map(c =>{
                 let chunk = new Chunk({altitude: c.altitude, color: c.color,
                                        entities: c.entities, voxels: c.voxels || [], structures: c.structures || []}, [c.x, 0, c.z]);
                 if (!!chunk.geometry != "space") { // if its not empty space
                     physicalChunks.push(chunk.data);
                     three.scene.add(chunk.mesh);
                 }
                 platforms.push(chunk);
                 pMap[c.x+".0."+c.z] = chunk;
             })
             if (physicalChunks.length > 0) {
               this.worldPhysics.worker.postMessage(JSON.stringify({
                     command: "add platforms",
                     data: physicalChunks
                 }))
             }
          }).catch(response => {
             console.log("Chunk Error", response)
          });
      }

      if (removePhysicsChunks.length > 0) {
        this.worldPhysics.worker.postMessage('{"command":"remove platforms","data":'+JSON.stringify(removePhysicsChunks)+'}');
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
