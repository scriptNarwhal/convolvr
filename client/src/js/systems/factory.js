import Entity from '../entities/entity'

export default class FactorySystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        let prop = component.props.factory

        return {
            generate: () => {
                this.generate(component) // presumably
            }
        }
    }

    generate (component) {
        let prop = component.props.factory,
            position = component.entity.position
            entity = prop.entity,
            quat = entity.quaternion,
            components = entity.components,
            created = new Entity(-1, components, position.toArray(), quat)
        
        created.init(window.three.scene)
        created.mesh.translateZ(-10000)
        created.update(created.mesh.position.toArray())
    }
}

