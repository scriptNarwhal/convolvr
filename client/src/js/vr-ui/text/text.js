// deprecated

export default class Text {

    renderText (text, color, background) {

      let textTexture = null,
          textMaterial = null,
          duplicate = document.getElementById(text),
          textCanvas = null,
          textCanvasSize = 1024,
          fontSize = 0,
          textLine = '',
          context = null

  		if (!duplicate) {

        textCanvas = document.createElement("canvas")
        textCanvas.setAttribute("id", text)
        document.body.appendChild(textCanvas)
        textCanvas.setAttribute("style","display:none;")
        context = textCanvas.getContext("2d")
        textCanvas.width = textCanvasSize
        textCanvas.height = textCanvasSize/4
        fontSize = (26+Math.round(1500 / (text.length*1.4)))
        context.fillStyle = background
        context.fillRect(0, 0, textCanvasSize, textCanvasSize)
        context.font = fontSize+"pt RobotoLight"
        context.textBaseline = "top"
        context.fillStyle = color
        context.fillText(text, 20, 36-fontSize/4)

       } else {

         textCanvas = duplicate

       }
       
      textTexture = new THREE.Texture(textCanvas)
      textTexture.anisotropy = three.renderer.getMaxAnisotropy()
      textTexture.needsUpdate = true
      textMaterial = new THREE.MeshBasicMaterial({
             map: textTexture,
             side: 0
      })
      return textMaterial;

    }

  renderTextLines (id, text = [], color, background) {

    let textTexture = null,
        textMaterial = null,
        duplicate = document.getElementById(id),
        textCanvas = null,
        textCanvasSize = [1024, 1024],
        context = null,
        fontSize = 42,
        textLine = '',
        textRenderState = {
            codeBlock: false,
            canvasSize: textCanvasSize,
            fontSize,
            color
        },
        lines = 0,
        line = '',
        l = 0

    if (!duplicate) {
      textCanvas = document.createElement("canvas")
      textCanvas.setAttribute("style","display:none;")
      textCanvas.setAttribute("id", id)
      textCanvas.width = textCanvasSize[0]
      textCanvas.height = textCanvasSize[1]
      document.body.appendChild(textCanvas)
    } else {
      textCanvas = duplicate
    }
    context = textCanvas.getContext("2d")
    context.fillStyle = background
    context.fillRect(0, 0, textCanvasSize[0], textCanvasSize[1])
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
      this.highlightMarkdown(l, line, lines, context, textRenderState)
      context.fillText(line, 16, 960-(1+(lines-l)*fontSize*1.35))
    })

    textTexture = new THREE.Texture(textCanvas)
    textTexture.anisotropy = three.renderer.getMaxAnisotropy()
    textTexture.needsUpdate = true
    textMaterial = new THREE.MeshBasicMaterial({
           map: textTexture,
           side: 0
    })
    return textMaterial

  }

  highlightMarkdown(l, line, lines, context, textState) {

      let xSize = textState.canvasSize[0],
          lineHeight = textState.fontSize*1.35,
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
            if (line.split('```').length < 3) {
                textState.codeBlock = !textState.codeBlock
            }
        }
    }

}
