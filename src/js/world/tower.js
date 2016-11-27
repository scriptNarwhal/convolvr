class Tower {
	constructor (data, platform) {
		var f = 0,
				i = 0,
				face = null,
				floors = data.floors,
				bsp,
				wallBSP,
				height = 50000 * floors,
				xUnits = (data.width || 1),
				zUnits = (data.length || 1),
				width = 50000 * xUnits,
				length = 50000 * zUnits,
				intensity = 0,
				towerMaterial = new THREE.MeshLambertMaterial({
					color: 0xf0f0f0,
					wireframe: false
				}),
				LODGeometry = new THREE.BoxGeometry(50000 * xUnits, height, 50000 * zUnits);

		this.data = data;
		this.platform = platform;
		this.towerMaterial = towerMaterial;
		this.width = width;
		this.length = length;
		if (data.light !== false) {
			this.initLight(data.light);
		}
		// LODGeometry.computeFaceNormals();
		// LODGeometry.computeVertexNormals();
    this.mesh = new THREE.Mesh(LODGeometry, towerMaterial);
    this.platform.mesh.add(this.mesh);
    this.mesh.position.set(data.position[0]*50000, 500+(floors+1) * 25000, data.position[2]*50000);
	}

    initFloor (y, width, length) {
    		var floorGeometry = new THREE.BoxGeometry(50000*width, 1600, 50000*length),
    		    floor = new THREE.Mesh(floorGeometry, this.towerMaterial),
    		    floorBSP;
    		floor.position.set(0, y, 0);
    		floor.updateMatrix();
    		return new ThreeBSP(floor);
	}

    generateFullLOD () {
			var f = 0,
					i = 0,
					face = null,
					floors = this.data.floors,
					bsp,
					wallBSP,
					height = 50000 * floors,
					xUnits = (this.data.width || 1),
					zUnits = (this.data.length || 1),
					width = 50000 * xUnits,
					length = 50000 * zUnits,
					intensity = 0,
					towerMaterial = new THREE.MeshLambertMaterial({
						color: 0xf0f0f0,
						wireframe: false
					}),
					towerGeometry = new THREE.BoxGeometry(50000 * xUnits, height, 5000),
					towerGeometryB = new THREE.BoxGeometry(5000, height, 50000 * zUnits),
					shaftGeometry = new THREE.BoxGeometry(25000 * zUnits, height, 25000 * zUnits),
					windowGeometry = new THREE.BoxGeometry(width * 0.75, 35000, 10000),
					windowBSP = null,
					windowMesh = null,
					towerMesh,
					finalGeom,
					building = null,
					detailLevels = [],
    		  floorHeight = 1;

				towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
				towerMesh.position.set(0, 0, -length / 2);
				towerMesh.updateMatrix();
				bsp = new ThreeBSP(towerMesh);

				towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
				towerMesh.position.set(0, 0, length / 2);
				towerMesh.updateMatrix();
				wallBSP = new ThreeBSP(towerMesh);
				bsp = bsp.union(wallBSP);

				towerMesh = new THREE.Mesh(towerGeometryB, towerMaterial);
				towerMesh.position.set(-width / 2, 0, 0);
				towerMesh.updateMatrix();
				wallBSP = new ThreeBSP(towerMesh);
				bsp = bsp.union(wallBSP);

				towerMesh = new THREE.Mesh(towerGeometryB, towerMaterial);
				towerMesh.position.set(width / 2, 0, 0);
				towerMesh.updateMatrix();
				wallBSP = new ThreeBSP(towerMesh);
				bsp = bsp.union(wallBSP);

				for (f = 0; f < floors; f++) {
					floorHeight = (-height / 2) + (f * 50000);
					bsp = bsp.union(this.initFloor(floorHeight, xUnits, zUnits));
						windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
						windowMesh.position.set(-width / 2, floorHeight - 17500, 0);
						windowMesh.rotateY(Math.PI / 2);
						windowMesh.updateMatrix();
						windowBSP = new ThreeBSP(windowMesh);
						bsp = bsp.subtract(windowBSP);
						windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
						windowMesh.position.set(width / 2, floorHeight - 17500, 0);
						windowMesh.rotateY(Math.PI / 2);
						windowMesh.updateMatrix();
						windowBSP = new ThreeBSP(windowMesh);
						bsp = bsp.subtract(windowBSP);
						windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
						windowMesh.position.set(0, floorHeight - 17500, -width / 2);
						windowMesh.updateMatrix();
						windowBSP = new ThreeBSP(windowMesh);
						bsp = bsp.subtract(windowBSP);
						windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
						windowMesh.position.set(0, floorHeight - 17500, width / 2);
						windowMesh.updateMatrix();
						windowBSP = new ThreeBSP(windowMesh);
						bsp = bsp.subtract(windowBSP);
				}

				var elevator = new THREE.Mesh(shaftGeometry, towerMaterial);
				elevator.position.set((width / 2) - 10000, 0, (length / 2) - 10000);
				elevator.rotateY(Math.PI / 2);
				elevator.updateMatrix();
				var elevatorBSP = new ThreeBSP(elevator);
				bsp = bsp.subtract(elevatorBSP);
				finalGeom = bsp.toGeometry();
				finalGeom.computeFaceNormals();

				building = new THREE.Mesh(finalGeom, towerMaterial);
    		building.position.set(this.data.position[0]*50000, 500+(floors+1) * 25000, this.data.position[2]*50000);
    		building.updateMatrix();
    		building.matrixAutoUpdate = false;
				this.platform.mesh.remove(this.mesh);
    		this.platform.mesh.add(building);
				this.mesh = building;
    		return building;
    	}

    initElevator(x, y, z) {

    }

		initLight (lightColor) {
				let emblem = null,
						geom = new THREE.CylinderGeometry( 132000, 132000, 50000, 6, 1),
						emblemMat = new THREE.MeshBasicMaterial( {color: 0xffffff, fog: false, wireframe: false} );

				emblem = new THREE.Mesh(geom, emblemMat);
				this.platform.mesh.add(emblem);
				emblem.position.set(0, this.data.floors * 50000, 0);
				emblem.scale.set(0.1, 0.4, 0.1);

				let light =  new THREE.PointLight(lightColor, 1.0, 700000);
				emblem.add(light);
		}
}

export default Tower;
