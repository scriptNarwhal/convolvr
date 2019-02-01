import AbilitySystem from "./game/ability";
import ActivateSystem from "./input/activate";
import AudioSystem from "./audio/audio";
import AssetSystem from "./core/assets";
import BrowserSystem from "./ui/browser";
import CameraSystem from "./video/camera";
import ConveyorSystem from "./vehicle/conveyor";
import ChatSystem from "./chat/chat";
import CursorSystem from "./core/cursor";
import DatGUIVRPluginSystem from "./ui/datguivr-plugin";
import DestructableSystem from "./environment/destructable";
import DoorSystem from "./environment/door";
import EmoteSystem from "./chat/emote";
import FBXPluginSystem from "./importers/fbx-plugin";
import FileSystem from "./logic/file";
import FactionSystem from "./game/faction";
import FactorySystem from "./core/factory";
import FloorSystem from "./environment/physics/floor";
import GeometrySystem from "./core/geometry";
import GrabSystem from "./input/grab";
import HoverSystem from "./input/hover";
import HandSystem from "./core/hand";
import HeadSystem from "./core/head";
import ImportDataSystem from "./importers/data";
import LightSystem from "./environment/light";
import LayoutSystem from "./ui/layout";
import VideoSystem from "./video/video";
import InputSystem from "./logic/input";
import MediaSystem from "./ui/media";
import GraphSystem from "./ui/graph";
import DisplaySystem from "./video/display";
import DrawingSystem from "./video/drawing";
import ControlSystem from "./vehicle/control";
import PipelineSystem from "./core/pipeline";
import PropulsionSystem from "./vehicle/propulsion";
import FactoryProviderSystem from "./core/factory/factory-provider";
import ParticleSystem from "./environment/particle";
import PortalSystem from "./environment/portal";
import ProjectileSystem from "./game/projectile";
import QuestSystem from "./game/quest";
import LookAwaySystem from "./input/look-away";
import MagicSystem from "./game/magic";
import MaterialSystem from "./core/material";
import MiniatureSystem from "./core/miniature";
import ObjPluginSystem from "./importers/obj-plugin";
import ObjectiveSystem from "./game/objective";
import OimoPluginSystem from "./environment/physics/oimo-plugin";
import RESTSystem from "./logic/rest";
import RPGRaceSystem from "./game/rpg-race";
import ScriptSystem from "./logic/script";
import ScreenshotSystem from "./environment/screenshot";
import SignalSystem from "./logic/signal";
import SkillSystem from "./game/skill";
import SocialMediaSystem from "./chat/social-media";
import SeatSystem from "./vehicle/seat";
import SpeechSystem from "./audio/speech";
import StateSystem from "./logic/state";
import StatSystem from "./game/stat";
import StaticCollisions from "./environment/physics/static-collisions";
import SpaceSystem from "./environment/space";
import TextSystem from "./ui/text";
import TerrainSystem from "./environment/terrain";
import ToolSystem from "./tool/tool";
import TemplateSystem from "./core/factory/template";
import ToolUISystem from "./tool/tool-ui";
import ToolboxSystem from "./tool/toolbox";
import UserSystem from "./core/user";
import VehicleSystem from "./vehicle/vehicle";
import WallSystem from "./environment/physics/wall";
import WebRTCSystem from "./video/webrtc";
import WeaponSystem from "./game/weapon";
import NPCSystem from "./game/npc";
import VirtualDeviceSystem from "./logic/virtual-device";
import VirtualMachineSystem from "./logic/virtual-machine";
import SkyboxSystem from "./environment/skybox";

import Convolvr from "../world/world";
import Component from "../model/component";
import Binding from "../model/binding";
import { AttributeName } from "../model/attribute";

// /** System Dependency
//  * [injectAsThisDotFoo, systemBar.optionallySubSystemBaz][] 
//  * **/
export type SystemDependency = string[];

export interface SystemClient {
    dependencies: SystemDependency[]; 
    postInject?: () => void;
} 

export interface System extends SystemClient {
    init: (component: Component) => AnyObject;
    tick?: (delta: number, time: number) => void;
    world: Convolvr;
}

import * as THREE from "three";
import { AnyObject } from "../util";
import { Mesh } from "three";

