import WorldPhysics  from './world-physics'
import EntityPhysics from './entity-physics'
import GeometrySystem from './geometry'
import MaterialSystem from './material'
import AssetSystem from './assets'
import LightSystem from './light'
import TextSystem from './text'
import AudioSystem from './audio'
import VideoSystem from './video'
import SignalSystem from './signal'
import InputSystem from './input'
import MediaSystem from './media'
import DrawingSystem from './drawing'
import ControlSystem from './control'
import PropulsionSystem from './propulsion'
import FactorySystem from './factory'
import MetaFactorySystem from './meta-factory'
import ParticleSystem from './particle'
import ProjectileSystem from './projectile'
import DestructableSystem from './destructable'
import FloorSystem from './floor'
import WallSystem from './wall'
import VehicleSystem from './vehicle'
import PortalSystem from './portal'
import DoorSystem from './door'
import HoverSystem from './hover'
import ActivateSystem from './activate'
import CursorSystem from './cursor'
import HandSystem from './hand'
import TerrainSystem from './terrain'
import ContainerSystem from './container'
import RESTSystem from './rest'
import ToolUISystem from './tool-ui'
import TabViewSystem from './tab-view'
import TabSystem from './tab'
import ToolSystem from './tool'
import FileSystem from './file'
import ChatSystem from './chat'
import WebRTCSystem from './webrtc'
import NPCSystem from './npc'
import SpeechSystem from './speech'

export default class Systems {

    constructor ( world )  {

        let systems = {
			assets: new AssetSystem(world),
			geometry: new GeometrySystem(world),
			material: new MaterialSystem(world),
			worldPhysics: new WorldPhysics(world),
			entityPhysics: new EntityPhysics(world),
			light: new LightSystem(world),
			text: new TextSystem(world),
			audio: new AudioSystem(world),
			video: new VideoSystem(world),
			signal: new SignalSystem(world),
            input: new InputSystem(world),
            media: new MediaSystem(world),
			drawing: new DrawingSystem(world),
			control: new ControlSystem(world),
			propulsion: new PropulsionSystem(world),
			factory: new FactorySystem(world),
			metaFactory: new MetaFactorySystem(world),
			particles: new ParticleSystem(world),
			projectile: new ProjectileSystem(world),
			destructable: new DestructableSystem(world),
			floor: new FloorSystem(world),
			wall: new WallSystem(world),
			vehicle: new VehicleSystem(world),
			portal: new PortalSystem(world),
			door: new DoorSystem(world),
			cursor: new CursorSystem(world),
			hand: new HandSystem(world),
			hover: new HoverSystem(world),
			activate: new ActivateSystem(world),
			terrain: new TerrainSystem(world),
			container: new ContainerSystem(world),
			tab: new TabSystem(world),
			tabView: new TabViewSystem(world),
			toolUI: new ToolUISystem(world),
			tool: new ToolSystem(world),
			rest: new RESTSystem(world),
			webrtc: new WebRTCSystem(world),
			file: new FileSystem(world),
			chat: new ChatSystem(world),
			speech: new SpeechSystem(world),
			npc: new NPCSystem(world)
		}
        this.systems = systems
        Object.keys(systems).map(system=> {
            this[system] = systems[system]
        })

    }

    registerComponent ( component ) {

        let componentsByProp = component.entity.componentsByProp,
            props = component.props,
            state = component.state,
            deferredSystems = [],
            mesh = null

        Object.keys(props).map(prop=> {

            if (this[prop] != null) {

                if (prop == "light" || prop=="particle" || prop=="text" || prop == "audio" || prop == "video" || prop == "metaFactory") { /* add other systems here */
                    
					deferredSystems.push(prop)

                } else {

                    state[prop] = this[prop].init(component)

                    if (componentsByProp[prop] == undefined) {
                        componentsByProp[prop] = []
                    } 

                    componentsByProp[prop].push(component)

                }

            }

        })
        
        mesh = new THREE.Mesh(state.geometry.geometry, state.material.material)
        mesh.matrixAutoUpdate = false
        component.mesh = mesh

        deferredSystems.map(prop=>{
            state[prop] = this[prop].init(component)
        })

        return mesh
    }
}