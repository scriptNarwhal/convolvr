import Platform from './platform'

export default class Terrain {
  constructor (world) {
    this.world = world;
    this.seed = world.seed;
    this.worldPhysics = world.worldPhysics;
    this.platforms = [];
		this.pMap = []; // map of coord strings to platforms
		this.lastChunkCoords = [0, 0, 0];
		this.chunkCoords = [0, 0, 0];
		this.cleanUpPlatforms = [];
  }

  bufferPlatforms (force, phase) {
    let platforms = this.platforms,
      plat = null,
      physicalPlatforms = [],
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
      endCoords = [coords[0]+viewDistance, coords[2]+viewDistance],
      x = coords[0]-phase,
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
              this.cleanUpPlatforms.push({physics: {cell: [pCell[0], 0, pCell[2]]}, cell: pCell[0]+".0."+pCell[2]});
            }
        }
      }
        c = 0;
        let cleanUpPlats = this.cleanUpPlatforms;
        this.cleanUpPlatforms.forEach(function (plat, i) {
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
            //console.log("checking", x, y);
            if (c < 2 && pMap[x+".0."+y] == null) { // only if its not already loaded
              c ++;
              if (this.seed.random() < 0.5 ) {
                let voxels = [],
                    lightColor = false;

                if (this.seed.random() < 0.33) {
                  if (this.seed.random() < 0.6) {
                    lightColor = 0x00ff00;
                  } else {
                    if (this.seed.random() < 0.5) {
                      lightColor = 0x20ff00;
                    } else {
                      if (this.seed.random() < 0.4) {
                        lightColor = 0x00ff20;
                      } else {
                        lightColor = 0x0020ff;
                      }
                    }
                  }
                }

                if (this.seed.random() < 0.16) {
                  voxels = this.makeVoxels( Math.floor(this.seed.random() * 5) );
                }
                platform = new Platform({voxels: voxels, structures: this.seed.random() < 0.15 ? [
                  {
                    length: 1+Math.floor(this.seed.random()*3.0),
                    width: 1+Math.floor(this.seed.random()*3.0),
                    floors: 2+Math.floor(this.seed.random()*10.0),
                    position: [-1.0, 0, -1.0],
                    light: lightColor
                  }
              ] : undefined}, [x, 0, y]);
                three.scene.add(platform.mesh);
                physicalPlatforms.push(platform.data);
              } else {
                platform = { data: {
                   cell: [x, 0, y]
                }};
              }

              platforms.push(platform);
              pMap[x+".0."+y] = platform;
            }
            y += 1;
          }
          y = coords[2]-viewDistance;
          x += 1;
        }

      if (physicalPlatforms.length > 0) {
        this.worldPhysics.worker.postMessage(JSON.stringify({
              command: "add platforms",
              data: physicalPlatforms
          }))
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
      setTimeout(() => { this.bufferPlatforms(force, phase); }, 32);
    }

  makeVoxels (t) {
    let voxels = [],
      y = 11,
      x = 15;

    switch(t) {
      case 0:
        for (x = 8; x >= 0; x--) {
          if (this.seed.random() < 0.1) {
            voxels.push({
              cell: [
                x, 2+Math.floor(2*Math.sin(x/6.0)), x % 6
              ]
            })
          }
        }
      break
      case 1:
        for (x = 15; x >= 0; x--) {
          for (y = 8; y >= 0; y--) {
            if (this.seed.random() < 0.2) {
              voxels.push({
                cell: [
                  x, 2+Math.floor(Math.sin(x/12.0)*Math.cos(y/12.0)), y
                ]
              })
            }
          }
        }
      break;
      case 2:
      for (x = 8; x >= 0; x--) {
        for (y = 11; y >= 0; y--) {
          if (this.seed.random() < 0.4) {
            voxels.push({
              cell: [
                x-y, 2+y%4, y+x
              ]
            })
          }
        }
      }
      break;
      case 3:
      for (x = 15; x >= 0; x--) {
        for (y = 11; y >= 0; y--) {
          if (this.seed.random() < 0.75) {
            voxels.push({
              cell: [
                x, Math.floor(y+x/4.0), y
              ]
            })
          }
        }
      }
      break;
      case 4:
      for (x = 15; x >= 0; x--) {
        for (y = 11; y >= 0; y--) {
          if (this.seed.random() < 0.25) {
            voxels.push({
              cell: [
                x, 2+Math.floor(2*Math.sin(x/3.5)+2*Math.cos(y/3.5)), y
              ]
            })
          }
        }
      }
      break;
    }
    return voxels;
  }
}
