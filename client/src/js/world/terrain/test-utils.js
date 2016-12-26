export let generateChunk = (x, y) => {
  let voxels = [],
      chunk = null,
      lightColor = false;

  if (this.seed.random() < 0.5 ) {
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
    chunk = new Chunk({voxels: voxels, structures: this.seed.random() < 0.15 ? [
      {
        length: 1+Math.floor(this.seed.random()*3.0),
        width: 1+Math.floor(this.seed.random()*3.0),
        floors: 2+Math.floor(this.seed.random()*10.0),
        position: [-1.0, 0, -1.0],
        light: lightColor
      }
    ] : []}, [x, 0, y]);
    three.scene.add(chunk.mesh);
  } else {
    chunk = { data: {
       cell: [x, 0, y]
    }};
  }
  return chunk;
}

export makeVoxels = (t) => {
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
