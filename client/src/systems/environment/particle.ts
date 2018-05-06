import Convolvr from "../../world/world";
import Component from "../../core/component";
import * as THREE from 'three';
export default class ParticleSystem {
    
    world:           Convolvr
    particleSystems: Array<any>
    live:            boolean
    
    constructor (world: Convolvr) {
        this.world = world
        this.particleSystems = []
        this.live = true
    }

    init (component: Component) { 

        let attr = component.attrs.particles, 
            ps = new this.world.THREE.GPUParticleSystem( {
                    maxParticles: attr.maxParticles  || 0.4
            }),
            options = {
                    position: new THREE.Vector3(),
                    positionRandomness: attr.positionRandomness || 0.08,
                    velocity: new THREE.Vector3(),
                    velocityRandomness: .5,
                    color: attr.color || 0xffffff,
                    colorRandomness: attr.colorRandomness || .2,
                    turbulence: attr.turbulence || 100,
                    lifetime: attr.lifetime || 2,
                    size: attr.size || 500,
                    sizeRandomness: attr.sizeRandomness || .5
            }

        component.mesh.add(ps)
        this.particleSystems.push({component, ps})
        
        return {
            system: ps,
            options,
            spawn: ( nParticles: number ) => {
                let p = nParticles
                while (p >= 0) {
                    ps.spawnParticle(options)
                    p --
                }
            },
            updateParticles: ( tick: number ) => {
                ps.update( tick )
            },
            updateParticleOptions: (newOptions: any) => {
                component.state.particles.options = Object.assign({}, component.state.particle.options, newOptions)
            }
        }

    }

    tick ( delta: number, time: number) {

        let pSystems = this.particleSystems,
            p = pSystems.length -1,
            particles = null,
            options = null,
            s = 50 * delta

        while ( p >= 0 ) {

            particles = pSystems[ p ]
            
            if ( particles && particles.options ) {
                options = particles.options
                while ( s >= 0 ) {
                    particles.ps.spawnParticle( options )
                    s -= 1
                }
                particles.ps.update( time )
            }
            
            p -= 1
        }
    }
}

