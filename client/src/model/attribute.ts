import { AnyObject } from "../util";
import { VirtualDevice } from "../systems/logic/virtual-device";
import { ComponentPath } from "./component";
import { listDirectories } from "../2d-ui/redux/actions/file-actions";

export type AttributeName = "ability" | "activate" | "audio" | "assets" | "browser" | "camera" | "chat" | "control" |
					 "conveyor" | "cursor" | "datgui" | "destructable" | "display" | "virtualDevice" | "door" | "drawing" | 
					 "emote" | "faction" | "factory" | "fbx" | "file" | "floor" | "geometry" | "grab" | "graph" | "hand" | 
					 "head" | "hover" | "input" | "light" | "layout" | "lookAway" | "magic" | "material" | "media" | 
					 "factoryProvider" | "miniature" | "npc" | "obj" | "oimo" | "objective" | "particles" | "propulsion" | "portal" |
					 "projectile" | "quest" | "rest" | "rpgRace" | "signal" | "seat" | "skill" | "skybox" | "script" | "screenshot" | "socialMedia" | 
					 "speech" | "state" | "stat" | "staticCollisions" | "terrain" | "text" | "time" | "toolUI" | "tool" |
					 "toolbox" | "user" | "vehicle" | "video" | "virtualMachine" | "template" | "wall" | "webrtc" | "weapon";

export type AttributeData = number | string | boolean | any[] | AnyObject | Attribute | Attributes

export interface Attribute {
    [key: string]: AttributeData //[parameter: string]: AttributeData
}

export interface Attributes {
    ability?: ability
    activate?: activate
    audio?: audio
    assets?: assets
    browser?: browser
    camera?: camera
    chat?: chat
    control?: control
    conveyor?: conveyor
    cursor?: cursor
    datgui?: datgui
    destructable?: destructable
    display?: display
    virtualDevice?: virtualDevice
    door?: door
    drawing?: drawing
    emote?: emote
    faction?: faction
    factory?: factory
    factoryProvider?: factoryProvider
    fbx?: fbx
    file?: file
    floor?: floor
    geometry?: geometry
    grab?: grab
    graph?: graph
    hand?: hand
    head?: head
    hover?: hover
    input?: input
    light?: light
    layout?: layout
    lookAway?: lookAway
    magic?: magic
    material?: material
    media?: media
    miniature?: miniature
    noRaycast?: boolean
    npc?: npc
    obj?: obj
    oimo?: oimo
    objective?: objective
    particles?: particles
    propulsion?: propulsion
    portal?: portal
    projectile?: projectile
    quest?: quest
    rest?: rest
    rpgRace?: rpgRace
    signal?: signal
    skill?: skill
    skybox?: skybox
    script?: script
    screenshot?: screenshot
    socialMedia?: socialMedia
    seat?: seat
    speech?: speech
    state?: state
    stat?: stat
    staticCollisions?: staticCollisions
    terrain?: terrain
    text?: text
    template?: template
    time?: time
    toolUI?: toolUI
    tool?: tool
    toolbox?: toolbox
    user?: user
    vehicle?: vehicle
    video?: video
    virtualMachine?: virtualMachine
    wall?: wall
    webrtc?: webrtc
    weapon?: weapon
};


export type BrowserType = "text" | "csv" | "json" | "html" | "files" | "directories" | "images" | "audio" | "video" | "js" | "ecs" | "entities" | "components" | "attrs" | "users" | "spaces" | "places"

export type FactoryType = "entity" | "component" | "attr" | "world" | "place" | "file" | "directory";
export type FactoryAttributeType = "geometry" | "material" | "assets" | "systems";

export type GeometryShape = "box" | "node" | "plane" | "octahedron" | "sphere" | "cylinder" | "open-cylinder" | "cone" | "torus" | "hexagon" | "open-box" | "frustum" | "extrude" | "lathe";
export type ProceduralMaterialFunction = "noise" | "fillStyle" | "strokeStyle" | "beginPath" | "moveTo" | "lineTo" | "stroke" | "fillRect" | "arc" | "text" | "loop";

export type ProceduralMaterial = {
    name: string,
    procedural: {
        calls: {
            call: ProceduralMaterialFunction,
            params: number[]
        }[]
    }
};

export type VirtualDeviceType = "display" | "display-adapter" | "io-controller" | "network-interface" | "storage" | "pointing-device" | "keyboard"

