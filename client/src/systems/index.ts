import AbilitySystem from './game/ability'
import ActivateSystem from './core/activate'
import AudioSystem from './audio/audio'
import AssetSystem from './core/assets'
import BrowserSystem from './ui/browser'
import CameraSystem from './video/camera'
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
import MagicSystem from './game/magic'
import MaterialSystem from './core/material'
import MiniatureSystem from './core/miniature'
import ObjPluginSystem from './importers/obj-plugin'
import ObjectiveSystem from './game/objective'
import OimoPluginSystem from './environment/physics/oimo-plugin'
import RESTSystem from './logic/rest'
import RPGRaceSystem from './game/rpg-race';
import ScriptSystem from './logic/script';
import ScreenshotSystem from './environment/screenshot'
import SignalSystem from './logic/signal'
import SkillSystem from './game/skill'
import SocialMediaSystem from './chat/social-media'
import SeatSystem from './vehicle/seat'
import SpeechSystem from './audio/speech'
import StateSystem from './logic/state'
import StatSystem from './game/stat'
import StaticCollisions  from './environment/physics/static-collisions'
import SpaceSystem from './environment/space'
import TextSystem from './ui/text'
import ToolSystem from './tool/tool'
import TimeSystem from './logic/time'
import TemplateSystem from './core/factory/template'
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

import Convolvr from '../world/world'
import Component from '../core/component';
import Binding from '../core/binding';

type AttributeName = "ability" | "activate" | "audio" | "assets" | "browser" | "camera" | "chat" | "control" |
					 "conveyor" | "cursor" | "datgui" | "destructable" | "display" | "virtualDevice" | "door" | "drawing" | 
					 "emote" | "faction" | "factory" | "fbx" | "file" | "floor" | "geometry" | "grab" | "graph" | "hand" | 
					 "head" | "hover" | "input" | "light" | "layout" | "lookAway" | "magic" | "material" | "media" | 
					 "metaFactory" | "miniature" | "npc" | "obj" | "oimo" | "objective" | "particles" | "propulsion" | "portal" |
					 "projectile" | "quest" | "rest" | "rpgRace" | "signal" | "seat" | "skill" | "skybox" | "script" | "screenshot" | "socialMedia" | 
					 "speech" | "state" | "stat" | "staticCollisions" | "terrain" | "text" | "time" | "toolUI" | "tool" |
					 "toolbox" | "user" | "vehicle" | "video" | "virtualMachine" | "template" | "wall" | "webrtc" | "weapon";

import * as THREE from 'three';
export default class Systems {

	public world: Convolvr
	public liveSystems: Array<any>
	public systems: any
	public deferred: any

