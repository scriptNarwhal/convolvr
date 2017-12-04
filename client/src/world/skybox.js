export default class SkyBox {

    constructor ( world ) {

        this.world = world
        this.systems = this.world.systems
    }

    init ( config, oldMesh ) {


    }

    loadTexturedSky ( config, mesh, callback ) {

        let world = this.world

        this.systems.assets.loadImage( '/data/user/'+config.photosphere, {}, ( texture ) => {
            
            let skySize = 1000+((world.viewDistance+3.5)*1.4)*140,
                image = {},
                material = {}
            
            texture.magFilter = THREE.LinearFilter
            material = new THREE.MeshBasicMaterial({map: texture, side:1, fog: false})
            image = material.map.image
            
            if ( !!config && !!config.photosphere && image.naturalWidth / image.naturalHeight > 2.2) {
                three.scene.remove( world.skyboxMesh )
                world.skyboxMesh = new THREE.Mesh(new THREE.CylinderGeometry( skySize/2, skySize/2, skySize, 24), material )        
                three.scene.add(world.skyBoxMesh)
            } else {
                world.skyboxMesh.material = material  
            }
            callback()
        })
    }

    loadShaderSky ( config, oldConfig, mesh, callback ) {

        let starMatProp = this.systems.assets.getMaterialProp("stars"),
            starSkyTexture = this.systems.material.procedural.generateTexture( starMatProp.procedural ),
            world = this.world 

        this.world.loadShaders( "/data/shaders/sky-vertex.glsl", "/data/shaders/sky-fragment.glsl", (vert, frag) => {

            let skyMaterial = new THREE.ShaderMaterial({
                side: 1,
                fog: false,
                uniforms: {
                    time: { type: "f", value: 1.0 },
                    red: { type: "f", value: config.sky.red },
                    green: { type: "f", value: config.sky.green },
                    blue: { type: "f", value: config.sky.blue },
                    terrainRed: { type: "f", value: config.terrain.red },
                    terrainGreen: { type: "f", value: config.terrain.green },
                    terrainBlue: { type: "f", value: config.terrain.blue },
                    lightYaw: { type: "f", value: config.light.yaw },
                    lightPitch: { type: "f", value: config.light.pitch },
                    starTexture: {
                        type: "t",
                        value: starSkyTexture
                    }
                },
                vertexShader: vert,
                fragmentShader: frag
            })
            mesh.material = skyMaterial
        }, progress => {
            console.log("Loading Shaders: ", progress)
        })	 
    }

    followUser ( delta, position ) {

        let camera = three.camera,
            terrainEnt = this.world.terrain.distantTerrain,
            config = this.world.config,
            skyLight = this.world.skyLight,
            sunLight = this.world.sunLight,
            yaw = config ? config.light.yaw - Math.PI / 2.0 : 0,
            pitch = config ? config.light.pitch : 0,
            skyMat = null

        if ( this.world.skyboxMesh && this.world.skyLight ) {

            skyMat = this.world.skyboxMesh.material

            if ( skyMat ) {

                if ( skyMat.uniforms )

                    skyMat.uniforms.time.value += delta

                this.world.skyboxMesh.position.set(camera.position.x, camera.position.y, camera.position.z)
                
                if (sunLight.castShadow) {
                    sunLight.shadow.camera.position.set(sunLight.position.x, 2800, sunLight.position.z)
                    sunLight.shadow.camera.updateMatrix()
                }
                
                skyLight.position.set( camera.position.x, 2000+camera.position.y, camera.position.z )
                sunLight.position.set( camera.position.x-Math.sin(yaw)*2001, 2800, camera.position.z-Math.cos(yaw)*2001) // y  // +camera.position.y+ Math.sin(pitch)*801
                //console.log(skyLight.position, sunLight.position)
                //this.skyLight.shadow.camera.lookAt( skyLight )
            }
        }

        if ( terrainEnt )

            terrainEnt.update( [ camera.position.x, terrainEnt.mesh.position.y, camera.position.z ] )

    }

}