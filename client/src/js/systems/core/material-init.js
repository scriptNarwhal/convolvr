export let _initMaterialProp = (prop, simpleShading) => { // material presets & configuration

  let basic = false

  switch (prop.name) {

    case "wireframe":
      basic = true
      break
    case "basic": // mesh basic material
      basic = true
      break
    case "terrain":
      if (!simpleShading) {

        //prop.metalnessMap = "/data/images/textures/tiles.png" 
        prop.roughnessMap = '/data/images/textures/gplaypattern_@2X-2.png'
        prop.map = !!!prop.map ? '/data/images/textures/shattered_@2X-2.png' : prop.map

      } else {

        prop.map = '/data/images/textures/gplaypattern_@2X-2.png'
        prop.envMap = 'none'

      }

      prop.repeat = ['wrapping', 12, 12]
      break
    case "terrain2":
      if (!simpleShading) {

        prop.map = !!!prop.map ? '/data/images/textures/terrain1.jpg' : prop.map

      } else {

        prop.map = '/data/images/textures/terrain1.jpg' // /data/images/textures/gplaypattern_@2X-2.png'
        prop.envMap = 'none'

      }
      prop.repeat = ['wrapping', 8, 8]
      break
    case "terrain3":
      if (!simpleShading) {

        prop.map = !!!prop.map ? '/data/images/textures/terrain2.jpg' : prop.map
        //prop.roughnessMap = '/data/images/textures/shattered_@2X-2.png'

      } else {

        prop.map = '/data/images/textures/terrain2.jpg' // /data/images/textures/gplaypattern_@2X-2.png'
        prop.envMap = 'none'

      }

      prop.repeat = ['wrapping', 10, 10]
      break
    case "terrain4":
      if (!simpleShading) {

        prop.metalnessMap = "/data/images/textures/terrain3.jpg"
        prop.map = !!!prop.map ? '/data/images/textures/terrain3.jpg' : prop.map

      } else {

        prop.map = '/data/images/textures/terrain3.jpg'
        prop.envMap = 'none'

      }

      prop.repeat = ['wrapping', 10, 10]
      break
    case "organic":
      if (!simpleShading) {

        prop.roughnessMap = "/data/images/textures/tiles-light.png"
        prop.map = !!!prop.map ? '/data/images/textures/tiles-light.png' : prop.map

      } else {

        prop.map = '/data/images/textures/tiles-light.png' // /data/images/textures/gplaypattern_@2X-2.png'
        prop.envMap = 'none'

      }

      prop.repeat = ['wrapping', 6, 6]
      break
    case "tree":
      if (!simpleShading) {

        //prop.roughnessMap = "/data/images/textures/tiles-light.png"
        prop.map = !!!prop.map ? '/data/images/textures/foliage1.jpg' : prop.map
       // prop.alphaMap = !!!prop.map ? "/data/images/textures/surface03.jpg" : prop.map

      } else {

        prop.map = '/data/images/textures/foliage1.jpg'
        prop.envMap = 'none'

      }

      prop.repeat = ['wrapping', 6, 6]
      break
    case "metal":
      prop.repeat = !!!prop.map ? ['wrapping', 3, 3] : ['wrapping', 1, 1]

      if (!simpleShading)

        prop.metalnessMap = "/data/images/textures/gplaypattern_@2X-2.png"


      prop.map = !!!prop.map ? '/data/images/textures/metal4.jpg' : prop.map
      break
    case "metal2":
      prop.repeat = !!!prop.map ? ['wrapping', 3, 3] : ['wrapping', 1, 1]

      if (!simpleShading) {

        prop.alphaMap = "/data/images/textures/metal2.png"
        prop.map = !!!prop.map ? '/data/images/textures/tiles-light.png' : prop.map

      } else {

        prop.map = !!!prop.map ? '/data/images/textures/metal3.png' : prop.map

      }
      break
    case "glass":
      prop.repeat = ['wrapping', 18, 18]

      if (!simpleShading) {

        prop.metalnessMap = '/data/images/textures/shattered_@2X-2.png'

      } else {

        prop.specularMap = '/data/images/textures/tiles.png'

      }
      break
    case "hard-light":
      prop.map = '/data/images/textures/surface03.jpg'

      if (!simpleShading)

        prop.metalnessMap = '/data/images/textures/surface03.jpg'

      break
    case "plastic":
      prop.repeat = ['wrapping', 2, 2]
      prop.map = !!!prop.map ? '/data/images/textures/gplaypattern_@2X-2.png' : prop.map

      if (!simpleShading)

        prop.metalnessMap = "/data/images/textures/tiles.png"
    break
    case "stars":
      prop.repeat = ['wrapping', 4, 2]
    break
    default:
      break

  }

  if (simpleShading)

    prop.envMap = 'none'


  return basic

}


export let _initMaterialConfig = ( prop, mat, shading, basic, mobile  ) => {
    
  if ( mobile ) 

    shading = "standard"

  switch ( prop.name ) { // material presets
    
    case "wireframe":
        mat.wireframe = true
        mat.fog = false
    break
    case "basic": // mesh basic material
        
    break
    case "terrain":
      if ( shading != 'physical' ) {
        
        mat.specular = 0xffffff
        mat.shininess = 1.0

      }
    break
    case "terrain2":
      
    break
    case "terrain4":
    if ( shading == 'physical' ) {

        mat.metalness = 0.5
        mat.roughness = 1.0

    } else {

      mat.shininess = 0.05

    }
    break
    case "tree":
      mat.transparent = !mobile
    break
    case "organic":
      
    break
    case "metal":
      if ( shading == 'physical' ) {

        mat.metalness = 1.5

      } else {

        mat.specular = 0xffffff
        mat.shininess = 7.4

      }
      break
      case "metal2":
        //mat.side = mobile ? THREE.FrontSide : THREE.DoubleSide
        mat.transparent = !mobile
      break
      case "hard-light":
        if (!mobile && prop.bumpMap ) {

          mat = Object.assign({}, mat, {
                    color: 0x0040ff,
                    specular: 0x0242ff,
                    shininess: 45,
                    bumpScale: 440
          })

        }
      break
      case "glass":
        if ( shading == 'physical' ) {
  
          mat.metalness = 1.0
  
        } else {
  
          mat.specular = 0xffffff
          mat.shininess = 9.4
  
        }
        mat.transparent = true
        mat.opacity = 0.9
      break
      case "plastic":
        if ( shading == 'physical' ) {
    
          mat.metalness = 0.75
    
        } else {
    
          mat.specular = 0xffffff
          mat.shininess = 2.0
    
        }
      break
      case "stars":
        
    break
      default:
      break
    
  }
    
}