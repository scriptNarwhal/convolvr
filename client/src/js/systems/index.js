import AbilitySystem from './game/ability'
import ActivateSystem from './core/activate'
import AudioSystem from './audio/audio'
import AssetSystem from './core/assets'
import BrowserSystem from './information/browser'
import CameraSystem from './video/camera'
import CPUSystem from './information/cpu'
import ConditionSystem from './information/condition'
import ContainerSystem from './ui/container'
import ConveyorSystem from './vehicle/conveyor'
import ChatSystem from './chat/chat'
import CursorSystem from './core/cursor'
import DatGUIVRPluginSystem from './ui/datguivr-plugin'
import DestructableSystem from './environment/destructable'
import DoorSystem from './environment/door'
import EmoteSystem from './chat/emote'
import FBXPluginSystem from './importers/fbx-plugin'
import FileSystem from './information/file'
import FactionSystem from './game/faction'
import FactorySystem from './core/factory'
import FloorSystem from './environment/floor'
import GeometrySystem from './core/geometry'
import HoverSystem from './core/hover'
import HandSystem from './core/hand'
import LightSystem from './environment/light'
import LayoutSystem from './ui/layout'
import VideoSystem from './video/video'
import InputSystem from './information/input'
import MediaSystem from './information/media'
import DisplayAdapterSystem from './information/display-adapter'
import GraphSystem from './ui/graph'
import MemorySystem from './information/memory'
import IOControllerSystem from './information/io-controller'
import NetworkInterfaceSystem from './information/network-interface'
import DriveControllerSystem from './information/drive-controller'
import DisplaySystem from './video/display'
import DrawingSystem from './video/drawing'
import ControlSystem from './vehicle/control'
import PropulsionSystem from './vehicle/propulsion'
import PowerSupplySystem from './information/power-supply'
import MetaFactorySystem from './core/meta-factory'
import ParticleSystem from './environment/particle'
import PortalSystem from './environment/portal'
import ProjectileSystem from './environment/projectile'
import QuestSystem from './game/quest'
import LookAwaySystem from './core/look-away'
import LoopSystem from './information/loop'
import MagicSystem from './game/magic'
import MaterialSystem from './core/material'
import MiniatureSystem from './core/miniature'
import ObjPluginSystem from './importers/obj-plugin'
import OimoPluginSystem from './environment/oimo-plugin'
import RESTSystem from './information/rest'
import ScreenshotSystem from './environment/screenshot'
import SignalSystem from './information/signal'
import SkillSystem from './game/skill'
import SocialMediaSystem from './chat/social-media'
import SpeechSystem from './audio/speech'
import StatSystem from './game/stat'
import StaticCollisions  from './core/static-collisions'
import SwitchSystem from './information/switch'
import TerrainSystem from './environment/terrain'
import TextSystem from './information/text'
import ToolSystem from './core/tool'
import TimeSystem from './information/time'
import ToolUISystem from './core/tool-ui'
import UserSystem from './core/user'
import VehicleSystem from './vehicle/vehicle'
import WallSystem from './environment/wall'
import WebRTCSystem from './video/webrtc'
import NPCSystem from './game/npc'

export default class Systems {

	/**
	*  Initializes all systems before components can be registered
	*  @param {Convolvr} world 
	**/
    constructor ( world )  {

        let systems = {
			ability: 		  new AbilitySystem( world ),
			activate: 		  new ActivateSystem( world ),
			audio: 			  new AudioSystem( world ),
			assets: 		  new AssetSystem( world ),
			browser: 		  new BrowserSystem( world ),
			camera: 		  new CameraSystem( world ),
			chat: 			  new ChatSystem( world ),
			container: 		  new ContainerSystem( world ),
			condition: 		  new ConditionSystem( world ),
			control: 		  new ControlSystem( world ),
			conveyor: 		  new ConveyorSystem( world ),
			cursor: 		  new CursorSystem( world ),
			cpu: 			  new CPUSystem( world ),
			datgui: 		  new DatGUIVRPluginSystem( world ),
			destructable: 	  new DestructableSystem( world ),
			display: 		  new DisplaySystem( world ),
			displayAdapter:   new DisplayAdapterSystem( world ),
			door: 			  new DoorSystem( world ),
			drawing: 		  new DrawingSystem( world ),
			driveController:  new DriveControllerSystem( world ),
			emote: 			  new EmoteSystem( world ),
			faction: 		  new FactionSystem( world ),
			factory: 		  new FactorySystem( world ),
			fbx: 			  new FBXPluginSystem( world ),
			file: 			  new FileSystem( world ),
			floor: 			  new FloorSystem( world ),
			geometry: 		  new GeometrySystem( world ),
			graph: 		      new GraphSystem( world ),
			hand: 			  new HandSystem( world ),
			hover: 			  new HoverSystem( world ),
			ioController: 	  new IOControllerSystem( world ),
			input: 			  new InputSystem( world ),
			loop: 			  new LoopSystem( world ),
			light: 			  new LightSystem( world ),
			layout: 		  new LayoutSystem( world ),
			lookAway: 		  new LookAwaySystem( world ),
			magic: 			  new MagicSystem( world ),
			material: 		  new MaterialSystem( world ),
			memory: 		  new MemorySystem( world ),
			media: 			  new MediaSystem( world ),
			metaFactory: 	  new MetaFactorySystem( world ),
			miniature: 		  new MiniatureSystem( world ),
			networkInterface: new NetworkInterfaceSystem( world ),
			npc: 			  new NPCSystem( world ),
			obj: 			  new ObjPluginSystem( world ),
			oimo: 		   	  new OimoPluginSystem( world ),
			particles: 		  new ParticleSystem( world ),
			propulsion: 	  new PropulsionSystem( world ),
			powerSupply: 	  new PowerSupplySystem( world ),
			portal: 		  new PortalSystem( world ),
			projectile: 	  new ProjectileSystem( world ),
			quest: 			  new QuestSystem( world ),
			rest: 			  new RESTSystem( world ),
			signal: 		  new SignalSystem( world ),
			skill: 			  new SkillSystem( world ),
			screenshot: 	  new ScreenshotSystem( world ),
			socialMedia: 	  new SocialMediaSystem( world ),
			speech: 		  new SpeechSystem( world ),
			stat: 			  new StatSystem( world ),
			staticCollisions: new StaticCollisions( world ),
			switch: 		  new SwitchSystem( world ),
			terrain: 		  new TerrainSystem( world ),
			text: 			  new TextSystem( world ),
			time: 			  new TimeSystem( world ),
			toolUI: 		  new ToolUISystem( world ),
			tool: 			  new ToolSystem( world ),
			user: 			  new UserSystem( world ),
			vehicle: 		  new VehicleSystem( world ),
			video: 			  new VideoSystem( world ),
			wall: 			  new WallSystem( world ),
			webrtc: 		  new WebRTCSystem( world ),
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
		state.geometry = Object.assign( {}, state.geometry, { geometry: null } )
		state.material = Object.assign( {}, state.material, { material: null } )
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


