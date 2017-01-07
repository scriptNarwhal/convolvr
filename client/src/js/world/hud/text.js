export default class Text {
    renderText (text, color, background, lines = 0) {
      let textTexture = null,
          textMaterial = null,
          duplicate = document.getElementById(text),
          textCanvas = null,
          textCanvasSize = 1024,
          fontSize = 0,
          textLine = '',
          textCanvasContext = null

  		if (!duplicate) {
        lines = lines > 0 ? lines : Math.ceil(0.00025*text.length*fontSize)
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
        textCanvasContext.font = fontSize+"pt RobotoThin"
        textCanvasContext.textBaseline = "top"
        textCanvasContext.fillStyle = color

             if (lines > 1) {
               for (let line=0; line < lines; line++) {
                 textLine = text.substr(line*Math.ceil(text.length/lines),Math.ceil(text.length/lines))
                 textCanvasContext.fillText(textLine, 20, line*fontSize)
               }
             } else {
               textCanvasContext.fillText(text, 20, 36-fontSize/4)
             }
       } else {
         textCanvas = duplicate
       }
      textTexture = new THREE.Texture(textCanvas)
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
        fontSize = 32,
        textLine = '',
        textCanvasContext = null

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
      textCanvasContext.font = fontSize+"pt RobotoThin"
      textCanvasContext.textBaseline = "top"
      textCanvasContext.fillStyle = color
      text.map((line, l) => {
        textCanvasContext.fillText(line, 20, 1004-l*fontSize)
      })

    textTexture = new THREE.Texture(textCanvas)
    textTexture.needsUpdate = true
    textMaterial = new THREE.MeshBasicMaterial({
           map: textTexture,
           side: 0
    })
    return textMaterial;
  }
}
