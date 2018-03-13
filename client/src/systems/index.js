import AbilitySystem from './game/ability'
import ActivateSystem from './core/activate'
import AudioSystem from './audio/audio'
import AssetSystem from './core/assets'
import BrowserSystem from './ui/browser'
import CameraSystem from './video/camera'
import ConditionSystem from './logic/condition'
import ContainerSystem from './ui/container'
import ConveyorSystem from './vehicle/conveyor'
import ChatSystem from './chat/chat'
import CursorSystem from './core/cursor'
import DatGUIVRPluginSystem from './ui/datguivr-plugin'
import DestructableSystem from './environment/destructable'
import DoorSystem from './environment/door'
import EmoteSystem from './chat/emote'
import FBXPluginSystem from './importers/fbx-plugin'
import FileSystem from './logic/file'
import FactionSystem from './game/faction'
import FactorySystem from './core/factory'
import FloorSystem from './environment/physics/floor'
import GeometrySystem from './core/geometry'
import GrabSystem from './core/grab'
import HoverSystem from './core/hover'
import HandSystem from './core/hand'
import HeadSystem from './core/head'
import LightSystem from './environment/light'
import LayoutSystem from './ui/layout'
import VideoSystem from './video/video'
import InputSystem from './logic/input'
import MediaSystem from './ui/media'
import GraphSystem from './ui/graph'
import DisplaySystem from './video/display'
import DrawingSystem from './video/drawing'
import ControlSystem from './vehicle/control'
import PropulsionSystem from './vehicle/propulsion'
import MetaFactorySystem from './core/factory/meta-factory'
import ParticleSystem from './environment/particle'
import PortalSystem from './environment/portal'
import ProjectileSystem from './game/projectile'
import QuestSystem from './game/quest'
import LookAwaySystem from './core/look-away'
import LoopSystem from './logic/loop'
import MagicSystem from './game/magic'
import MaterialSystem from './core/material'
import MiniatureSystem from './core/miniature'
import ObjPluginSystem from './importers/obj-plugin'
import ObjectiveSystem from './game/objective'
import OimoPluginSystem from './environment/physics/oimo-plugin'
import RESTSystem from './logic/rest'
import RPGRaceSystem from './game/rpg-race'
import ScreenshotSystem from './environment/screenshot'
import SignalSystem from './logic/signal'
import SkillSystem from './game/skill'
import SocialMediaSystem from './chat/social-media'
import SpeechSystem from './audio/speech'
import StateSystem from './logic/state'
import StatSystem from './game/stat'
import StaticCollisions  from './environment/physics/static-collisions'
import SwitchSystem from './logic/switch'
import TerrainSystem from './environment/terrain'
import TextSystem from './ui/text'
import ToolSystem from './tool/tool'
import TimeSystem from './logic/time'
import ToolUISystem from './tool/tool-ui'
import ToolboxSystem from './tool/toolbox'
import UserSystem from './core/user'
import VehicleSystem from './vehicle/vehicle'
import WallSystem from './environment/physics/wall'
import WebRTCSystem from './video/webrtc'
import WeaponSystem from './game/weapon'
import NPCSystem from './game/npc'
import VirtualDeviceSystem from './logic/virtual-device'
import VirtualMachineSystem from './logic/virtual-machine'
import SkyboxSystem from './environment/skybox'

export default class Systems {

	world: Convolvr
	liveSystems: Array<any>