export interface AllServices { 
    ability: AbilitySystem;
    activate: ActivateSystem;
    audio: AudioSystem;
    assets: AssetSystem;
    browser: BrowserSystem;
    camera: CameraSystem;
    chat: ChatSystem;
    control: ControlSystem;
    conveyor: ConveyorSystem;
    cursor: CursorSystem;
    datgui: DatGUIVRPluginSystem;
    destructable: DestructableSystem;
    display: DisplaySystem;
    virtualDevice: VirtualDeviceSystem;
    door: DoorSystem;
    drawing: DrawingSystem;
    emote: EmoteSystem;
    faction: FactionSystem;
    factory: FactorySystem;
    factoryProvider: FactoryProviderSystem;
    fbx: FBXPluginSystem;
    file: FileSystem;
    floor: FloorSystem;
    geometry: GeometrySystem;
    grab: GrabSystem;
    graph: GraphSystem;
    hand: HandSystem;
    head: HeadSystem;
    hover: HoverSystem;
    importData: ImportDataSystem;
    input: InputSystem;
    light: LightSystem;
    layout: LayoutSystem;
    lookAway: LookAwaySystem;
    magic: MagicSystem;
    material: MaterialSystem;
    media: MediaSystem;
    miniature: MiniatureSystem;
    npc: NPCSystem;
    obj: ObjPluginSystem;
    oimo: OimoPluginSystem;
    objective: ObjectiveSystem;
    particles: ParticleSystem;
    pipeline: PipelineSystem;
    propulsion: PropulsionSystem;
    portal: PortalSystem;
    projectile: ProjectileSystem;
    quest: QuestSystem;
    rest: RESTSystem;
    rpgRace: RPGRaceSystem;
    signal: SignalSystem;
    space: SpaceSystem;
    skill: SkillSystem;
    skybox: SkyboxSystem;
    script: ScriptSystem;
    screenshot: ScreenshotSystem;
    socialMedia: SocialMediaSystem;
    seat: SeatSystem;
    speech: SpeechSystem;
    state: StateSystem;
    stat: StatSystem;
    staticCollisions: StaticCollisions;
    terrain: TerrainSystem;
    text: TextSystem;
    template: TemplateSystem;
    toolUI: ToolUISystem;
    tool: ToolSystem;
    toolbox: ToolboxSystem;
    user: UserSystem;
    vehicle: VehicleSystem;
    video: VideoSystem;
    virtualMachine: VirtualMachineSystem;
    wall: WallSystem;
    webrtc: WebRTCSystem;
    weapon: WeaponSystem;
}

export default class Systems {
    public world: Convolvr;
    public liveSystems: Array<any>;
    public byName: AllServices;
    public deferred: any;

    public time = 0;

    // /**
    //  *  Initializes all systems before components can be registered
    //  **/
    constructor(world: Convolvr) {
        world.systems = this;

        let systems: AllServices = {
            ability: new AbilitySystem(world), // TODO: plan out more
            activate: new ActivateSystem(world),
            audio: new AudioSystem(world),
            assets: new AssetSystem(world),
            browser: new BrowserSystem(world), // TODO: finish
            camera: new CameraSystem(world), // TODO: finish
            chat: new ChatSystem(world),
            control: new ControlSystem(world),
            conveyor: new ConveyorSystem(world), // TODO: finish
            cursor: new CursorSystem(world),
            datgui: new DatGUIVRPluginSystem(world),
            destructable: new DestructableSystem(world),
            display: new DisplaySystem(world),
            door: new DoorSystem(world),
            drawing: new DrawingSystem(world),
            emote: new EmoteSystem(world), // TODO: plan out more
            faction: new FactionSystem(world), // TODO: plan out more
            factory: new FactorySystem(world),
            fbx: new FBXPluginSystem(world),
            file: new FileSystem(world),
            floor: new FloorSystem(world),
            geometry: new GeometrySystem(world),
            grab: new GrabSystem(world),
            graph: new GraphSystem(world), // TODO: implement
            hand: new HandSystem(world),
            head: new HeadSystem(world),
            hover: new HoverSystem(world), // TODO: implement
            importData: new ImportDataSystem(world), //TODO: implement
            input: new InputSystem(world),
            light: new LightSystem(world),
            layout: new LayoutSystem(world),
            lookAway: new LookAwaySystem(world), // TODO: implement
            magic: new MagicSystem(world), //TODO: implement
            material: new MaterialSystem(world),
            media: new MediaSystem(world), // TODO: how is this used?
            factoryProvider: new FactoryProviderSystem(world),
            miniature: new MiniatureSystem(world),
            npc: new NPCSystem(world),
            obj: new ObjPluginSystem(world),
            oimo: new OimoPluginSystem(world), // TODO: plan out more
            objective: new ObjectiveSystem(world), // TODO: plan out more
            particles: new ParticleSystem(world),
            pipeline: new PipelineSystem(world),
            propulsion: new PropulsionSystem(world), // TODO: test
            portal: new PortalSystem(world), //TODO: Fix
            projectile: new ProjectileSystem(world),
            quest: new QuestSystem(world), // TODO: implement
            rest: new RESTSystem(world),
            rpgRace: new RPGRaceSystem(world), // TODO: implement
            signal: new SignalSystem(world),
            space: new SpaceSystem(world),
            skill: new SkillSystem(world), // TODO: think about this more
            skybox: new SkyboxSystem(world),
            script: new ScriptSystem(world, new Worker("/data/js/workers/ecs-bundle.js")),
            screenshot: new ScreenshotSystem(world), // TODO: finish
            seat: new SeatSystem(world), // TODO: finish
            socialMedia: new SocialMediaSystem(world), // TODO: finish
            speech: new SpeechSystem(world),
            state: new StateSystem(world), //TODO: how is this used?
            stat: new StatSystem(world), // TODO: think about this more
            staticCollisions: new StaticCollisions(world, new Worker("/data/js/workers/static-collisions-bundle.js")),
            terrain: new TerrainSystem(world),
            text: new TextSystem(world),
            template: new TemplateSystem(world), //TODO: finish
            toolUI: new ToolUISystem(world),
            tool: new ToolSystem(world),
            toolbox: new ToolboxSystem(world),
            user: new UserSystem(world), //TODO: assess what needs to be done
            vehicle: new VehicleSystem(world), // TODO: finish .. plan out more
            video: new VideoSystem(world), //TODO: finish
            virtualDevice: new VirtualDeviceSystem(world), //TODO: finish
            virtualMachine: new VirtualMachineSystem(world), //TODO: finish / plan out more
            wall: new WallSystem(world), //TODO: finish
            webrtc: new WebRTCSystem(world), //TODO: test
            weapon: new WeaponSystem(world) //TODO: finish
        };
        this.byName = systems;
        this.liveSystems = [];
        let systemIndex = this.byName;
        const systemNames = Object.keys(systems);

        for (let s = 0; s < 2; s++) {
            for (const system of systemNames) {
                if (s == 0) {
                    // first pass
                    // systemIndex[system] = (systems as any)[system];
                    if (typeof ((systemIndex as any)[system] as System).tick == "function") {
                        this.liveSystems.push((systemIndex as any)[system]);
                    }
                } else {
                    this.injectDependencies((systemIndex as any)[system]);
                }
            }
        }

        this.deferred = {
            hand: true,
            light: true,
            particles: true,
            text: true,
            audio: true,
            video: true,
            factoryProvider: true,
            miniature: true,
            tool: true,
            toolUI: true,
            layout: true,
            datgui: true,
            obj: true,
            fbx: true
        };
    }

