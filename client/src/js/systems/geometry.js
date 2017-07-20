export default class GeometrySystem {

    constructor (world) {
      this.world = world
      this.nodeGeom = new THREE.PlaneGeometry(1/10000, 1/10000)
    }

    init ( component ) { 

        let prop = component.props.geometry,
            geometry = null,
            size = prop.size,
            assets = this.world.systems.assets,
            geometryCode = prop.shape+':'+size.join(':'),
            faceNormals = false 
        
        if ( assets.geometries[ geometryCode ] == null ) {

          switch (prop.shape) {
            case "node":
              geometry = this.nodeGeom
            break
            case "plane":
              geometry = new THREE.PlaneGeometry( size[0], size[1] )
              faceNormals = true
            break
            case "box":
              geometry = new THREE.BoxGeometry( size[0], size[1], size[2] )
              faceNormals = true
            break
            case "octahedron":
              geometry = new THREE.OctahedronGeometry( size[0], 0 )
            break
            case "sphere":
              geometry = new THREE.OctahedronGeometry( size[0], 3 )
              faceNormals = true
            break
            case "cylinder":
              geometry = new THREE.CylinderGeometry( size[0], size[0], size[1], 14, 1 )
              faceNormals = true
            break
            case "cone":
              geometry = new THREE.ConeGeometry( size[0], size[1], size[2] )
              faceNormals = true
            break
            case "torus":
              geometry = new THREE.TorusGeometry( size[0], 6.3, 5, 12 )
            break
            case "hexagon":
              geometry = new THREE.CylinderGeometry( size[0], size[1], size[2], 6 )
              faceNormals = true
            break
            case "open-box":
              geometry = new THREE.CylinderGeometry( size[0], size[2], size[1], 4, 1, true )
            break
            case "frustum": 
              geometry = new THREE.CylinderGeometry( size[0], size[0] * (2/3), size[0], 4, 1 )
            break
            case "extrude":
              geometry = this._extrudeGeometry( prop )
            break
            case "lathe":
              geometry = this._latheGeometry( prop )
            break
            // define more mappings here..

          }

          if ( faceNormals && (prop.faceNormals === true || prop.faceNormals === undefined )) {

            geometry.computeVertexNormals()

          }
          
          assets.geometries[ geometryCode ] = geometry

        } else {

          geometry = assets.geometries[ geometryCode ] // used cached copy

        }

        return {
          geometry,
          geometryCode
        }

    }

    _extrudeGeometry ( prop ) { // prop.size, shape, settings

      let length = prop.size[2], 
          width = prop.size[0],
          shape = new THREE.Shape()

      if ( prop.shape ) {

        shape.moveTo( prop.shape[0][0], prop.shape[0][1] )

        prop.shape.map( (point, i) => {

          if ( i > 0 ) {

            shape.lineTo( point[ 0 ], point[ 1 ] )
            
          }
           
        })

      } else {

        shape.moveTo( 0,0 )
        shape.lineTo( 0, width )
        shape.lineTo( length, width )
        shape.lineTo( length, 0 )
        shape.lineTo( 0, 0 )

      }
      

      var extrudeSettings = Object.assign({}, {
        steps: 2,
        amount: 16,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
      }, prop.settings || {})

      return new THREE.ExtrudeGeometry( shape, Object.assign({}, extrudeSettings, prop.extrudeSettings) )

    }

    _latheGeometry ( prop ) { // prop.size, shape, settings

      let segments = 8 || prop.segments,
          phiStart = prop.phiStart ? prop.phiStart : 0,
          phiLength = prop.phiLength ? prop.phiLength : 2 * Math.PI,
          propPoints = prop.points,
          points = [],
          p = 0

      if ( !!! propPoints ) {

        propPoints = [
          [15000, 500], 
          [5000, 500],
          [1000, 5000],
          [1000, 2000],
          [5000, 15000],
        ]

      }

      p = propPoints.length -1

      while ( p >= 0 ) {

        points.push( new THREE.Vector2( propPoints[p][0], propPoints[p][1] ) )
        p -= 1
      
      }

      return new THREE.LatheGeometry( points, phiStart, phiLength )

    }

}