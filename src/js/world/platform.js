import Track from './track'
import Tower from './tower'

let physics = null;

export default class Platform {
    constructor (data, cell) {
        let x = 8,
            voxel = null,
            structure = null,
            track = null,
            items = [],
            altitude = 0,
            gridSize = 264000 / 16,
            narrow = gridSize * 0.87,
            mesh = null,
            bsp = null,
			      cellMesh = null,
            finalGeom = new THREE.Geometry(),
            base = new THREE.Geometry(),
            smooth = (data != null && data.smooth != null) ? data.smooth : false,
            // geom = new THREE.CylinderGeometry( 128000, 128000, 7000, 6, 1),
            geom = new THREE.CylinderGeometry( 132000, 132000, 50000, 6, 1),
            voxelGeom = new THREE.CylinderGeometry( 132000 / 16, 132000 / 16, 132000 / 8.5, 6, 1),
            mat = new THREE.MeshPhongMaterial( {color: 0x282828, shininess: 20} ),
            modifier = smooth ? new THREE.BufferSubdivisionModifier( 3 ) : null;

        this.structures = [];
        physics = window.three.world.worldPhysics.worker;

        if (data == null) {
            data = { }
        }

        if (!!data && !!data.voxels) { // terrain voxels
            items = data.voxels;
            cellMesh = new THREE.Mesh(geom, mat);
            cellMesh.updateMatrix();
            base.merge(cellMesh.geometry, cellMesh.matrix);

            x = items.length - 1;
            while (x >= 0 ) {
                voxel = items[x];
                cellMesh = new THREE.Mesh(voxelGeom, mat);
               cellMesh.position.set(-132000+(voxel.cell[0] * gridSize) + (voxel.cell[2] % 2==0 ? 0 : gridSize / 2),
                                      voxel.cell[1] * gridSize,    -132000+voxel.cell[2] * gridSize);
               cellMesh.updateMatrix();
               base.merge(cellMesh.geometry, cellMesh.matrix);
               x --;
            }
            mesh = new THREE.Mesh(base, mat);
        } else {
            if (smooth) {
                geom = modifier.modify( geom );
            }
            mesh = new THREE.Mesh(geom, mat);
        }
        three.scene.add(mesh);
        this.mesh = mesh;

        if (!!data && !!data.structures) { // multiple structures per platform
            items = data.structures;
            x = items.length;
            while (x > 0) {
                x--;
                structure = new Tower(items[x], this);
                // track = new Track(items[x], this);
                	if (Math.random() < 0.16) {
                    structure.initLight();
                  }
                // should switch here for other structure types
                this.structures.push(structure);
            }
        }

        if (!!data.position) {
            if (!!data.offset) {
                mesh.rotation.y = Math.PI;
                data.position.x -= 64000;
            }
            mesh.position.set(data.position[0], data.position[1] - 25000, data.position[2]);
        } else {
            if (!! cell) {
                mesh.position.set((cell[0]*232000) + (cell[2] % 2 == 0 ? 0 : 232000 / 2),
                                  cell[1]*232000 - 25000,
                                  cell[2]*232000 * 0.87);
                data.cell = cell;
                data.position = [
                    mesh.position.x,
                    mesh.position.y + 25000,
                    mesh.position.z
                ]
            } else {
                data.position = [0, 0, 0];
            }
        }
        if (data.size == null) {
            data.size = { x: 132000, y: 132000, z: 48000 };
        }
        this.data = data;
        this.mesh = mesh;
    }
}