	public ability: 		 AbilitySystem;
	public activate: 		 ActivateSystem;
	public audio: 			 AudioSystem;
	public assets: 		  	 AssetSystem;
	public browser: 		 BrowserSystem;
	public camera: 		  	 CameraSystem;
	public chat: 			 ChatSystem;
	public control: 		 ControlSystem;
	public conveyor: 		 ConveyorSystem;
	public cursor: 		  	 CursorSystem;
	public datgui: 		  	 DatGUIVRPluginSystem;
	public destructable: 	 DestructableSystem;
	public display: 		 DisplaySystem;
	public virtualDevice: 	 VirtualDeviceSystem;
	public door: 			 DoorSystem;
	public drawing: 		 DrawingSystem;
	public emote: 			 EmoteSystem;
	public faction: 		 FactionSystem;
	public factory: 		 FactorySystem;
	public fbx: 			 FBXPluginSystem;
	public file: 			 FileSystem;
	public floor: 			 FloorSystem;
	public geometry: 		 GeometrySystem;
	public grab: 			 GrabSystem;
	public graph: 			 GraphSystem;
	public hand: 			 HandSystem;
	public head: 			 HeadSystem;
	public hover: 			 HoverSystem;
	public input: 			 InputSystem;
	public light: 			 LightSystem;
	public layout: 		  	 LayoutSystem;
	public lookAway: 		 LookAwaySystem;
	public magic: 			 MagicSystem;
	public material: 		 MaterialSystem;
	public media: 			 MediaSystem;
	public metaFactory: 	 MetaFactorySystem;
	public miniature: 		 MiniatureSystem;
	public npc: 			 NPCSystem;
	public obj: 			 ObjPluginSystem;
	public oimo: 			 OimoPluginSystem;
	public objective: 		 ObjectiveSystem;
	public particles: 		 ParticleSystem;
	public propulsion: 	  	 PropulsionSystem;
	public portal: 		  	 PortalSystem;
	public projectile: 	  	 ProjectileSystem;
	public quest: 			 QuestSystem;
	public rest: 			 RESTSystem;
	public rpgRace: 		 RPGRaceSystem;
	public signal: 		  	 SignalSystem;
	public skill: 			 SkillSystem;
	public skybox: 		  	 SkyboxSystem;
	public script:           ScriptSystem;
	public screenshot: 	  	 ScreenshotSystem;
	public socialMedia: 	 SocialMediaSystem;
	public seat:             SeatSystem;
	public speech: 		  	 SpeechSystem;
	public state: 			 StateSystem;
	public stat: 			 StatSystem;
	public staticCollisions: StaticCollisions;
	public terrain: 		 SpaceSystem;
	public text: 			 TextSystem;
	public template: 	     TemplateSystem;
	public time: 			 TimeSystem;
	public toolUI: 		  	 ToolUISystem;
	public tool: 			 ToolSystem;
	public toolbox: 		 ToolboxSystem;
	public user: 			 UserSystem;
	public vehicle: 		 VehicleSystem;
	public video: 			 VideoSystem;
	public virtualMachine:   VirtualMachineSystem;
	public wall: 			 WallSystem;
	public webrtc: 		  	 WebRTCSystem;
	public weapon: 		  	 WeaponSystem;

	/**
			*  Initializes all systems before components can be registered
	**/
    constructor ( world: Convolvr )  {

		world.systems = this

        let systems = {
			ability: 		   new AbilitySystem( world ),
			activate: 		   new ActivateSystem( world ),
			audio: 			   new AudioSystem( world ),
			assets: 		   new AssetSystem( world ),
			browser: 		   new BrowserSystem( world ),
			camera: 		   new CameraSystem( world ),
			chat: 			   new ChatSystem( world ),
			control: 		   new ControlSystem( world ),
			conveyor: 		   new ConveyorSystem( world ),
			cursor: 		   new CursorSystem( world ),
			datgui: 		   new DatGUIVRPluginSystem( world ),
			destructable: 	   new DestructableSystem( world ),
			display: 		   new DisplaySystem( world ),
			virtualDevice:     new VirtualDeviceSystem( world ),
			door: 			   new DoorSystem( world ),
			drawing: 		   new DrawingSystem( world ),
			emote: 			   new EmoteSystem( world ),
			faction: 		   new FactionSystem( world ),
			factory: 		   new FactorySystem( world ),
			fbx: 			   new FBXPluginSystem( world ),
			file: 			   new FileSystem( world ),
			floor: 			   new FloorSystem( world ),
			geometry: 		   new GeometrySystem( world ),
			grab:              new GrabSystem( world ),
			graph: 		       new GraphSystem( world ),
			hand: 			   new HandSystem( world ),
			head: 			   new HeadSystem( world ),
			hover: 			   new HoverSystem( world ),
			input: 			   new InputSystem( world ),
			light: 			   new LightSystem( world ),
			layout: 		   new LayoutSystem( world ),
			lookAway: 		   new LookAwaySystem( world ),
			magic: 			   new MagicSystem( world ),
			material: 		   new MaterialSystem( world ),
			media: 			   new MediaSystem( world ),
			metaFactory: 	   new MetaFactorySystem( world ),
			miniature: 		   new MiniatureSystem( world ),
			npc: 			   new NPCSystem( world ),
			obj: 			   new ObjPluginSystem( world ),
			oimo: 		   	   new OimoPluginSystem( world ),
			objective:         new ObjectiveSystem( world ),
			particles: 		   new ParticleSystem( world ),
			propulsion: 	   new PropulsionSystem( world ),
			portal: 		   new PortalSystem( world ),
			projectile: 	   new ProjectileSystem( world ),
			quest: 			   new QuestSystem( world ),
			rest: 			   new RESTSystem( world ),
			rpgRace:		   new RPGRaceSystem( world ),
			signal: 		   new SignalSystem( world ),
			skill: 			   new SkillSystem( world ),
			skybox:            new SkyboxSystem( world ),
			script:            new ScriptSystem( world ),
			screenshot: 	   new ScreenshotSystem( world ),
			seat:              new SeatSystem( world ),
			socialMedia: 	   new SocialMediaSystem( world ),
			speech: 		   new SpeechSystem( world ),
			state:             new StateSystem( world ),
			stat: 			   new StatSystem( world ),
			staticCollisions:  new StaticCollisions( world ),
			terrain: 		   new SpaceSystem( world ),
			text: 			   new TextSystem( world ),
			template: 		   new TemplateSystem( world ),
			time: 			   new TimeSystem( world ),
			toolUI: 		   new ToolUISystem( world ),
			tool: 			   new ToolSystem( world ),
			toolbox:           new ToolboxSystem( world ),
			user: 			   new UserSystem( world ),
			vehicle: 		   new VehicleSystem( world ),
			video: 			   new VideoSystem( world ),
			virtualMachine:    new VirtualMachineSystem( world ),
			wall: 			   new WallSystem( world ),
			webrtc: 		   new WebRTCSystem( world ),
			weapon:			   new WeaponSystem( world ),
		}
		this.systems = systems
		this.liveSystems = []
		let systemIndex = (this as any);

		for (let s: number = 0; s < 2; s ++) {
			Object.keys( systems ).map( system => {
				if (s == 1) {
					systemIndex[ system ].allSystemsLoaded && systemIndex[ system ].allSystemsLoaded()
				} else {
					systemIndex[ system ] = (systems as any)[ system ]
					if ( systemIndex[ system ].live ) {
						systemIndex.liveSystems.push( systemIndex[ system ] )
					}
				}
			})
		}

		this.deferred = {
			hand: true, light: true, particles: true, text: true, audio: true, video: true, metaFactory: true, miniature: true,
			tool: true, toolUI: true, layout: true, datgui: true, obj: true, fbx: true
		}
    }

