import { AttributeName, Attribute, propulsion, portal, material, assets, toolUI, tool, script } from "../../model/attribute";

export function getPropsList ( attrs: any ) {

    let out: any[] = []

    attrs.geometry.map( (data: any, d: number) => {
        out.push({ name: `geometry.${d}`, data })
    })  
    
    attrs.material.color.map( (data: any, d: number) => {
        out.push({ name: `material.${d}`, data })
    })
    
    attrs.material.material.map( (data: any, d: number) => {
        out.push({ name: `material.${d}`, data })
    })
    const systems = [ "structures", "vehicles", "media", "interactivity" ]

    systems.map( cat => {

        let category = attrs.systems[ cat ]

        Object.keys(category).map( (key: string) => {  
            category[ key ].map( (dat: any, d: number) => {
                out.push({ name: `${key}.${d}`, data: dat })
            })
        })
    })
    
    return out
}

//TODO: cast these to appropriate types from attribute.ts
export default function BuiltinProps () {
    return {
        geometry: [
            { shape: 'node', size:          [0.0001, 0.0001, 0.0001] },
            { shape: 'box', size:           [1, 1, 1 ] },
            { shape: 'plane', size:         [1, 0.5, 1] },
            { shape: 'octahedron', size:    [1.1, 0.5, 0.5,] },
            { shape: 'sphere', size:        [1.1, 0.5, 0.5,] },
            { shape: 'cylinder', size:      [1.1, 1.1, 0.5,] },
            { shape: 'torus', size:         [1.1, 1.1, 0.5,] },
            { shape: 'hexagon', size:       [1.1, 1.1, 0.5,] },
            { shape: 'open-box', size:      [1.1, 1.1, 0.5,] },
            { shape: 'open-clyinder', size: [1, 1, 1] },
            { shape: 'frustum', size:       [0.4, 0.4, 0.4]    }
        ],
        material: {
            color: [
                { mixin: true,       color: 0xff0707 },
                { mixin: true,       color: 0x07ff07 },
                { mixin: true,       color: 0x07ffff },
                { mixin: true,       color: 0xffff07 },
                { mixin: true,       color: 0xff07ff },
                { mixin: true,       color: 0x8707ff },
                { mixin: true,       color: 0xff8707 },
                { mixin: true,       color: 0x87ff87 },
                { mixin: true,       color: 0x878787 }
            ] as material[],
            material: [
                { name: "basic",     color: 0xffffff },
                { name: "plastic",   color: 0xffffff },
                { name: "wireframe", color: 0xffffff },
                { name: "metal",     color: 0xffffff },
                { name: "glass",     color: 0xffffff },
                { name: "stars",     color: 0xffffff, basic: true, procedural: {
                        name: "stars",
                        calls: [
                            { call: 'fillStyle', params: [ '#000000' ] },
                            { call: 'fillRect', params: [ 0, 0, 1024, 1024 ] },
                            { call: 'fillStyle', params: [ '#ffffff' ] },
                            { call: 'noise', params: [ 1024, 1024, 3, 3 ] },
                            { call: 'loop', params: [ 0, '+', '<', 1000 ], calls : [
                                { call: 'fillRect', params: [ 512, 512, 1, 1 ] },
                            ]}
                        ]
                    } 
                },
            ] as material[]
        },
        assets: [ 
            { path: "/data/images/textures/tiles.png" },
            { path: "/data/images/textures/gplaypattern_@2X.png" }, 
            { path: "/data/images/textures/shattered_@2X.png" },
            { path: "/data/images/textures/space1.jpg" }, 
            { path: "/data/images/textures/space2.jpg" }, 
            { path: "/data/images/textures/space3.jpg" },
            { path: "/data/images/textures/organic.jpg" },
            { path: "/data/images/photospheres/sky-reflection.jpg" }, 
            { path: "/data/images/photospheres/sky-reflection-c.jpg" },
            { path: "/data/images/photospheres/sky-reflection-b.jpg" }, 
            { path: "/data/images/photospheres/sky-reflection-p.jpg" }, 
            { path: "/data/images/photospheres/sky-reflection-g.jpg" }, 
            { path: "/data/images/photospheres/sky-reflection-r.jpg" },  
            { path: "/data/images/photospheres/sky-reflection-o.jpg" }
        ] as assets[],
        systems: { // load these from ../assets/attrs eventually
            structures: {
                floor: [{}],
                wall: [{}],
                door: [{}],
                space: [{}],
                particles: [{}],
                miniature: [{}]

            },
            tools: {
                toolUI: [
                    { menu: 1 },
                    { currentTool: true }, // indicator
                    { toolIndex: 0 },
                    { toolIndex: 1 },
                    { toolIndex: 2 },
                    { toolIndex: 3 },
                    { toolIndex: 4 },
                    { toolIndex: 5 }
                ] as toolUI[],
                tool: [
                    // tool templates
                ] as any[],
                
            },
            vehicles: {
                vehicle: [{}],
                control: [{}],
                propulsion: [
                    { thrust: 0.09 },
                    { thrust: 0.333 }
                ] as propulsion[],
                projectile: [
                    { type: 'instant' },
                    { type: 'slow', thrust: 0.050 }
                ],
                portal: [
                    { newPlace: true },
                    { newSpace: true },
                    { coords: [0, 0, 0] },
                    { worldName: "" },
                    { place: "" },
                    { domain: "" }
                ] as portal[]
            },
            media: {
                layout: [{}],
                chat: [{}],
                text: [{}],
                speech: [{}],
                audio: [{}],
                video: [{}],
                webrtc: [{}],
                // drawing : [{}],
                file: [{}],
                rest: [{}],
            },
            interactivity: {
                destructable: [{}],
                factory: [{}],
                factoryProvider: [{}],
                input: [ 
                    { type: 'button' },
                    { type: 'keyboard' },
                    { type: 'webcam' },
                    { type: 'speech' }
                ],
                script: [
                    { statements: [] } as script
                ],
                // signal: [{}],
                // display: [{}],
                cursor: [{}],
                hand: [{}],
                activate: [{}],
                hover: [{}],
                tabView: [{}],
                tab: [{}],
            }
        } as {[key: string]: { [key in AttributeName]?: Attribute[]} }
    }
}