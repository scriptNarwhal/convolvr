import WorldPhysics  from '../systems/world-physics'
import EntityPhysics from '../systems/entity-physics'
import GeometrySystem from '../systems/geometry'
import MaterialSystem from '../systems/material'
import AssetSystem from '../systems/assets'
import LightSystem from '../systems/light'
import TextSystem from '../systems/text'
import AudioSystem from '../systems/audio'
import VideoSystem from '../systems/video'
import SignalSystem from '../systems/signal'
import InputSystem from '../systems/input'
import MediaSystem from '../systems/media'
import DrawingSystem from '../systems/drawing'
import ControlSystem from '../systems/control'
import PropulsionSystem from '../systems/propulsion'
import FactorySystem from '../systems/factory'
import MetaFactorySystem from '../systems/factory'
import ParticleSystem from '../systems/particle'
import ProjectileSystem from '../systems/projectile'
import DestructableSystem from '../systems/destructable'
import FloorSystem from '../systems/floor'
import WallSystem from '../systems/wall'
import VehicleSystem from '../systems/vehicle'
import PortalSystem from '../systems/portal'
import DoorSystem from '../systems/door'
import HoverSystem from '../systems/hover'
import ActivateSystem from '../systems/activate'
import CursorSystem from '../systems/cursor'
import HandSystem from '../systems/hand'
import TerrainSystem from '../systems/terrain'
import ContainerSystem from '../systems/container'
import RESTSystem from '../systems/rest'
import ToolUISystem from '../systems/tool-ui'
import TabViewSystem from '../systems/tab-view'
import TabSystem from '../systems/tab'
import ToolSystem from '../systems/tool'
import FileSystem from '../systems/file'
import ChatSystem from '../systems/chat'
import WebRTCSystem from '../systems/webrtc'
import NPCSystem from '../systems/npc'
import SpeechSystem from '../systems/speech'

export default class Systems {
    constructor (world)  {
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

    registerComponent (component) {
        let componentsByProp = component.entity.componentsByProp,
            props = component.props,
            state = component.state,
            deferredSystems = [],
            mesh = null

        Object.keys(props).map(prop=> {
            if (this[prop] != null) {
                if (prop=="particle" || prop=="text" || prop == "audio" || prop == "video") { /* add other systems here */
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