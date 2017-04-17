export default class TextSystem {

    init (component) {
        let prop = component.props.text,
            text = prop.lines,
            color = prop.color,
            background = prop.background,
            textTexture = null,
            textMaterial = null,
            textCanvas = document.createElement("canvas"),
            canvasSize = [1024, 1024],
            context = null

        textCanvas.setAttribute("style", "display:none")
        textCanvas.width = canvasSize[0]
        textCanvas.height = canvasSize[1]
        document.body.appendChild(textCanvas)
        
        context = textCanvas.getContext("2d")
        
        this.renderText(context, text, color, background, canvasSize)
        
        textTexture = new THREE.Texture(textCanvas)
        textTexture.anisotropy = three.renderer.getMaxAnisotropy()
        textTexture.needsUpdate = true
        textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            side: 0
        })

        component.mesh = new THREE.Mesh(component.mesh.geometry, textMaterial)

        return {
            textMaterial,
            textTexture,
            textCanvas,
            canvasSize,
            context,
            update: () => {
                this.update(component)
            }
        }
    }

    update (component) {
        let prop = component.props.text,
            state = component.state.text,
            text = prop.lines,
            color = prop.color,
            background = prop.background,
            textTexture = null,
            textMaterial = null,
            textCanvas = null,
            canvasSize = prop.canvasSize,
            context = state.context
        
        this.renderText(context, text, color, background, canvasSize)
        
        textTexture = new THREE.Texture(textCanvas)
        textTexture.anisotropy = three.renderer.getMaxAnisotropy()
        textTexture.needsUpdate = true   
        component.state.text.textTexture = textTexture
        component.mesh.material.needsUpdate = true
    }
    
    renderText (context, text, color, background, canvasSize) {
        let fontSize = 42,
            textLine = '',
            textRenderState = {
                codeBlock: false,
                canvasSize,
                fontSize,
                color
            },
            lines = 0,
            line = '',
            l = 0

         context.fillStyle = background
        context.fillRect(0, 0, canvasSize[0], canvasSize[1])
        context.font = fontSize+"pt RobotoLight"
        context.textBaseline = "top"
        context.fillStyle = color
        lines = text.length

        while (l < text.length) {
            line = text[l]
            if (line.length > (42) * (canvasSize[0]/1024) ) {
                let multiLines = line.match(/.{1,42}/g)
                text.splice(l, 1, ...multiLines)
                lines = text.length
            }
            ++l
        }
        text.map((line, l) => {
            // markdown
            this.highlightMarkdown(l, line, lines, context, textRenderState)
            context.fillText(line, 16, 960-(1+(lines-l)*fontSize*1.35))
        })
    }

    highlightMarkdown(l, line, lines, context, textState) {
        let xSize = textState.canvasSize[0],
          lineHeight = textState.fontSize,
          height = 960-(1+(lines-l)*lineHeight),
          toggleCodeBlock = line.indexOf('```') > -1
          
        if (line[0] == '#') { // markdown heading
            context.fillStyle = '#ffffff'
        } else if (!textState.codeBlock) {
            context.fillStyle = textState.color
        }
        if (textState.codeBlock || toggleCodeBlock) {
            context.fillStyle = '#bbbbbb'
            context.fillRect(0, height+10, xSize, lineHeight+10)
            context.fillStyle = '#000000'  
        }
        if (toggleCodeBlock) {
            textState.codeBlock = !textState.codeBlock
        }
    }
}

