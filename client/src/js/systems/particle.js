export default class ParticleSystem {
    constructor (world) {
        this.world = world
        this.particleSystems = []
    }

    init (component) { 

        let prop = component.props.particles, 
            ps = new THREE.GPUParticleSystem( {
                    maxParticles: prop.maxParticles  || 9000
            }),
            options = {
                    position: new THREE.Vector3(),
                    positionRandomness: prop.positionRandomness || 3000,
                    velocity: new THREE.Vector3(),
                    velocityRandomness: .5,
                    color: prop.color || 0xffffff,
                    colorRandomness: prop.colorRandomness || .2,
                    turbulence: prop.turbulence || 100,
                    lifetime: prop.lifetime || 2,
                    size: prop.size || 500,
                    sizeRandomness: prop.sizeRandomness || .5
            }

        component.mesh.add(ps)
        this.particleSystems.push({component, ps})
        
        return {
            system: ps,
            options,
            spawn: ( nParticles ) => {
                let p = nParticles
                while (p >= 0) {
                    ps.spawnParticle(options)
                    p --
                }
            },
            updateParticles: ( tick ) => {
                ps.update( tick )
            },
            updateParticleOptions: (newOptions) => {
                component.state.particles.options = Object.assign({}, component.state.particle.options, newOptions)
            }
        }

    }

    update ( delta, time ) {

        let pSystems = this.particleSystems,
            p = pSystems.length -1,
            particles = null,
            options = null,
            s = 50 * delta

        while ( p >= 0 ) {

            particles = pSystems[ p ]
            options = particles.options

            while ( s >= 0 ) {

                particles.ps.spawnParticle( options )
                s -= 1

            }

            particles.ps.update( time )
            p -= 1

        }

    }
}

