export default class Text {
    renderText (text, color, background) {
      let textTexture = null,
          textMaterial = null,
          duplicate = document.getElementById(text),
          textCanvas = null,
          textCanvasSize = 1024,
          fontSize = 0,
          textLine = '',
          textCanvasContext = null

  		if (!duplicate) {
        textCanvas = document.createElement("canvas")
        textCanvas.setAttribute("id", text)
        document.body.appendChild(textCanvas)
        textCanvas.setAttribute("style","display:none;")
        textCanvasContext = textCanvas.getContext("2d")
        textCanvas.width = textCanvasSize
        textCanvas.height = textCanvasSize/4
        fontSize = (26+Math.round(1500 / (text.length*1.4)))
        textCanvasContext.fillStyle = background
        textCanvasContext.fillRect(0, 0, textCanvasSize, textCanvasSize)
        textCanvasContext.font = fontSize+"pt RobotoLight"
        textCanvasContext.textBaseline = "top"
        textCanvasContext.fillStyle = color
        textCanvasContext.fillText(text, 20, 36-fontSize/4)
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
        textCanvasSize = 1024,
        textCanvasContext = null,
        fontSize = 42,
        textLine = '',
        lines = 0,
        line = '',
        l = 0

    if (!duplicate) {
      textCanvas = document.createElement("canvas")
      textCanvas.setAttribute("style","display:none;")
      textCanvas.setAttribute("id", id)
      textCanvas.width = textCanvasSize
      textCanvas.height = textCanvasSize
      document.body.appendChild(textCanvas)
    } else {
      textCanvas = duplicate
    }
    textCanvasContext = textCanvas.getContext("2d")
    textCanvasContext.fillStyle = background
    textCanvasContext.fillRect(0, 0, textCanvasSize, textCanvasSize)
    textCanvasContext.font = fontSize+"pt RobotoLight"
    textCanvasContext.textBaseline = "top"
    textCanvasContext.fillStyle = color
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
      textCanvasContext.fillText(line, 16, 960-(1+(lines-l)*fontSize*1.35))
    })

    textTexture = new THREE.Texture(textCanvas)
    textTexture.anisotropy = three.renderer.getMaxAnisotropy()
    textTexture.needsUpdate = true
    textMaterial = new THREE.MeshBasicMaterial({
           map: textTexture,
           side: 0
    })
    return textMaterial;
  }
}
