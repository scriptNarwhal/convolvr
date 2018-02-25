//@flow
// import * as THREEJS from 'three' 
import Convolvr from '../../world/world'
import Component from '../../core/component'

let _THREE

export default class TextSystem {

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

    init(component: Component) {
        let prop = component.props.text,
            text = prop.lines,
            color = prop.color,
            background = prop.background,
            textTexture = null,
            textMaterial = null,
            textCanvas = document.createElement("canvas"),
            canvasSizePOT = !!prop.canvasSize ? prop.canvasSize : [10, 10],
            canvasSize = !!prop.label ? [512, 128] : [Math.pow(2, canvasSizePOT[0]), Math.pow(2, canvasSizePOT[1])],
            context = null,
            config: any = { label: !!prop.label, fontSize: prop.fontSize != 0 ? prop.fontSize : -1 }

        textCanvas.setAttribute("style", "display:none")
        textCanvas.width = canvasSize[0]
        textCanvas.height = canvasSize[1]
        document != null && document.body != null && document.body.appendChild(textCanvas)
        context = textCanvas.getContext("2d")

        //get old diffuse map / color
        let oldDiffuseCode = component.state.material.getTextureCode("map"),
            oldMapImg = this.systems.assets.textures[ oldDiffuseCode ]

        if (oldMapImg) {
            oldMapImg = oldMapImg.image;
            config.noBackground = true;
            this._renderBackground(oldMapImg, context);
        }

        this._renderText(context, text, color, background, canvasSize, config )
        
        textTexture = new _THREE.Texture( textCanvas )
        textTexture.anisotropy = this.world.three.renderer.capabilities.getMaxAnisotropy()
        textMaterial = new _THREE.MeshBasicMaterial({
            map: textTexture,
            side: 0
        });
        textMaterial.map.needsUpdate = true
        component.mesh.material = textMaterial
        if (canvasSize[0] != canvasSize[1]) {
            this._resizeComponent(component, canvasSize)
        }
        return {
            textMaterial,
            textMesh: component.mesh,
            textTexture,
            textCanvas,
            canvasSize,
            context,
            config,
            update: ( textProp: any ) => {
                if ( !!textProp )
                    component.props.text = Object.assign( {}, component.props.text, textProp )

                this._update( component )
            },
            write: ( text: string ) => {
                this._write( component, text )
            }
        }
    }

    _renderBackground(image: any, context: any) {
        context.drawImage(image, 0, 0)
    }

    _resizeComponent(component: Component, size: number[]) {
        let geomProp = component.props.geometry,
            currentSize = geomProp.size;
        
        
    }

    _write(component: Component, text: string) {
        if (component.props.text.label) {
            component.props.text.lines = [];
            if (text.indexOf(":") > 0) {
                text = [...text.split(":").shift()].join("")
            }
        }
        component.props.text.lines.push( text )
    }

    _update(component: Component) {
        let prop         = component.props.text,
            state        = component.state.text,
            text         = prop.lines,
            color        = prop.color,
            background   = prop.background,
            textTexture  = state.textTexture,
            textMaterial = null,
            textCanvas   = state.textCanvas,
            canvasSize   = state.canvasSize,
            context      = state.context,
            config       = state.config;
        
        this._renderText( context, text, color, background, canvasSize, config )
        textTexture.needsUpdate = true   
    }

    _renderText(context: any, text: Array<string>, color: string, background: string, canvasSize: Array<number>, config: any) {
        let textLine = '',
            label = config.label,
            fontSize = (config.fontSize > 0 ? config.fontSize : (label ? 58 : 39)),
            lineHeight = fontSize*1.35,
            textRenderState = {
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
                let multiLines: any = line.match(/.{1,42}/g)
                text.splice(l, 1, ...multiLines)
                lines = text.length
            }
            ++l
        }

        if (label) {
            text.map(( line, l ) => { 
                context.fillText( line, 12, 12+l*lineHeight )
            })
        } else {
            text.forEach(( line, l ) => { 
                this._highlightMarkdown( l, line, lines, context, textRenderState ) // markdown
                if (line[0] == '%' || /^.*\:\s\%/.test(line) ) {
                    let outputLine = " "+line.substr(1, line.length-1);

                    this._highlightSynesthesia(l, outputLine, lines, context, textRenderState)
                } else {
                    context.fillText(line, 16, 960-(1 + (lines-l)*lineHeight))
                }
            })
        }
    }

    _highlightSynesthesia(l: number, line: string, lines: number, context: any, textState: any) {
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

    _highlightMarkdown(l: number, line: string, lines: number, context: any, textState: any) {
        let xSize = textState.canvasSize[0],
            lineHeight = textState.fontSize,
            height = 960-(1 + (lines-l)*lineHeight),
            toggleCodeBlock = line.indexOf('```') > -1;
          
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

