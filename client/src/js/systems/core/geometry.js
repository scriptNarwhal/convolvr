//import Convolvr from '../../world/world'
//import Component from '../../component'
//import * as THREE from 'three'

export default class GeometrySystem {

  world: Convolvr
  nodeGeom: THREE.PlaneGeometry
  detail: number

  constructor ( world: Convolvr ) {
    this.world = world
    this.nodeGeom = new THREE.PlaneGeometry( 0.001, 0.001, 0.001)
    this.detail = world.settings.geometry
  }

  init ( component: Component ) { 

        let prop:         Object        = component.props.geometry,
            geometry:     Object        = {},
            size:         Array<number> = prop.size,
            assets:       Object        = this.world.systems.assets,
            detail:       Array<number> = prop.detail || [this.detail, this.detail, this.detail],
            geometryCode: string        = `${prop.shape}:${size.join(':')}:${detail.join(':')}`,
            faceNormals:  boolean       = false
        
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
              geometry = new THREE.BoxGeometry( size[0], size[1], size[2], ...detail )
              faceNormals = true
            break
            case "octahedron":
              geometry = new THREE.OctahedronGeometry( size[0], 0 )
            break
            case "sphere":
              geometry = new THREE.OctahedronGeometry( size[0], 1+detail[0] )
              faceNormals = true
            break
            case "cylinder":
              geometry = new THREE.CylinderGeometry( size[0], size[0], size[1], 6 + 6* detail[0], 1 )
              faceNormals = true
            break
            case "open-cylinder":
              geometry = new THREE.CylinderGeometry( size[0], size[0], size[1], 6 + 10 * detail[0], 1, true )
              faceNormals = true
            break
            case "cone":
              geometry = new THREE.ConeGeometry( size[0], size[1], size[2] )
              faceNormals = true
            break
            case "torus":
              geometry = new THREE.TorusGeometry( size[0], 6.3, 5, 6 + detail[0] * 6 )
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

          if ( geometry.computeVertexNormals && faceNormals && (prop.faceNormals === true || prop.faceNormals === undefined )) {
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

    _extrudeGeometry ( prop: Object ) { // prop.size, shape, settings

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
        amount: 160,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 10,
        bevelSegments: 1
      }, prop.settings || {})

      return new THREE.ExtrudeGeometry( shape, Object.assign({}, extrudeSettings, prop.extrudeSettings) )

    }

    _latheGeometry ( prop: Object ) { // prop.size, shape, settings

      let segments = 8 || prop.segments,
          phiStart = prop.phiStart ? prop.phiStart : 0,
          phiLength = prop.phiLength ? prop.phiLength : 2 * Math.PI,
          propPoints = prop.points,
          points = [],
          p = 0

      if ( !!! propPoints ) {

        propPoints = [
          [0.75, 0.01], 
          [0.05, 0.01],
          [0.05, 0.5],
          [0.05, 0.09],
          [0.05, 0.75],
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