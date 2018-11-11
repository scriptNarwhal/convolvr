import Convolvr from "../../world/world";
import Component from "../../model/component";

import * as THREE from 'three';

export default class SkyboxSystem {

    public live = true;
    private world: Convolvr

    constructor(world: Convolvr) {
        this.world = world
        this.live = true
    }

    init(component: Component) {

        return {

        }
    }

    tick (delta: number, time: number ) {
        this.followUser( delta )
    }

    createSkybox(skySize: number, oldSkyMaterial: any, cylinderMode = false) {
        let skybox = null

        if ( cylinderMode ) {
            skybox = new THREE.Mesh(new THREE.CylinderGeometry(2800+skySize / 2, skySize / 2, skySize, 24), oldSkyMaterial)
        } else {
            skybox = new THREE.Mesh(new THREE.OctahedronGeometry(2800+skySize, 4), oldSkyMaterial)
        }

        let sunMesh = new THREE.Mesh(
            new THREE.OctahedronGeometry(skySize/32, 3), 
            new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.95, transparent: true})
        );
        console.warn("create the sun")
        this.world.sunLight.add(sunMesh);
        this.world.three.scene.add(skybox)
        return skybox
    }

    destroy () {
        let skyboxMesh = this.world.skyboxMesh
        if ( skyboxMesh && skyboxMesh.parent ) {
		    skyboxMesh.parent.remove( skyboxMesh )
		}
    }

    loadTexturedSky(config: any, mesh: any, skySize: number, callback: Function) {
        let world = this.world,
            systems = world.systems

        systems.assets.loadImage('/data/user/' + config.photosphere, {}).then((texture: any) => {

            let skySize = 1000 + ((world.settings.viewDistance + 3.5) * 1.4) * 140,
                image: any = {},
                oldMaterial = {},
                material: any = {},
                ratio = 1.7

            texture.magFilter = THREE.LinearFilter
            material = new THREE.MeshBasicMaterial({ map: texture, side: 1, fog: false })
            image = material.map.image
            ratio = image.naturalWidth / image.naturalHeight
            if (!!config && !!config.photosphere && ratio > 2.2 || ratio < 1.9 ) {
                oldMaterial = world.skyBoxMesh.material
                (window as any).three.scene.remove(world.skyboxMesh)
                if (ratio < 2) {
                    material.map.setRepeat
                }
                this.createSkybox(skySize, oldMaterial, true )
            } else {
                mesh.material = material
            }
            callback()
        })
    }

    loadShaderSky(config: any, oldConfig: any, mesh: any, callback: Function) {
        let systems = this.world.systems,
            starMatProp = systems.assets.getMaterialProp("stars"),
            starSkyTexture = systems.material.procedural.generateTexture(starMatProp),
            world = this.world

        systems.assets.loadShaders("/data/shaders/sky-vertex.glsl", "/data/shaders/sky-fragment.glsl", (vert: any, frag: any) => {
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
        }, (progress: any) => {
            console.log("Loading Shaders: ", progress)
        }, (onError: any) => {
            console.error(onError);
        })
    }

    followUser(delta: number, position?: number[] ) {
        let camera = (window as any).three.camera,
            world = this.world,
            terrainEnt = world.terrain.distantTerrain,
            config = world.config,
            skyLight = world.skyLight,
            sunLight = world.sunLight,
            yaw = config ? config.light.yaw - Math.PI / 2.0 : 0,
            pitch = config ? config.light.pitch : 0,
            skyMat = null

        if (world.skyboxMesh && world.skyLight) {
            skyMat = world.skyboxMesh.material

            if (skyMat) {
                if (skyMat.uniforms) {
                    skyMat.uniforms.time.value += delta
                }
                world.skyboxMesh.position.set(camera.position.x, camera.position.y, camera.position.z)

                skyLight.position.set(camera.position.x, 2000 + camera.position.y, camera.position.z)
                sunLight.position.set(camera.position.x - Math.sin(yaw) * 2001, 2800, camera.position.z - Math.cos(yaw) * 2001) // y  // +camera.position.y+ Math.sin(pitch)*801
                //console.log(skyLight.position, sunLight.position)
                //this.skyLight.shadow.camera.lookAt( skyLight )
                if (sunLight.castShadow) {
                   // sunLight.shadow.camera.position.set(sunLight.position.x, 2800, sunLight.position.z)
                    //sunLight.shadow.camera.updateMatrix()
                }
            }
        }

        if (terrainEnt)
            terrainEnt.update([camera.position.x, terrainEnt.mesh.position.y, camera.position.z], false, false, false, false, { updateWorkers: false })

    }
}