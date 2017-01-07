export default class Label {
    constructor (data, mount) {
        this.mount = mount
        this.mesh = null
        this.color = data.color || 0xffffff
        this.lightColor = data.lightColor || 0xffffff
        this.text = typeof data == 'string' ? data : (data.text || "Text")
    }

    initMesh () {
      let mesh = null,
          color = this.color,
          light =  this.lightColor ? new THREE.PointLight(this.lightColor, 1.0, 200) : false,
          geom = new THREE.BoxGeometry(1600, 400, 40),
          mat = this.renderText(this.text, color, "#000000")
      if (this.mesh == null) {
        mesh = new THREE.Mesh(geom, mat)
        if (light) {
          mesh.add(light)
          light.position.set(0, 100, -100)
        }
        this.mesh = mesh
        this.mesh.position.set(0, -600, 0)
        this.mount.add(mesh)
      } else {
        this.mesh.material = mat
        this.mesh.material.needsUpdate = true
      }

    }

    update (data) {
      this.text = data.text
      this.color = data.color
      this.lightColor = data.lightColor
      // three.scene.remove(this.mesh)
      this.initMesh()
    }

    renderText (text, color, background) {
      let textTexture = null,
          textMaterial = null,
          duplicate = document.getElementById(text),
          textCanvas = null,
          textCanvasSize = 1024,
          fontSize = 0,
          textLine = '',
          lines = 0,
          textCanvasContext = null

  		if (!duplicate) {
        lines = Math.ceil(0.00025*text.length*fontSize)
        textCanvas = document.createElement("canvas")
        textCanvas.setAttribute("id", text)
        document.body.appendChild(textCanvas)
        textCanvas.setAttribute("style","display:none;")
        textCanvasContext = textCanvas.getContext("2d")
        textCanvas.width = textCanvasSize
        textCanvas.height = textCanvasSize/4
        fontSize = (28+Math.round(1500 / (text.length*1.5)))
        textCanvasContext.fillStyle = background
        textCanvasContext.fillRect(0, 0, textCanvasSize, textCanvasSize)
        textCanvasContext.font = fontSize+"pt helvetica"
        textCanvasContext.textBaseline = "top"
        textCanvasContext.fillStyle = color

             if (lines > 1) {
               for (let line=0; line < lines; line++) {
                 textLine = text.substr(line*Math.ceil(text.length/lines),Math.ceil(text.length/lines))
                 textCanvasContext.fillText(textLine, 20, line*fontSize)
               }
             } else {
               textCanvasContext.fillText(text, 20, 20)
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
