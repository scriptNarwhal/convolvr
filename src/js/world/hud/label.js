import Icon from './icon'

export default class Label {
    constructor (data) {
        this.mesh = null
        this.color = data.color || 0xffffff
        this.lightColor = data.lightColor || 0xffffff
        this.text = typeof data == 'string' ? data : (data.text || "Text")
    }

    initMesh () {
      let mesh = null,
          color = this.color,
          light =  this.lightColor ? new THREE.PointLight(this.lightColor, 1.0, 200) : false,
          geom = new THREE.BoxGeometry(132, 132, 132),
          mat = this.renderText(this.text, color, "#000000")

      mesh = new THREE.Mesh(geom, mat)
      if (light) {
        mesh.add(light)
        light.position.set(0, 100, -100)
      }
      this.mesh = mesh
      return mesh
    }

    renderText (text, color, background) {
      let duplicate = document.getElementById(text);
  		if (!duplicate) {
        let textTexture = null,
            textMaterial = null,
            textCanvasSize = 1024,
            fontSize = 0,
            lines = 0,
            textCanvasContext = null,
            textCanvas = document.createElement("canvas")

        textCanvas.setAttribute("id", text)
        document.body.appendChild(textCanvas)
        textCanvas.setAttribute("style","display:none;")
        textCanvasContext = textCanvas.getContext("2d")
        textCanvas.width = textCanvasSize
        textCanvas.height = textCanvasSize
        fontSize = (38+Math.round(1800 / text.length))
        textCanvasContext.fillStyle = background
        textCanvasContext.fillRect(0,0,textCanvasSize,textCanvasSize)
        textCanvasContext.font = fontSize+"pt helvetica"
        textCanvasContext.textBaseline = "top"
        textCanvasContext.fillStyle = "rgb("+Math.round(color[0]*255)+","+Math.round(color[1]*255)+","+Math.round(color[2]*255)+")"
        lines = Math.ceil(0.0005*text.length*fontSize)
             if (lines > 0) {
               for (line=0; line<lines; line++) {
                 textLine=text.substr(line*Math.ceil(text.length/lines),Math.ceil(text.length/lines))
                 textCanvasContext.fillText(textLine, 10, line*fontSize)
               }
             } else {
               textCanvasContext.fillText(text, 10, 0)
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

    onActivate () {

    }
}