	/**
	*  Reads component attrs, registers with systems and populates state with the resulting data
	**/
    registerComponent(component: Component) {
        let componentsByAttr = component.entity.componentsByAttr,
			entity = component.entity,
			stateByProp = entity.stateByProp,
            attrs = component.attrs,
            state = component.state,
            deferredSystems: any[] = [],
			mesh = null;
			

        Object.keys( attrs ).map( (attr: AttributeName) => {
            if ( this[ attr ] != null ) {

				if ( !!this.deferred[ attr ] ) { /* add other systems here */
					deferredSystems.push( attr );
                } else {
                    state[ attr ] = (this[ attr ] as any).init( component )
				}
				
				if ( !!!componentsByAttr[ attr ] ) {
                    componentsByAttr[ attr ] = []
				}
				
				componentsByAttr[ attr ].push( component )
            }
        });

		mesh = new THREE.Mesh( state.geometry.geometry, state.material.material )
		if (component.props) {
			this.evaluateProperties(component, component.props);
		}
		state.geometry = Object.assign( {}, state.geometry, { geometry: null } )
		state.material = Object.assign( {}, state.material, { material: null } )
        mesh.matrixAutoUpdate = false
        component.mesh = mesh

        deferredSystems.map( (attr: AttributeName) => {
            state[ attr ] = (this[ attr ] as any).init( component )
        })

        return mesh
	}
	
	private evaluateProperties(component: Component, properties: {[key: string]: any}): void {
		let binding: Binding,
			prop

		// init binding here, resolve it to things in th
		for (let propName in properties) {
			prop = properties[propName];
			binding = new Binding(this, component, propName, prop.value, prop.type, prop.binding, prop.bindingType);
			component.bindings.push(binding);
		}
	}
	/**
	*  Fires once per frame, passing the delta and total time passed
	**/
	public tick(delta: number, time: number) {
		let systems = this.liveSystems,
			ln = systems.length,
			l = 0;
		// refactor this to check time after each system/tick to avoid dropping render frames
		if ( delta > 250 || ln == 0 ) {
			return
		}

		while ( l < ln ) {
			systems[ l ].tick( delta, time )
			l += 1
		}
	}
}


