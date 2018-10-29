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
import ImportDataSystem from './importers/data'
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
import { AttributeName } from '../core/attribute'


/** System Dependency
 * [injectAsThisDotFoo, systemBar.optionallySubSystemBaz][] **/
export type SystemDependency = string[];

export interface System {
	init: (component: Component) => AnyObject
	postInject?: () => void,
	tick?: (delta: number, time: number) => void
	dependencies?: SystemDependency[]
	world: Convolvr
}

import * as THREE from 'three';
import { AnyObject } from '../util';
import { Mesh } from 'three';
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
	public importData:       ImportDataSystem;
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
			ability: 		   new AbilitySystem( world ), // TODO: plan out more
			activate: 		   new ActivateSystem( world ),
			audio: 			   new AudioSystem( world ),
			assets: 		   new AssetSystem( world ),
			browser: 		   new BrowserSystem( world ), // TODO: finish
			camera: 		   new CameraSystem( world ), // TODO: finish
			chat: 			   new ChatSystem( world ),
			control: 		   new ControlSystem( world ),
			conveyor: 		   new ConveyorSystem( world ), // TODO: finish
			cursor: 		   new CursorSystem( world ),
			datgui: 		   new DatGUIVRPluginSystem( world ),
			destructable: 	   new DestructableSystem( world ),
			display: 		   new DisplaySystem( world ),
			door: 			   new DoorSystem( world ),
			drawing: 		   new DrawingSystem( world ),
			emote: 			   new EmoteSystem( world ), // TODO: plan out more
			faction: 		   new FactionSystem( world ), // TODO: plan out more
			factory: 		   new FactorySystem( world ),
			fbx: 			   new FBXPluginSystem( world ),
			file: 			   new FileSystem( world ),
			floor: 			   new FloorSystem( world ),
			geometry: 		   new GeometrySystem( world ),
			grab:              new GrabSystem( world ),
			graph: 		       new GraphSystem( world ), // TODO: implement
			hand: 			   new HandSystem( world ),
			head: 			   new HeadSystem( world ),
			hover: 			   new HoverSystem( world ), // TODO: implement
			importData:        new ImportDataSystem( world ), //TODO: implement
			input: 			   new InputSystem( world ),
			light: 			   new LightSystem( world ),
			layout: 		   new LayoutSystem( world ),
			lookAway: 		   new LookAwaySystem( world ), // TODO: implement
			magic: 			   new MagicSystem( world ), //TODO: implement 
			material: 		   new MaterialSystem( world ),
			media: 			   new MediaSystem( world ), // TODO: how is this used?
			metaFactory: 	   new MetaFactorySystem( world ),
			miniature: 		   new MiniatureSystem( world ),
			npc: 			   new NPCSystem( world ),
			obj: 			   new ObjPluginSystem( world ),
			oimo: 		   	   new OimoPluginSystem( world ),// TODO: plan out more
			objective:         new ObjectiveSystem( world ), // TODO: plan out more
			particles: 		   new ParticleSystem( world ),
			propulsion: 	   new PropulsionSystem( world ), // TODO: test
			portal: 		   new PortalSystem( world ), //TODO: Fix
			projectile: 	   new ProjectileSystem( world ),
			quest: 			   new QuestSystem( world ), // TODO: implement
			rest: 			   new RESTSystem( world ),
			rpgRace:		   new RPGRaceSystem( world ), // TODO: implement
			signal: 		   new SignalSystem( world ),
			skill: 			   new SkillSystem( world ), // TODO: think about this more
			skybox:            new SkyboxSystem( world ),
			script:            new ScriptSystem( world, new Worker('/data/js/workers/ecs-bundle.js')),
			screenshot: 	   new ScreenshotSystem( world ), // TODO: finish
			seat:              new SeatSystem( world ), // TODO: finish
			socialMedia: 	   new SocialMediaSystem( world ), // TODO: finish
			speech: 		   new SpeechSystem( world ),
			state:             new StateSystem( world ), //TODO: how is this used?
			stat: 			   new StatSystem( world ), // TODO: think about this more
			staticCollisions:  new StaticCollisions( world, new Worker('/data/js/workers/static-collisions-bundle.js')),
			terrain: 		   new SpaceSystem( world ),
			text: 			   new TextSystem( world ),
			template: 		   new TemplateSystem( world ), //TODO: finish
			time: 			   new TimeSystem( world ),
			toolUI: 		   new ToolUISystem( world ),
			tool: 			   new ToolSystem( world ),
			toolbox:           new ToolboxSystem( world ),
			user: 			   new UserSystem( world ), //TODO: assess what needs to be done
			vehicle: 		   new VehicleSystem( world ), // TODO: finish .. plan out more
			video: 			   new VideoSystem( world ), //TODO: finish
			virtualDevice:     new VirtualDeviceSystem( world ), //TODO: finish
			virtualMachine:    new VirtualMachineSystem( world ), //TODO: finish / plan out more
			wall: 			   new WallSystem( world ), //TODO: finish
			webrtc: 		   new WebRTCSystem( world ), //TODO: test
			weapon:			   new WeaponSystem( world ), //TODO: finish
		}
		this.systems = systems
		this.liveSystems = []
		let systemIndex = (this as any);
		const systemNames = Object.keys( systems );

		for (let s = 0; s < 2; s ++) {
			for (const system of systemNames) {
				if (s == 0) { // first pass
					systemIndex[ system ] = (systems as any)[ system ]
					if ( typeof systemIndex[ system ].tick == "function") {
						systemIndex.liveSystems.push( systemIndex[ system ] )
					}
				} else { 
					this.injectDependencies(systemIndex[system]);
				}
			}
		}

		this.deferred = {
			hand: true, light: true, particles: true, text: true, audio: true, video: true, metaFactory: true, miniature: true,
			tool: true, toolUI: true, layout: true, datgui: true, obj: true, fbx: true
		}
    }

	/**
	*  Reads component attrs, registers with systems and populates state with the resulting data
	**/
    registerComponent(component: Component): Mesh {
        let componentsByAttr = component.entity.componentsByAttr,
			attrs = component.attrs,
			attrKeys = Object.keys( attrs ) as AttributeName[],
            state = component.state,
            deferredSystems: any[] = [],
			mesh = null;
		
		let attr: AttributeName;

        for (attr of attrKeys) {
            if ((this as any)[ attr ] != null) {

				if ( !!this.deferred[ attr ] ) { /* add other systems here */
					deferredSystems.push( attr );
                } else {
                    state[ attr ] = (this[ attr ] as System).init( component )
				}
				
				if ( !!!componentsByAttr[ attr ] ) {
                    componentsByAttr[ attr ] = []
				}
				componentsByAttr[ attr ].push( component )
            }
        }

		mesh = new THREE.Mesh( state.geometry.geometry, state.material.material )
		if (component.props) {
			this.evaluateProperties(component, component.props);
		}
		state.geometry = Object.assign( {}, state.geometry, { geometry: null } )
		state.material = Object.assign( {}, state.material, { material: null } )
        mesh.matrixAutoUpdate = false
        component.mesh = mesh

        for (const attr of deferredSystems) {
            state[ attr ] = ((this as any )[ attr ] as any).init( component )
        }

        return mesh;
	}

	injectSubSystemDependencies(subSystems: { [key: string]: System }): void {
		for (const system in subSystems) {
			this.injectDependencies(subSystems[system]);
		}
	}

	private injectDependencies(system: System) {
		if (!system.dependencies) {
			system.postInject && system.postInject.call(system);
			return;
		}
		const deps = system.dependencies as SystemDependency[];
	
		for (const dep of deps) {
			if (dep.length === 1) {
				(system as any)[dep[0]] = (system.world.systems as any)[dep[0]];
			} else {
				const path = dep[1].split("."),
					length = path.length;

				if (length == 1) {
					(system as any)[dep[0]] = (system.world.systems as any)[dep[1]];
				} else {
					(system as any)[dep[0]] = (system.world.systems as any)[path[0]][path[1]];
				}
			}
		}
		system.postInject && system.postInject.call(system);
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
	public tick(delta: number, time: number): void {
		let systems = this.liveSystems,
			ln = systems.length;
		// refactor this to check time after each system/tick to avoid dropping render frames
		if ( delta > 250 || ln < 1 ) {
			return
		}

		while ( ln -- ) {
			systems[ ln ].tick( delta, time );
		}
	}
}


