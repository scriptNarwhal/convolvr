import Structure from './structure'

class Tower extends Structure {
	constructor (data, platform, mobile = false) {
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
				towerMaterial = mobile ?
				new THREE.MeshLambertMaterial({
					color: 0xf0f0f0
				}) :
				new THREE.MeshPhongMaterial({
					color: 0xf0f0f0,
					specular: 0xf0f0f0
				}),
				LODGeometry = new THREE.BoxGeometry(50000 * xUnits, height, 50000 * zUnits);

		this.data = data;
		super(this.data)
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
		this.mesh.userData = { structure: this }
    this.platform.mesh.add(this.mesh);
    this.mesh.position.set(data.position[0]*50000, 43000+(floors+1) * 25000, length/2.0+data.position[2]*50000);
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
					shaftGeometry = new THREE.BoxGeometry(20000 * zUnits, height, 20000 * zUnits),
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

				for (f = 0; f <= floors; f++) {
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
				elevator.position.set((width/4), 0, (length/4));
				elevator.rotateY(Math.PI / 2);
				elevator.updateMatrix();
				var elevatorBSP = new ThreeBSP(elevator);
				bsp = bsp.subtract(elevatorBSP);
				finalGeom = bsp.toGeometry();
				finalGeom.computeFaceNormals();

				building = new THREE.Mesh(finalGeom, towerMaterial);
    		building.position.set(this.data.position[0]*50000, 43000+(floors+1) * 25000, this.data.position[2]*50000);
    		building.updateMatrix();
    		building.matrixAutoUpdate = false;
				this.platform.mesh.remove(this.mesh);
    		this.platform.mesh.add(building);
				this.mesh = building;
				this.mesh.userData = { structure: this }
    		return building;
    	}

    initElevator(x, y, z) {

    }

		initLight () {
				let led = null,
					  lightColor = this.data.light,
						xUnits = this.data.width,
						zUnits = this.data.length,
						geom = null,
						light = null,
						ledMat = null;

				if (lightColor && lightColor != 0) {
					//if (this.data.lightType == "billboard") {
					geom = new THREE.PlaneGeometry(50000 * xUnits, 35000, 4, 4);
					//} else {
					//	geom = new THREE.CylinderGeometry(13200, 13200, 5000, 6, 1);
					//}
					ledMat = new THREE.MeshBasicMaterial({color: lightColor, fog: false, wireframe: true} );
					led = new THREE.Mesh(geom, ledMat);
					this.platform.mesh.add(led);
					led.position.set(-3000 -(25000*xUnits), 10000+(1+this.data.floors * 50000), -3000-25000*zUnits);
					//led.scale.set(0.1, 0.4, 0.1);
					light =  new THREE.PointLight(lightColor, 1.0, 500000);
					led.add(light);
				}

		}
}

export default Tower;
