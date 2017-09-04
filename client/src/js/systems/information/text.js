export default class TextSystem {

    init ( component ) {

        let prop = component.props.text,
            text = prop.lines,
            color = prop.color,
            background = prop.background,
            textTexture = null,
            textMaterial = null,
            textCanvas = document.createElement("canvas"),
            canvasSize = !!prop.label ? [512, 128] : [1024, 1024],
            context = null,
            config = { label: !!prop.label }

        textCanvas.setAttribute("style", "display:none")
        textCanvas.width = canvasSize[0]
        textCanvas.height = canvasSize[1]
        document.body.appendChild(textCanvas)
        context = textCanvas.getContext("2d")
        
        this._renderText(context, text, color, background, canvasSize, config )
        
        textTexture = new THREE.Texture( textCanvas )
        textTexture.anisotropy = three.renderer.getMaxAnisotropy()
        textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            side: 0
        })
        let matTest = new THREE.MeshBasicMaterial({ color: 0xff0000 })
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

                if ( !!textProp ) {

                    component.props.text = Object.assign( {}, component.props.text, textProp )

                }

                this._update( component )

            },
            write: ( text ) => {

                this._write( component, text )

            }
        }

    }

    _write ( component, text ) {

        component.props.text.lines.push( text )

    }

    _update ( component ) {

        let prop = component.props.text,
            state = component.state.text,
            text = prop.lines,
            color = prop.color,
            background = prop.background,
            textTexture = state.textTexture,
            textMaterial = null,
            textCanvas = state.textCanvas,
            canvasSize = state.canvasSize,
            context = state.context,
            config = state.config
        
        this._renderText( context, text, color, background, canvasSize, config )
        textTexture.needsUpdate = true   

    }
    
    _renderText ( context, text, color, background, canvasSize, config ) {

        let textLine = '',
            textRenderState = {
                codeBlock: false,
                canvasSize,
                fontSize,
                color
            },
            label = config.label,
            fontSize = label ? 52 : 42,
            lines = 0,
            line = '',
            l = 0

        context.fillStyle = background
        context.fillRect(0, 0, canvasSize[0], canvasSize[1])
        context.font = fontSize+"pt RobotoLight"
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
                context.fillText( line, 16, 960-(1 + (lines-l)*fontSize*1.35) )

            })

        }

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

