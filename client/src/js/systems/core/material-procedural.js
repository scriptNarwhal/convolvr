export default class ProceduralMaterials {

  constructor( materialSystem, world ) {

    this.world = world
    this.materials = materialSystem
    this.randoms = [ 0, 0, 0, 0, 0, 0 ]
    this.noise = false

  }


  generateTexture( params ) { // would be useful for tiling / random patterns

    let assets = this.world.systems.assets,
      textureCode = params.name,
      texture = null // probably using size... and.. some data from the rendering

    if ( assets.proceduralTextures[ textureCode ] == null ) {  // reference TextSystem for canvas code here..

      texture = this._renderTexture( params )

    } else { // use cached version if available

      texture = assets.proceduralTextures[ textureCode ]

    }

    return texture

  }

  _renderTexture( params ) {

    let newTex = null,
      canvas = document.createElement("canvas"),
      canvasSize = [1024, 1024],
      context = null

    canvas.setAttribute("style", "display:none")
    canvas.width = canvasSize[0]
    canvas.height = canvasSize[1]
    canvas.setAttribute("height", canvasSize[1])
    canvas.setAttribute("width", canvasSize[0])
    document.body.appendChild(canvas)
    context = canvas.getContext("2d")
    this._renderInstructions( context, params.calls )
    newTex = new THREE.CanvasTexture(canvas)
    //newTex.anisotropy = three.renderer.getMaxAnisotropy()
    return newTex

  }

  _renderInstructions( context, calls, i = 0 ) {

    const DCS = calls.length
    let draw = null,
        params = [],
        c = 0

    while ( c < DCS ) {

      draw = calls[ c ]
      params = draw.params

      if ( this.noise ) {

        this.randoms.map((p, i) => {

          if ( p )

            params[ i ] = Math.random()*p

        })

      }

      switch ( draw.call ) {
        case "noise":
          this.randoms = [...params]
          this.noise = !this.noise
          break
        case "fillStyle":
          context.fillStyle = draw.params[0]
          break
        case "strokeStyle":
          context.fillStyle = draw.params[0]
          break
        case "beginPath":
          context.beginPath()
          break
        case "moveTo":
          context.moveTo(params[0], params[1])
          break
        case "lineTo":
          context.lineTo(params[0], params[1])
          break
        case "stroke":
          context.stroke()
          break
        case "fillRect":
          context.fillRect(params[0], params[1], params[2], params[3])
          break
        case "arc":
          context.arc(params[0], params[1], params[2], params[3])
          break
        case "text":
          context.fillText(params[0], params[1], params[2])
          break
        case "loop":
          this._renderLoop(context, draw.calls, params[0], params[1], params[2], params[3])
          break
      }

      c += 1

    }

  }

  _renderLoop( context, calls, start, dir, cond, limit ) {

    const MAX = 1000

    let i = start

    dir = dir == "+" ? 1 : -1    

    if ( cond == "<" ) {

      while ( i < limit && Math.abs(i) < MAX ) {

        this._renderInstructions(context, calls, i)
        i += dir
      }

    } else {

      while ( i > limit && Math.abs(i) < MAX ) {

        this._renderInstructions(context, calls, i)
        i += dir

      }

    }

  }


}