	/**
	*  Initializes all systems before components can be registered
	**/
    constructor ( world: Convolvr )  {

		world.systems = this

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
			datgui: 		  new DatGUIVRPluginSystem( world ),
			destructable: 	  new DestructableSystem( world ),
			display: 		  new DisplaySystem( world ),
			virtualDevice:    new VirtualDeviceSystem( world ),
			door: 			  new DoorSystem( world ),
			drawing: 		  new DrawingSystem( world ),
			emote: 			  new EmoteSystem( world ),
			faction: 		  new FactionSystem( world ),
			factory: 		  new FactorySystem( world ),
			fbx: 			  new FBXPluginSystem( world ),
			file: 			  new FileSystem( world ),
			floor: 			  new FloorSystem( world ),
			geometry: 		  new GeometrySystem( world ),
			grab:             new GrabSystem( world ),
			graph: 		      new GraphSystem( world ),
			hand: 			  new HandSystem( world ),
			head: 			  new HeadSystem( world ),
			hover: 			  new HoverSystem( world ),
			input: 			  new InputSystem( world ),
			loop: 			  new LoopSystem( world ),
			light: 			  new LightSystem( world ),
			layout: 		  new LayoutSystem( world ),
			lookAway: 		  new LookAwaySystem( world ),
			magic: 			  new MagicSystem( world ),
			material: 		  new MaterialSystem( world ),
			media: 			  new MediaSystem( world ),
			metaFactory: 	  new MetaFactorySystem( world ),
			miniature: 		  new MiniatureSystem( world ),
			npc: 			  new NPCSystem( world ),
			obj: 			  new ObjPluginSystem( world ),
			oimo: 		   	  new OimoPluginSystem( world ),
			objective:        new ObjectiveSystem( world ),
			particles: 		  new ParticleSystem( world ),
			propulsion: 	  new PropulsionSystem( world ),
			portal: 		  new PortalSystem( world ),
			projectile: 	  new ProjectileSystem( world ),
			quest: 			  new QuestSystem( world ),
			rest: 			  new RESTSystem( world ),
			rpgRace:		  new RPGRaceSystem( world ),
			signal: 		  new SignalSystem( world ),
			skill: 			  new SkillSystem( world ),
			skybox:           new SkyboxSystem( world ),
			screenshot: 	  new ScreenshotSystem( world ),
			skybox:           new SkyboxSystem( world ),
			socialMedia: 	  new SocialMediaSystem( world ),
			speech: 		  new SpeechSystem( world ),
			state:            new StateSystem( world ),
			stat: 			  new StatSystem( world ),
			staticCollisions: new StaticCollisions( world ),
			switch: 		  new SwitchSystem( world ),
			terrain: 		  new TerrainSystem( world ),
			text: 			  new TextSystem( world ),
			time: 			  new TimeSystem( world ),
			toolUI: 		  new ToolUISystem( world ),
			tool: 			  new ToolSystem( world ),
			toolbox:          new ToolboxSystem( world ),
			user: 			  new UserSystem( world ),
			vehicle: 		  new VehicleSystem( world ),
			video: 			  new VideoSystem( world ),
			virtualMachine:   new VirtualMachineSystem( world ),
			wall: 			  new WallSystem( world ),
			webrtc: 		  new WebRTCSystem( world ),
			weapon:			  new WeaponSystem( world )
		}
		this.systems = systems
		this.liveSystems = []

		for (let s: number = 0; s < 2; s ++) {
			Object.keys( systems ).map( system => {
				if (s == 1) {
					this[ system ].allSystemsLoaded && this[ system ].allSystemsLoaded()
				} else {
					this[ system ] = systems[ system ]
					if ( this[ system ].live ) {
						this.liveSystems.push( this[ system ] )
					}
				}
			})
		}

		this.deffered = {
			hand: true, light: true, particles: true, text: true, audio: true, video: true, metaFactory: true, miniature: true,
			tool: true, toolUI: true, layout: true, datgui: true, obj: true, fbx: true
		}
    }

	/**
	*  Reads component attrs, registers with systems and populates state with the resulting data
	**/
    registerComponent ( component: Component) {

        let componentsByAttr = component.entity.componentsByAttr,
			entity = component.entity,
			stateByProp = entity.stateByProp,
            attrs = component.attrs,
            state = component.state,
            deferredSystems = [],
            mesh = null

        Object.keys( attrs ).map( attr => {

            if ( this[ attr ] != null ) {
				
				// if ( attr == "material" ) {
				// 	if (!attrs.assets) {

				// 		let assets = state[ attr ].assets;
				// 		// roughnessMap
				// 		// map
				// 		// metalnessMap
				// 		// bumpMap
				// 		// alphaMap
				// 		// specularMap
				// 	}
				// }

				if ( !!this.deffered[ attr ] ) { /* add other systems here */
					deferredSystems.push( attr )
                } else {
                    state[ attr ] = this[ attr ].init( component )
				}
				
				if ( !!!componentsByAttr[ attr ] ) {
                    componentsByAttr[ attr ] = []
				}
				
				componentsByAttr[ attr ].push( component )
            }
        })
    
		mesh = new THREE.Mesh( state.geometry.geometry, state.material.material )
		state.geometry = Object.assign( {}, state.geometry, { geometry: null } )
		state.material = Object.assign( {}, state.material, { material: null } )
        mesh.matrixAutoUpdate = false
        component.mesh = mesh

        deferredSystems.map( attr => {
            state[ attr ] = this[ attr ].init( component )
        })

        return mesh
    }

	/**
	*  Fires once per frame, passing the delta and total time passed
	**/
	tick ( delta: number, time: number ) {
		
		let systems = this.liveSystems,
			ln = systems.length,
			l = 0
		// refactor this to check time after each system/tick to avoid dropping render frames
		if ( ln == 0 ) {
			return
		}

		while ( l < ln ) {
			systems[ l ].tick( delta, time )
			l += 1
		}
		// this.particles.tick( delta, time )
		// this.terrain.tick( delta, time )
		// this.fbx.tick( delta, time )
	}
}


