import ActivateSystem from './activate'
import AudioSystem from './audio'
import AssetSystem from './assets'
import BrowserSystem from './browser'
import CameraSystem from './camera'
import CPUSystem from './cpu'
import ConditionSystem from './condition'
import ContainerSystem from './container'
import ConveyorSystem from './conveyor'
import ChatSystem from './chat'
import CursorSystem from './cursor'
import DatGUIVRPluginSystem from './datguivr-plugin'
import DestructableSystem from './destructable'
import DoorSystem from './door'
import EmoteSystem from './emote'
import FBXPluginSystem from './fbx-plugin'
import FileSystem from './file'
import FactorySystem from './factory'
import FloorSystem from './floor'
import GeometrySystem from './geometry'
import HoverSystem from './hover'
import HandSystem from './hand'
import LightSystem from './light'
import LayoutSystem from './layout'
import VideoSystem from './video'
import InputSystem from './input'
import MediaSystem from './media'
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
import MetaFactorySystem from './meta-factory'
import ParticleSystem from './particle'
import PortalSystem from './portal'
import ProjectileSystem from './projectile'
import LookAwaySystem from './look-away'
import LoopSystem from './loop'
import MaterialSystem from './material'
import MiniatureSystem from './miniature'
import ObjPluginSystem from './obj-plugin'
import OimoPluginSystem from './oimo-plugin'
import RESTSystem from './rest'
import ScreenshotSystem from './screenshot'
import SignalSystem from './signal'
import SocialMediaSystem from './social-media'
import SpeechSystem from './speech'
import StaticCollisions  from './static-collisions'
import SwitchSystem from './switch'
import TerrainSystem from './terrain'
import TextSystem from './text'
import ToolSystem from './tool'
import TimeSystem from './time'
import ToolUISystem from './tool-ui'
import UserSystem from './user'
import VehicleSystem from './vehicle'
import WallSystem from './wall'
import WebRTCSystem from './webrtc'
import NPCSystem from './npc'

export default class Systems {

	/**
	*  Initializes all systems before components can be registered
	*  @param {Convolvr} world 
	**/
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
			conveyor: new ConveyorSystem( world ),
			cursor: new CursorSystem( world ),
			cpu: new CPUSystem( world ),
			datgui: new DatGUIVRPluginSystem( world ),
			destructable: new DestructableSystem( world ),
			display: new DisplaySystem( world ),
			displayAdapter: new DisplayAdapterSystem( world ),
			door: new DoorSystem( world ),
			drawing: new DrawingSystem( world ),
			driveController: new DriveControllerSystem( world ),
			emote: new EmoteSystem( world ),
			factory: new FactorySystem( world ),
			fbx: new FBXPluginSystem( world ),
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
			obj: new ObjPluginSystem( world ),
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
			tool: true, toolUI: true, layout: true, datgui: true, obj: true, fbx: true
		}

    }

	/**
	*  Reads component props, registers with systems and populates state with the resulting data
	*  @param {Component} component 
	**/
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
		this.fbx.tick( delta, time )

	}
	
}