    /**
     *  Reads component attrs, registers with systems and populates state with the resulting data
     **/
    registerComponent = (component: Component): Mesh  => {
        let componentsByAttr = component.entity.componentsByAttr,
            attrs = component.attrs,
            attrKeys = Object.keys(attrs) as AttributeName[],
            state = component.state,
            deferredSystems: any[] = [],
            mesh = null,
            byName = this.byName;

        let attr: AttributeName;

        for (let a = attrKeys.length; a >= 0; a--) {
            const attr = attrKeys[a];

            if ((byName as any)[attr] != null) {
                if (!!this.deferred[attr]) {
                    /* add other systems here */
                    deferredSystems.push(attr);
                } else {
                    state[attr] = (byName[attr] as System).init(component);
                }

                if (!!!componentsByAttr[attr]) {
                    componentsByAttr[attr] = [];
                }
                componentsByAttr[attr].push(component);
            }
        }

        mesh = new THREE.Mesh(state.geometry.geometry, state.material.material);
        if (component.props) {
            this.evaluateProperties(component, component.props);
        }
        state.geometry = Object.assign({}, state.geometry, { geometry: null });
        state.material = Object.assign({}, state.material, { material: null });
        mesh.matrixAutoUpdate = false;
        component.mesh = mesh;

        for (const attr of deferredSystems) {
            state[attr] = ((byName as any)[attr] as any).init(component);
        }

        return mesh;
    }

    /**
     * resgisters a component only with one additional attribute / system
     *
     * @param {Component} component
     * @param {string} system
     * @param {AnyObject} data
     */
    extendComponent(component: Component, system: AttributeName, data = {}) {
        (component.attrs as any)[system ] = data;
        component.state[system] = ((this.byName as any)[system] as System).init(component);
    }

    injectSubSystemDependencies(subSystems: { [key: string]: System }): void {
        for (const system in subSystems) {
            this.injectDependencies(subSystems[system]);
        }
    }

    /**
     * 
     */
    public injectDependencies = (system: SystemClient) => {
        if (!system.dependencies) {
            system.postInject && system.postInject.call(system);
            return;
        }
        
        const deps = system.dependencies as SystemDependency[],
            systems = this.byName;

        for (let d = deps.length - 1; d >= 0; d--) {
            const dep = deps[d];

            if (dep.length === 1) {
                (system as any)[dep[0]] = (systems as any)[dep[0]];
            } else {
                const path = dep[1].split("."),
                    length = path.length;

                if (length == 1) {
                    (system as any)[dep[0]] = (systems as any)[dep[1]];
                } else {
                    (system as any)[dep[0]] = (systems as any)[path[0]][path[1]];
                }
            }
        }
        system.postInject && system.postInject.call(system);
    }

    private evaluateProperties(component: Component, properties: { [key: string]: any }): void {
        let binding: Binding, prop;

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
        if (delta > 250 || ln < 1) {
            return;
        }

        while (ln--) {
            systems[ln].tick(delta, time);
        }
    }

    public testPerformance() {
        return Date.now() - this.time < 8;
    }

    // public setIdealTime(time: number) {
    //     this.idealTime = time;
    //     this.pipeline.setIdealTime(time);
    // }
}
