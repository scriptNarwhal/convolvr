import { material } from "../../../model/attribute";

export let _initMaterialProp = (attr: material, simpleShading: boolean) => { // material presets & configuration

  let basic = false

  switch (attr.name) {

    case "wireframe":
      basic = true
      break
    case "basic": // mesh basic material
      basic = true
      break
    case "terrain":
      if (!simpleShading) {
        //attr.metalnessMap = "/data/images/textures/tiles.png" 
        attr.roughnessMap = '/data/images/textures/terrain5.jpg'
        attr.map = !!!attr.map ? '/data/images/textures/terrain4.jpg' : attr.map
      } else {
        attr.map = '/data/images/textures/terrain4.jpg'
        attr.envMap = 'none'
      }

      attr.repeat = attr.repeat ||  ['wrapping', 12, 12]
      break
    case "terrain2":
      attr.color = 0x20ff10;
      if (!simpleShading) {
        attr.map = !!!attr.map ? '/data/images/textures/terrain1.jpg' : attr.map
      } else {
        attr.map = '/data/images/textures/terrain1.jpg' // /data/images/textures/gplaypattern_@2X-2.png'
        attr.envMap = 'none'
      }
      attr.repeat = attr.repeat || ['wrapping', 10, 10];
      break
    case "terrain3":
      if (!simpleShading) {
        attr.map = !!!attr.map ? '/data/images/textures/terrain4.jpg' : attr.map
        //attr.roughnessMap = '/data/images/textures/shattered_@2X-2.png'
      } else {
        attr.map = '/data/images/textures/terrain4.jpg' // /data/images/textures/gplaypattern_@2X-2.png'
        attr.envMap = 'none'
      }

      attr.repeat = attr.repeat ||  ['wrapping', 12, 12]
      break
    case "terrain4":
      if (!simpleShading) {
        attr.metalnessMap = "/data/images/textures/terrain3.jpg"
        attr.map = !!!attr.map ? '/data/images/textures/terrain3.jpg' : attr.map
      } else {
        attr.map = '/data/images/textures/terrain3.jpg'
        attr.envMap = 'none'
      }

      attr.repeat = attr.repeat ||  ['wrapping', 12, 12]
      break
    case "organic":
      if (!simpleShading) {
        attr.roughnessMap = "/data/images/textures/tiles-light.png"
        attr.map = !!!attr.map ? '/data/images/textures/tiles-light.png' : attr.map
      } else {
        attr.map = '/data/images/textures/tiles-light.png' // /data/images/textures/gplaypattern_@2X-2.png'
        attr.envMap = 'none'
      }

      attr.repeat = attr.repeat ||  ['wrapping', 6, 6]
      break
    case "tree":
      if (!simpleShading) {
        //attr.roughnessMap = "/data/images/textures/tiles-light.png"
        attr.map = !!!attr.map ? '/data/images/textures/foliage1.jpg' : attr.map
       // attr.alphaMap = !!!attr.map ? "/data/images/textures/surface03.jpg" : attr.map
      } else {
        attr.map = '/data/images/textures/foliage1.jpg'
        attr.envMap = 'none'
      }

      attr.repeat = attr.repeat ||  ['wrapping', 6, 6]
      break
    case "metal":
      attr.repeat = !!!attr.map ? ['wrapping', 3, 3] : ['wrapping', 1, 1]

      if (!simpleShading)
        attr.metalnessMap = "/data/images/textures/metal4.jpg"


      attr.map = !!!attr.map ? '/data/images/textures/metal4.jpg' : attr.map
      break
    case "metal2":
      attr.repeat = !!!attr.map ? ['wrapping', 3, 3] : ['wrapping', 1, 1]

      if (!simpleShading) {
        attr.alphaMap = "/data/images/textures/metal2.png"
        attr.map = !!!attr.map ? '/data/images/textures/metal3.png' : attr.map
      } else {
        attr.map = !!!attr.map ? '/data/images/textures/metal3.png' : attr.map
      }
      break
      case "metal3":
      attr.repeat = !!!attr.map ? ['wrapping', 3, 3] : ['wrapping', 1, 1]

      if (!simpleShading) {
        attr.metalnessMap = "/data/images/textures/metal5.jpg"
        attr.map = !!!attr.map ? '/data/images/textures/metal5.jpg' : attr.map
      } else {
        attr.map = !!!attr.map ? '/data/images/textures/metal5.jpg' : attr.map
      }
      break
    case "glass":
      attr.repeat = attr.repeat ||  ['wrapping', 18, 18]

      if (!simpleShading) {
        attr.metalnessMap = '/data/images/textures/shattered_@2X-2.png'
      } else {
        attr.specularMap = '/data/images/textures/tiles.png'
      }
      break
    case "hard-light":
      attr.map = '/data/images/textures/surface03.jpg'

      if (!simpleShading)
        attr.metalnessMap = '/data/images/textures/surface03.jpg'

      break
    case "plastic":
      attr.repeat = attr.repeat ||  ['wrapping', 2, 2]
      attr.map = !!!attr.map ? '/data/images/textures/gplaypattern_@2X-2.png' : attr.map

      if (!simpleShading)
        attr.metalnessMap = "/data/images/textures/tiles.png"
    break
    case "stars":
      attr.repeat = attr.repeat ||  ['wrapping', 4, 2]
    break
    default:
      break

  }

  if (simpleShading)
    attr.envMap = 'none'


  return basic

}


export let _initMaterialConfig = ( attr: any, mat:any, shading: any, basic: boolean, mobile: boolean  ) => {
    
  if ( mobile ) 

    shading = "standard"

  switch ( attr.name ) { // material presets
    
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
        if (!mobile && attr.bumpMap ) {

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