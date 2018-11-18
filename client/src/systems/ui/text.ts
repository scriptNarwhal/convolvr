import Convolvr from '../../world/world'
import Component from '../../model/component'
import { Material, Mesh, Texture } from 'three';
import { text } from '../../model/attribute';
import { System } from '..';

let _THREE: any;

export interface TextState  {
    textMaterial?: Material,
    textMesh: Mesh,
    textTexture: Texture,
    textCanvas: Element,
    canvasSize: number[],
    context: any,
    config: any,
    update: ( textProp: text ) => void,
    write: ( text: string ) => void
}

export default class TextSystem implements System {

    mappedColors: string[]
    world: Convolvr
    systems: any

    constructor ( world: Convolvr ) {
        this.world = world;
        _THREE = world.THREE;
        this.systems = world.systems;
        this.mappedColors = [
            "#505050", "#ffffff", "#ffff00", "#ff0020", "#0080ff", 
            "#ff3000", "#ffb000", "#7000ef", "#00a0ff", "#505050" 
        ]
    }

    public init(component: Component): TextState {
        let attr = component.attrs.text,
            text = attr.lines,
            color = attr.color,
            background = attr.background,
            textTexture = null,
            textMaterial = null,
            textCanvas = null,
            canvasSizePOT = !!attr.canvasSize ? attr.canvasSize : [10, 10],
            canvasSize = !!attr.label && !!!attr.canvasSize ? [512, 128] : [Math.pow(2, canvasSizePOT[0]), Math.pow(2, canvasSizePOT[1])],
            context = null,
            config: any = { label: !!attr.label, fontSize: attr.fontSize != 0 ? attr.fontSize : -1 }
        
        textCanvas = this.createTextCanvas(canvasSize);
        context = textCanvas.getContext("2d");
        //get old diffuse map / color
        let oldDiffuseCode = component.state.material.getTextureCode("map"),
            oldMapImg = this.systems.assets.textures[ oldDiffuseCode ]

        if (oldMapImg) {
            oldMapImg = oldMapImg.image;
            config.noBackground = true;
            this.renderBackground(oldMapImg, context);
        }

        this.renderText(context, text, color, background, canvasSize, config )
        textMaterial = this.createTextMaterial(textCanvas, background);
        component.mesh.material = textMaterial
        if (canvasSize[0] != canvasSize[1]) {
            this.resizeComponent(component, canvasSize)
        }
        return {
            textMaterial,
            textMesh: component.mesh,
            textTexture: textMaterial.map,
            textCanvas,
            canvasSize,
            context,
            config,
            update: ( textProp: any ) => {
                if ( !!textProp )
                    component.attrs.text = Object.assign( {}, component.attrs.text, textProp )

                this.update( component )
            },
            write: ( text: string ) => {
                this.write( component, text )
            }
        }
    }

    public createTextMaterial(textCanvas: HTMLCanvasElement, background?: string): any {
        let textTexture = new _THREE.Texture( textCanvas )
        textTexture.anisotropy = this.world.three.renderer.capabilities.getMaxAnisotropy()
        let textMaterial = new _THREE.MeshBasicMaterial({
            map: textTexture,
            side: 0,
            transparent: background != null ? background.length == 9 : false
        });
        textMaterial.map.needsUpdate = true
        return textMaterial;
    }

    public createTextCanvas(canvasSize: number[]): HTMLCanvasElement {
        let textCanvas = document.createElement("canvas");
        textCanvas.setAttribute("style", "display:none")
        textCanvas.width = canvasSize[0];
        textCanvas.height = canvasSize[1];
        document != null && document.body != null && document.body.appendChild(textCanvas)
        return textCanvas;
    }

    private renderBackground(image: any, context: any) {
        context.drawImage(image, 0, 0)
    }

    private resizeComponent(component: Component, size: number[]) {
        let geomProp = component.attrs.geometry,
            currentSize = geomProp.size;
        
        
    }

    private write(component: Component, text: string) {
        if (component.attrs.text.label) {
            component.attrs.text.lines = [];
            if (text.indexOf(":") > 0) {
                let filteredText = [...text.split(":")];
                
                filteredText.shift();
                text = filteredText.join("");
            }
        }
        component.attrs.text.lines.push( text )
    }

