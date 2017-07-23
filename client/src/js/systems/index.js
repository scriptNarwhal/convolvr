import StaticCollisions  from './static-collisions'
import DynamicCollisions from './dynamic-collisions'
import GeometrySystem from './geometry'
import MaterialSystem from './material'
import AssetSystem from './assets'
import BrowserSystem from './browser'
import LightSystem from './light'
import LayoutSystem from './layout'
import TextSystem from './text'
import AudioSystem from './audio'
import VideoSystem from './video'
import EmoteSystem from './emote'
import SignalSystem from './signal'
import InputSystem from './input'
import MediaSystem from './media'
import CameraSystem from './camera'
import OimoPluginSystem from './oimo-plugin'
import CPUSystem from './cpu'
import DisplayAdapterSystem from './display-adapter'
import GraphSystem from './graph'
import MemorySystem from './memory'
import IOControllerSystem from './io-controller'
import NetworkInterfaceSystem from './network-interface'
import DriveControllerSystem from './drive-controller'
import DisplaySystem from './display'
import DrawingSystem from './drawing'
import ControlSystem from './control'
import PropulsionSystem from './propulsion'
import PowerSupplySystem from './power-supply'
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
import LookAwaySystem from './look-away'
import ActivateSystem from './activate'
import CursorSystem from './cursor'
import HandSystem from './hand'
import TerrainSystem from './terrain'
import ContainerSystem from './container'
import RESTSystem from './rest'
import SocialMediaSystem from './social-media'
import TimeSystem from './time'
import ToolUISystem from './tool-ui'
import ConditionSystem from './condition'
import SwitchSystem from './switch'
import LoopSystem from './loop'
import ToolSystem from './tool'
import MiniatureSystem from './miniature'
import UserSystem from './user'
import FileSystem from './file'
import ChatSystem from './chat'
import WebRTCSystem from './webrtc'
import NPCSystem from './npc'
import SpeechSystem from './speech'
import ScreenshotSystem from './screenshot'
import ObjSystem from './obj-plugin'
import DatGUIVRPluginSystem from './datguivr-plugin'


export default class Systems {

    constructor ( world )  {

        let systems = {
			activate: new ActivateSystem( world ),
			audio: new AudioSystem( world ),
			assets: new AssetSystem( world ),
			browser: new BrowserSystem( world ),
			camera: new CameraSystem( world ),
			chat: new ChatSystem( world ),
			container: new ContainerSystem( world ),
			condition: new ConditionSystem( world ),
			control: new ControlSystem( world ),
			cursor: new CursorSystem( world ),
			cpu: new CPUSystem( world ),
			datgui: new DatGUIVRPluginSystem( world ),
			destructable: new DestructableSystem( world ),
			display: new DisplaySystem( world ),
			displayAdapter: new DisplayAdapterSystem( world ),
			door: new DoorSystem( world ),
			drawing: new DrawingSystem( world ),
			driveController: new DriveControllerSystem( world ),
			dynamicCollisions: new DynamicCollisions( world ),
			emote: new EmoteSystem( world ),
			factory: new FactorySystem( world ),
			file: new FileSystem( world ),
			floor: new FloorSystem( world ),
			geometry: new GeometrySystem( world ),
			graph: new GraphSystem( world ),
			hand: new HandSystem( world ),
			hover: new HoverSystem( world ),
			ioController: new IOControllerSystem( world ),
			input: new InputSystem( world ),
			loop: new LoopSystem( world ),
			light: new LightSystem( world ),
			layout: new LayoutSystem( world ),
			lookAway: new LookAwaySystem( world ),
			material: new MaterialSystem( world ),
			memory: new MemorySystem( world ),
			media: new MediaSystem( world ),
			metaFactory: new MetaFactorySystem( world ),
			miniature: new MiniatureSystem( world ),
			networkInterface: new NetworkInterfaceSystem( world ),
			npc: new NPCSystem( world ),
			obj: new ObjSystem( world ),
			oimo: new OimoPluginSystem( world ),
			particles: new ParticleSystem( world ),
			propulsion: new PropulsionSystem( world ),
			powerSupply: new PowerSupplySystem( world ),
			portal: new PortalSystem( world ),
			projectile: new ProjectileSystem( world ),
			rest: new RESTSystem( world ),
			signal: new SignalSystem( world ),
			screenshot: new ScreenshotSystem( world ),
			socialMedia: new SocialMediaSystem( world ),
			speech: new SpeechSystem( world ),
			staticCollisions: new StaticCollisions( world ),
			switch: new SwitchSystem( world ),
			terrain: new TerrainSystem( world ),
			text: new TextSystem( world ),
			time: new TimeSystem( world ),
			toolUI: new ToolUISystem( world ),
			tool: new ToolSystem( world ),
			user: new UserSystem( world ),
			vehicle: new VehicleSystem( world ),
			video: new VideoSystem( world ),
			wall: new WallSystem( world ),
			webrtc: new WebRTCSystem( world ),
		}

        this.systems = systems
        Object.keys( systems ).map( system => {
            this[ system ] = systems[ system ]
        })

		this.deffered = {
			hand: true, light: true, particles: true, text: true, audio: true, video: true, metaFactory: true, miniature: true,
			tool: true, toolUI: true, layout: true, datgui: true
		}

    }

    registerComponent ( component ) {

        let componentsByProp = component.entity.componentsByProp,
			entity = component.entity,
			stateByProp = entity.stateByProp,
            props = component.props,
            state = component.state,
            deferredSystems = [],
            mesh = null

        Object.keys( props ).map( prop => {

            if ( this[ prop ] != null ) {

                if ( !!this.deffered[ prop ] ) { /* add other systems here */
                    
					deferredSystems.push( prop )

                } else {

                    state[ prop ] = this[ prop ].init( component )

                }

				if ( !!!componentsByProp[ prop ] ) {

                    componentsByProp[ prop ] = []

                }

				componentsByProp[ prop ].push( component )

            }

        })
    
        mesh = new THREE.Mesh( state.geometry.geometry, state.material.material )
        mesh.matrixAutoUpdate = false
        component.mesh = mesh

        deferredSystems.map( prop => {

            state[ prop ] = this[ prop ].init( component )

        })

        return mesh
    }

	tick ( delta, time ) {

		this.particles.tick( delta, time )
		this.terrain.tick( delta, time )
		this.oimo.tick( delta, time )

	}
	
}


