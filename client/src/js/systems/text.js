export default class TextSystem {

    init (component) {
        let prop = component.props.text,
            text = prop.lines,
            color = prop.color,
            background = prop.background,
            textTexture = null,
            textMaterial = null,
            textCanvas = document.createElement("canvas"),
            textCanvasSize = 1024,
            context = null

        textCanvas.setAttribute("style", "display:none")
        textCanvas.width = textCanvasSize
        textCanvas.height = textCanvasSize
        document.body.appendChild(textCanvas)
        
        context = textCanvas.getContext("2d")
        
        this.renderText(context, text, color, background)
        
        textTexture = new THREE.Texture(textCanvas)
        textTexture.anisotropy = three.renderer.getMaxAnisotropy()
        textTexture.needsUpdate = true
        textMaterial = new THREE.MeshBasicMaterial({
            map: textTexture,
            side: 0
        })

        component.mesh = new THREE.Mesh(component.mesh.geometry, textMaterial)
        component.entity.textComponents.push(component)

        return {
            textMaterial,
            textTexture,
            textCanvas,
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
            textCanvasSize = 1024,
            context = state.context
        
        this.renderText(context, text, color, background)
        
        textTexture = new THREE.Texture(textCanvas)
        textTexture.anisotropy = three.renderer.getMaxAnisotropy()
        textTexture.needsUpdate = true   
        component.state.text.textTexture = textTexture
        component.mesh.material.needsUpdate = true
    }
    
    renderText (context, text, color, background) {
        let fontSize = 42,
            textLine = '',
            lines = 0,
            line = '',
            l = 0

         context.fillStyle = background
        context.fillRect(0, 0, textCanvasSize, textCanvasSize)
        context.font = fontSize+"pt RobotoLight"
        context.textBaseline = "top"
        context.fillStyle = color
        lines = text.length

        while (l < text.length) {
            line = text[l]
            if (line.length > 42) {
                let multiLines = line.match(/.{1,42}/g)
                text.splice(l, 1, ...multiLines)
                lines = text.length
            }
            ++l
        }
        text.map((line, l) => {
            context.fillText(line, 16, 960-(1+(lines-l)*fontSize*1.35))
        })
    }
}

