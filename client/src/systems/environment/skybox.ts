import Convolvr from "../../world/world";
import Component from "../../model/component";

import * as THREE from 'three';
import { Mesh, Material, Texture, Vector3 } from "three";
import { SpaceConfig, Sky } from "../../model/space";
import { System } from "..";
import AssetSystem from "../core/assets";
import Entity from "../../model/entity";
import { GRID_SIZE } from "../../config";
import avatar from "../../assets/entities/avatars/avatar";

export default class SkyboxSystem implements System {

    public live = true;
    public world: Convolvr
    public dependencies = [["assets"]]

    private assets: AssetSystem

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

    createSkybox(skySize: number, oldSkyMaterial: any, cylinderMode = false): Mesh {
        let skybox = null

        if ( cylinderMode ) {
            skybox = new THREE.Mesh(new THREE.CylinderGeometry(2800+skySize / 2, skySize / 2, skySize, 24), oldSkyMaterial);
        } else {
            skybox = new THREE.Mesh(new THREE.OctahedronGeometry(2800+skySize, 4), oldSkyMaterial);
        }

        let sunMesh = new THREE.Mesh(
            new THREE.OctahedronGeometry(skySize/28, 3), 
            new THREE.MeshBasicMaterial({color: 0xffffff})
        );

        sunMesh.add(new THREE.Mesh(
            new THREE.OctahedronGeometry(skySize/12, 3), 
            new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.16, transparent: true})
        ));

        this.world.sunLight.add(sunMesh);
        this.world.three.scene.add(skybox);
        return skybox
    }

    destroy () {
        let skyboxMesh = this.world.skyboxMesh;

        if ( skyboxMesh && skyboxMesh.parent ) {
		    skyboxMesh.parent.remove( skyboxMesh );
		}
    }

    loadTexturedSky(config: Sky, mesh: Mesh, skySize: number, callback: Function) {
        let world = this.world

        this.assets.loadImage('/data/user/' + config.photosphere, {}).then((texture: any) => {

            let skySize = 1000 + ((world.settings.viewDistance + 3.5) * 1.4) * 140,
                image: any = {},
                oldMaterial = {},
                material: THREE.MeshBasicMaterial = null,
                ratio = 1.7

            texture.magFilter = THREE.LinearFilter
            material = new THREE.MeshBasicMaterial({ map: texture, side: 1, fog: false })
            image = material.map.image
            ratio = image.naturalWidth / image.naturalHeight

            if (!!config && !!config.photosphere && ratio > 2.2 || ratio < 1.9 ) {
                oldMaterial =  world.skyBoxMesh ? world.skyBoxMesh.material : null;
                (window as any).three.scene.remove(world.skyboxMesh)
                if (ratio < 2) {
                    material.map.repeat.set(2,1)
                }
                world.skyboxMesh = this.createSkybox(skySize, material, true)
            } else {
                mesh.material = material
            }
            callback()
        })
    }

    loadShaderSky(config: SpaceConfig, oldConfig: any, mesh: Mesh, callback: Function) {
        let systems = this.world.systems,
            starMatProp = systems.assets.getMaterialProp("stars"),
            starSkyTexture = systems.material.procedural.generateTexture(starMatProp),
            world = this.world

        const shaderURLs = world.config.sky['vertexShader'] 
            ? [world.config.sky.vertexShader, world.config.sky.fragmentShader] 
            : ["/data/shaders/sky-vertex.glsl", "/data/shaders/sky-fragment.glsl"];

        systems.assets.loadShaders(shaderURLs[0], shaderURLs[1], (vert: any, frag: any) => {
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
            terrainEnt = world.space.distantTerrain;

        if (!!!terrainEnt) {
            return;
        }

        let config = world.config,
            skyLight = world.skyLight,
            sunLight = world.sunLight,
            yaw = config ? config.light.yaw - Math.PI / 2.0 : 0,
            pitch = config ? config.light.pitch : 0,
            skyMat = null;

        if (world.skyboxMesh && world.skyLight) {
            skyMat = world.skyboxMesh.material;

            if (skyMat) {
                if ((skyMat as any).uniforms) {
                    (skyMat as any).uniforms.time.value += delta
                }
                world.skyboxMesh.position.set(camera.position.x, camera.position.y, camera.position.z)

                skyLight.position.set(camera.position.x, 2000 + camera.position.y, camera.position.z)
                sunLight.position.set(camera.position.x - Math.sin(yaw) * 2001, 2800, camera.position.z - Math.cos(yaw) * 2001) // y  // +camera.position.y+ Math.sin(pitch)*801
                //console.log(skyLight.position, sunLight.position)
               
                    
                if (sunLight.castShadow) {
                    const avatar = this.world.user.avatar as Entity;
 
                    if (avatar && avatar.voxel) {
                        const voxelCoords = [GRID_SIZE[0] * avatar.voxel[0], 0, GRID_SIZE[2] * avatar.voxel[2]];
    
                        sunLight.shadow.camera.lookAt( new Vector3(voxelCoords[0], 0, voxelCoords[2]));
                        sunLight.shadow.camera.updateMatrix();
                    }
                   // sunLight.shadow.camera.position.set(sunLight.position.x, 2800, sunLight.position.z)
                    //sunLight.shadow.camera.updateMatrix()
                }
            }
        }

        if (terrainEnt && terrainEnt.mesh) {
            terrainEnt.update([camera.position.x, terrainEnt.mesh.position.y, camera.position.z], null, null, null, null, { updateWorkers: false })
        }

    }
}