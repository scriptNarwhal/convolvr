export function getPropsList ( attrs ) {

    let out = []

    attrs.geometry.map( (data, d) => {
        out.push({ name: `geometry.${d}`, data })
    })  
    
    attrs.material.map( (data, d) => {
        out.push({ name: `material.${d}`, data })
    })

    const systems = [ "structures", "vehicles", "media", "interactivity" ]

    systems.map( cat => {

        let category = attrs.systems[ cat ]

        Object.keys(category).map( key => {  
            category[ key ].map( (dat, d) => {
                out.push({ name: `${key}.${d}`, data: dat })
            })
        })
    })
    
    return out
}

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
        material: [
            { name: "basic",     color: 0xffffff },
            { name: "plastic",   color: 0xffffff },
            { name: "metal",     color: 0xffffff },
            { name: "glass",     color: 0xffffff },
            { name: "wireframe", color: 0xffffff },
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
            { mixin: true,       color: 0xff0707 },
            { mixin: true,       color: 0x07ff07 },
            { mixin: true,       color: 0x0707ff }
        ],
        assets: [ 
            { path: "/data/images/textures/tiles.png" },
            { path: "/data/images/textures/gplaypattern_@2X.png" }, 
            { path: "/data/images/textures/shattered_@2X.png" },
            { path: "/data/images/textures/terrain1.jpg" }, 
            { path: "/data/images/textures/terrain2.jpg" }, 
            { path: "/data/images/textures/terrain3.jpg" },
            { path: "/data/images/textures/organic.jpg" },
            { path: "/data/images/photospheres/sky-reflection.jpg" }, 
            { path: "/data/images/photospheres/sky-reflection-c.jpg" },
            { path: "/data/images/photospheres/sky-reflection-b.jpg" }, 
            { path: "/data/images/photospheres/sky-reflection-p.jpg" }, 
            { path: "/data/images/photospheres/sky-reflection-g.jpg" }, 
            { path: "/data/images/photospheres/sky-reflection-r.jpg" },  
            { path: "/data/images/photospheres/sky-reflection-o.jpg" }
        ],
        systems: { // load these from ../assets/attrs eventually
            structures: {
                floor: [{}],
                wall: [{}],
                door: [{}],
                terrain: [{}],
                container: [{}]
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
                ],
                tool: [
                    // tool templates
                ],
                
            },
            vehicles: {
                vehicle: [{}],
                control: [{}],
                propulsion: [
                    { thrust: 0.09 },
                    { thrust: 0.333 }
                ],
                projectile: [
                    { type: 'instant' },
                    { type: 'slow', thrust: 0.050 }
                ],
                portal: [
                    { newPlace: true },
                    { newWorld: true },
                    { coords: [0, 0, 0] },
                    { worldName: "" },
                    { place: "" },
                    { domain: "" }
                ]   
            },
            media: {
                layout: [{}],
                chat: [{}],
                text: [{}],
                speech: [{}],
                audio: [{}],
                video: [{}],
                webrtc: [{}],
                drawing : [{}],
                file: [{}],
                rest: [{}],
            },
            interactivity: {
                destructable: [{}],
                particles: [{}],
                factory: [{}],
                metaFactory: [{}],
                input: [ 
                    { type: 'button' },
                    { type: 'keyboard' },
                    { type: 'webcam' },
                    { type: 'speech' }
                ],
                signal: [{}],
                switch: [{}],
                loop: [{}],
                memory: [{}],
                cpu: [{}],
                ioController: [{}],
                networkInterface: [{}],
                driveController: [{}],
                displayAdapter: [{}],
                display: [{}],
                cursor: [{}],
                hand: [{}],
                activate: [{}],
                hover: [{}],
                miniature: [{}],
                tabView: [{}],
                tab: [{}],
            }
        }
    }
}