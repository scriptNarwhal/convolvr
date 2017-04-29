export default class ParticleSystem {
    constructor (world) {
        this.world = world
        this.particleSystems = []
    }

    init (component) { 
        let prop = component.props.particle, 
            ps = new THREE.GPUParticleSystem( {
                    maxParticles: 10000
            }),
            options = {
                    position: new THREE.Vector3(),
                    positionRandomness: .3,
                    velocity: new THREE.Vector3(),
                    velocityRandomness: .5,
                    color: prop.color || 0xffffff,
                    colorRandomness: prop.colorRandomness || .2,
                    turbulence: prop.turbulence || .5,
                    lifetime: prop.lifetime || 2,
                    size: prop.size || 5,
                    sizeRandomness: 1
            }

        component.mesh.add(ps)
        this.particleSystems.push({component, ps})
        return {
            system: ps,
            options,
            spawn: (nParticles) => {
                let p = nParticles
                while (p >= 0) {
                    ps.spawnParticle(options)
                    p --
                }
            },
            updateParticleOptions: (newOptions) => {
                component.state.particle.options = Object.assign({}, component.state.particle.options, newOptions)
            }
        }
    }
}

