export default class TextSystem {

    constructor ( ) {
        this.mappedColors = [
            "#505050", "#ffffff", "#ffff00", "#ff0020", "#0080ff", 
            "#ff3000", "#ffb000", "#7000ef", "#00a0ff", "#505050" 
        ]
    }

    init (component: Component) {

        let prop = component.props.text,
            text = prop.lines,
            color = prop.color,
            background = prop.background,
            textTexture = null,
            textMaterial = null,
            textCanvas = document.createElement("canvas"),
            canvasSize = !!prop.label ? [512, 128] : [1024, 1024],
            context = null,
            config = { label: !!prop.label, fontSize: prop.fontSize != 0 ? prop.fontSize : -1 }

        textCanvas.setAttribute("style", "display:none")
        textCanvas.width = canvasSize[0]
        textCanvas.height = canvasSize[1]
        document.body.appendChild(textCanvas)
        context = textCanvas.getContext("2d")
        
        this._renderText(context, text, color, background, canvasSize, config )
        
        textTexture = new THREE.Texture( textCanvas )
        textTexture.anisotropy = three.renderer.capabilities.getMaxAnisotropy()
        textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            side: 0
        })
      
        textMaterial.map.needsUpdate = true
        component.mesh.material = textMaterial

        return {
            textMaterial,
            textMesh: component.mesh,
            textTexture,
            textCanvas,
            canvasSize,
            context,
            config,
            update: ( textProp ) => {

                if ( !!textProp )
                    component.props.text = Object.assign( {}, component.props.text, textProp )

                this._update( component )
            },
            write: ( text ) => {
                this._write( component, text )
            }
        }
    }

    _write (component: Component, text: string) {

        component.props.text.lines.push( text )

    }

    _update (component: Component) {

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
            config       = state.config
        
        this._renderText( context, text, color, background, canvasSize, config )
        textTexture.needsUpdate = true   
    }

    _renderText ( context: any, text: Array<string>, color: string, background: string, canvasSize: Array<number>, config: Object ) {

        let textLine = '',
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
            label = config.label,
            lines = 0,
            line = '',
            l = 0

        context.fillStyle = background
        context.fillRect(0, 0, canvasSize[0], canvasSize[1])
        context.font = config.fontFamily ? config.fontFamily : "10px Droid Sans Mono"
        context.font = "10px Droid Sans Mono"
        context.font = context.font.replace(/\d+px/, fontSize+"px");
        context.textBaseline = "top"
        context.fillStyle = color
        lines = text.length

        while ( l < text.length ) {
            line = text[ l ]
            if ( line.length > (42) * (canvasSize[0]/1024) ) {
                let multiLines = line.match(/.{1,42}/g)
                text.splice(l, 1, ...multiLines)
                lines = text.length
            }
            ++l
        }

        if ( label ) {
            text.map(( line, l ) => { 
                context.fillText( line, 12, 12 )
            })
        } else {
            text.map(( line, l ) => { 
                this._highlightMarkdown( l, line, lines, context, textRenderState ) // markdown
                if (line[0] == '%' || /^.*\:\s\%/.test(line) ) {
                    this._highlightSynesthesia( l, line, lines, context, textRenderState )
                } else {
                    context.fillText( line, 16, 960-(1 + (lines-l)*lineHeight) )
                }
            })
        }
    }

    _highlightSynesthesia ( l: number, line: string, lines: number, context: any, textState: Object ) {

        let xSize = textState.canvasSize[0],
            lineHeight = textState.fontSize*1.35,
            height = 960-(1 + (lines-l)*lineHeight),
            letters = [],
            len = 0
      
        letters = line.split("")
            len = letters.length

            line.split("").map( (letter, lIndex) => {
                let parsed = parseInt( letter );
                
                if ( parsed || parsed === 0) {
                    context.fillStyle = this.mappedColors[ parsed ]
                }
                context.fillText( letter, lIndex*22, 960-((lines-l)*lineHeight) )
            })
        context.fillStyle = textState.fillStyle;
    }

    _highlightMarkdown( l, line, lines, context, textState ) {

        let xSize = textState.canvasSize[0],
            lineHeight = textState.fontSize,
            height = 960-(1 + (lines-l)*lineHeight),
            toggleCodeBlock = line.indexOf('```') > -1
          
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