export interface ability extends Attribute {}
export interface activate extends Attribute {}
export interface audio extends Attribute {
    asset?: string
    autoPlay?: boolean
    type: "stereo" | "3d"
}
export interface assets extends Attribute {}
export interface browser extends Attribute {
    type: BrowserType
}
export interface camera extends Attribute {
    fov: number,
    type: "perspective" | "orthagonal"
}
export interface chat extends Attribute {
    userName?: string
}
export interface control extends Attribute {
    type: "position" | "orientation"
}
export interface conveyor extends Attribute {}
export interface cursor extends Attribute {

}
export interface datgui extends Attribute {}
export interface destructable extends Attribute {
    hitPoints?: number,
    explosionType?: "particles" | "components" | "billboard" | "all"
}
export interface display extends Attribute {}
export interface door extends Attribute {}
export interface drawing extends Attribute {}
export interface emote extends Attribute {}
export interface faction extends Attribute {}
export interface factory extends Attribute {
    type: FactoryType,
    preset?: "",
    attrName?: FactoryAttributeType,
    data?: any,
    anchorOutput?: boolean,
    miniature?: boolean,
}
export interface factoryProvider extends Attribute {
    type: string,
    attrName?: string,
    filter?: {
        tags: string[]
    }
}
export interface fbx extends Attribute {
    url: string
}
export interface file extends Attribute {
    listFiles?: {
        username: string,
        dir?: string
    },
    listDirectories?: {
        username: string,
        dir?: string
    },
    refresh?: boolean,
    renderResponse?: boolean
}
export interface floor extends Attribute {}
export interface geometry extends Attribute {
    shape: GeometryShape,
    customShape?: number[][]
    size: [number, number, number],
    detail?: [number, number, number],
    segments?: number,
    phiStart?: number,
    phiLength?: number,
    points?: number
}
export interface grab extends Attribute {}
export interface graph extends Attribute {}
export interface hand extends Attribute {}
export interface head extends Attribute {}
export interface hover extends Attribute {
    
}
export interface input extends Attribute {
    button?: {

    },
    keyboard?: {

    },
    controlStick?: {

    },
    webcam?: {

    },
    speech?: {

    },
    authentication?: {

    }
}
export interface light extends Attribute {
    color: number,
    intensity: number,
    distance: number
}

export type LayoutAxis = "x" | "y" | "z";
export type LayoutPlane = "xy" | "yz" | "zx"
export type LayoutOrientation = LayoutAxis | LayoutPlane

export interface layout extends Attribute {
    type: "list" | "grid" | "radial" | "tube" | "fibonacci",
    columns?: number,
    gridSize?: number
    isometric?: boolean,
    axis?: LayoutAxis | LayoutPlane
}
export interface lookAway extends Attribute {}
export interface magic extends Attribute {}
export interface material extends Attribute {
    color?: number,
    map?: string,
    repeat?: [string, number, number],
    specularMap?: string,
    alphaMap?: string,
    bumpMap?: string,
    envMap?: string,
    roughnessMap?: string,
    metalnessMap?: string,
    shading?: "default" | "simple" | "physical" | "phong",
    procedural?: ProceduralMaterial
}
export interface media extends Attribute {}
export interface miniature extends Attribute {
    scale?: number
}
export interface npc extends Attribute {
    personality?: string,
    faction?: string,
    canMove?: boolean,
    canFight?: boolean,
    insane?: boolean
}
export interface obj extends Attribute {
    url: string
}
export interface oimo extends Attribute {}
export interface objective extends Attribute {}
export interface particles extends Attribute {}
export interface propulsion extends Attribute {}
export interface portal extends Attribute {
    user?: string,
    world?: string,
    coords?: [number, number, number],
    placeName?: string
}
export interface projectile extends Attribute {
    instant: boolean
    velocity: number
    acceleration: number
    projectileComponent: string
    hitPoints: number
}
export interface quest extends Attribute {}
export interface rest extends Attribute {
    get?: {
        url: string
    },
    post?: {
        url: string,
        data: any
    }
}
export interface rpgRace extends Attribute {}
export interface signal extends Attribute {
    value?: number,
    type?: "number"
}
export interface skill extends Attribute {}
export interface skybox extends Attribute {}
export interface script extends Attribute {
    program?: string,
    statements?: string[],
    modules?: string[][],
    run?: {
        program: string,
        args: any[],
        path?: ComponentPath
    },
    autorun?: boolean,
    repl?: boolean
}
export interface screenshot extends Attribute {}
export interface seat extends Attribute {}
export interface socialMedia extends Attribute {}
export interface speech extends Attribute {
    readText?: boolean
    voiceIndex?: number
}
export interface state extends Attribute {}
export interface stat extends Attribute {}
export interface staticCollisions extends Attribute {}
export interface terrain extends Attribute {}
export interface text extends Attribute {
    lines: string[],
    color: string,
    background: string,
    fontSize?: number,
    label?: boolean,
    canvasSize?: [number, number],
    editable?: boolean
}
export interface template extends Attribute {
    assets: { [mapCharacter: string]: string /* component name */ },
    textMap: string[]
}
export interface time extends Attribute {}
export interface toolUI extends Attribute {
    toolIndex?: number,
    toolHand?: 0|1,
    configureTool?: { 
        tool: number, 
        preset?: string, 
        data?: any 
    }
}

export interface ToolPanel {
    title: string,
    color: number,
    titleColor?: string,
    titleBackground?: string,
    content: {
        attrs?: Attributes
    }
}
export interface tool extends Attribute {
    panel?: ToolPanel,
    panels?: ToolPanel[]
}
export interface toolbox extends Attribute {}
export interface user extends Attribute {}
export interface vehicle extends Attribute {
    onActivate: {
        driverSeat?: boolean,
        passengerSeat?: boolean
    },
    flying?: boolean
    nautical?: boolean
}
export interface video extends Attribute {}
export interface virtualDevice extends Attribute {
    type: VirtualDeviceType,
    data?: AnyObject
}
export interface virtualMachine extends Attribute {
    cores?: number
    program?: string[],
    os?: string /* script name from asset system */
}
export interface wall extends Attribute {}
export interface webrtc extends Attribute {}
export interface weapon extends Attribute {
    ranged?: boolean
    projectileComponent?: string
}