    private update(component: Component) {
        let attr         = component.attrs.text,
            state        = component.state.text,
            text         = attr.lines,
            color        = attr.color,
            background   = attr.background,
            textTexture  = state.textTexture,
            canvasSize   = state.canvasSize,
            context      = state.context,
            config       = state.config;
        
        this.renderText( context, text, color, background, canvasSize, config )
        textTexture.needsUpdate = true   
    }

   public renderText(context: any, text: Array<string>, color: string, background: string, canvasSize: Array<number>, config: any) {
        let label = config.label,
            fontSize = (config.fontSize > 0 ? config.fontSize : (label ? 58 : 39)),
            lineHeight = fontSize*1.35,
            textRenderState: any = {
                codeBlock: false,
                canvasSize,
                fontSize: fontSize,
                lineHeight,
                fillStyle: background,
                color
            },
            cols = (canvasSize[0] / 24) / label ? 1.487 : 1,
            lines = 0,
            line = '',
            l = 0;
            
        if (!!!config.noBackground) {
            context.fillStyle = background
            context.fillRect(0, 0, canvasSize[0], canvasSize[1])
        }
        context.font = config.fontFamily ? config.fontFamily : "10px Roboto"
        context.font = "10px Roboto"
        context.font = context.font.replace(/\d+px/, fontSize+"px");
        context.textBaseline = "top"
        context.fillStyle = color
        lines = text.length

        while (l < text.length) {
            line = text[ l ];
            if ( line.length > cols ) {
                let multiLines: any = line.match( label ? /.{1,17}/g : /.{1,42}/g );

                text.splice(l, 1, ...multiLines);
                lines = text.length;
            }
            ++l
        }

        if (label) {
            context.clearRect(0,0,canvasSize[0],canvasSize[1]);
            text.map(( line, l ) => { 
                context.fillText( line, 12, 12+l*lineHeight )
            })
        } else {
            text.forEach(( line, l ) => { 
                this.highlightMarkdown( l, line, lines, context, textRenderState ) // markdown
                if (line[0] == '%' || /^.*\:\s\%/.test(line) ) {
                    let outputLine = " "+line.substr(1, line.length-1);

                    this.highlightSynesthesia(l, outputLine, lines, context, textRenderState)
                } else {
                    context.fillText(line, 16, 960-(1 + (lines-l)*lineHeight))
                }
            })
        }
    }

    private highlightSynesthesia(l: number, line: string, lines: number, context: any, textState: any) {
        let xSize = textState.canvasSize[0],
            lineHeight = textState.fontSize*1.35,
            height = 960-(1 + (lines-l)*lineHeight),
            letters = [],
            len = 0;
      
        letters = line.split("")
        len = letters.length
        line.split("").map((letter, lIndex) => {
            let parsed = parseInt(letter);
            
            if (parsed || parsed === 0) {
                context.fillStyle = this.mappedColors[ parsed ]
            }
            context.fillText(letter, -22+lIndex*22, 960-((lines-l)*lineHeight))
        })
        context.fillStyle = textState.fillStyle;
    }

    private highlightMarkdown(l: number, line: string, lines: number, context: any, textState: any) {
        let xSize = textState.canvasSize[0],
            lineHeight = textState.fontSize,
            height = 960-(1 + (lines-l)*lineHeight),
            toggleCodeBlock = line.indexOf && line.indexOf('```') > -1;
          
        if ( line[0] == '#' ) { // markdown heading
            context.fillStyle = '#ffffff'
        } else if (!textState.codeBlock) {
            context.fillStyle = textState.color
        }

        if ( textState.codeBlock || toggleCodeBlock ) {
            context.fillStyle = '#bbbbbb'
            context.fillRect(0, height+10, xSize, lineHeight+10)
            context.fillStyle = '#000000'  
        }

        if ( toggleCodeBlock ) {
            if (line.split('```').length < 3) {
                textState.codeBlock = !textState.codeBlock
            }
        }
    }
}

