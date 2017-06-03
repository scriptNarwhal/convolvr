export default class Component {

  constructor ( data, entity, systems, appConfig = false ) {

      var mesh = null,
          props = data.props,
          quaternion = data.quaternion ? data.quaternion : false,
          position = data.position ? data.position : [ 0, 0, 0 ]
      
      this.entity = entity
      this.data = data
      this.props = data.props || {}
      this.state = {}
      this.components = data.components || []
      this.compsByFaceIndex = []
      this.allComponents = []
      this.combinedComponents = []
      this.lastFace = 0
      this.detached = false
      this.merged = false
      this.compPos = new THREE.Vector3()

      if ( props.geometry == undefined ) {
        props.geometry = {
          shape: "box",
          size: [ 8000, 8000, 8000 ]
        }
      } else {

        if ( props.geometry.merge === true ) {

          this.merged = true

        }

      }

      if ( props.material == undefined ) {
        props.material = {
          name: 'wireframe',
          color: 0xffffff
        }
      }

      mesh = systems.registerComponent( this )
      this.mesh = mesh
      mesh.userData = { 
          component: this,
          entity
      }

      !! quaternion && mesh.quaternion.set( quaternion[0], quaternion[1], quaternion[2], quaternion[3] )

      mesh.position.set( position[0], position[1], position[2] )
      mesh.updateMatrix()

      if ( this.props.hand != undefined ) {

        this.detached = true

      }

      this.components.length > 0 && this.initSubComponents( this.components, entity, systems, appConfig )

  }

  initSubComponents( components, entity, systems, appConfig ) {

    var base = new THREE.Geometry(),
        three = window.three,
        mobile = !!appConfig ? appConfig.mobile : three.world.mobile,
        ncomps = components.length,
        nonStructural = [],
        compMesh = null,
        materials = [],
        addToOctree = true,
        toFace = 0,
        faces = null,
        face = 0,
        comp = null,
        combined = null,
        c = 0,
        s = 0

    this.lastFace = 0
        
   while ( c < ncomps ) {

        comp = new Component( components[ c ], entity, systems, {mobile} ) // use simpler shading for mobile gpus

        if ( comp.props.noRaycast === true ) {
          addToOctree = false
        }

        compMesh = comp.mesh

        if ( comp.props.geometry ) { // this keeps happening.. arrays are geometrically filling up too quickly

          faces = compMesh.geometry.faces
          face = faces.length-1
          toFace = this.lastFace + face
          this.compsByFaceIndex.push({
            component: comp,
            from: this.lastFace,
            to: toFace
          })  
          this.lastFace = toFace

        }

        if ( comp.merged ) {

          this.combinedComponents.push( comp )
          materials.push( compMesh.material )
          compMesh.updateMatrix()

          while ( face > -1 ) {

              faces[ face ].materialIndex = s
              face --

          }

          base.merge( compMesh.geometry, compMesh.matrix )
          s ++

        } else {

          nonStructural.push( comp.mesh )

        }

        this.allComponents.push( comp )
        c ++
    }
    
    if ( s > 0 ) {

      combined = new THREE.Mesh( base, new THREE.MultiMaterial( materials ) )
      combined.userData = {
        compsByFaceIndex: this.compsByFaceIndex,
        component: this,
        entity
      }
      this.mesh.add( combined )

    } else {

      while ( s < nonStructural.length ) { // these might thow things off /wrt face index / ray casting

          this.mesh.add( nonStructural[ s ] )
          s ++

      }

    }

    this.mesh.userData.compsByFaceIndex = this.compsByFaceIndex     

  }

  getClosestComponent( position ) {

    this.mesh.updateMatrixWorld()
 
    let compPos = this.compPos, 
        distance = 200000,
        newDist = 0,
        closest = null;

    this.allComponents.map( component => {

      if ( !! component.merged ) {

        return false

      }

      compPos.setFromMatrixPosition( component.mesh.matrixWorld ) // get world position
      newDist = compPos.distanceTo( position )

      if ( newDist < distance ) {  console.log("comparing component distance ", newDist, distance)

        distance = newDist
        closest = component

      }

    })

    if ( !!!closest ) {

      distance = 200000
      newDist = 0
      this.combinedComponents.map( component => {

        //compPos.fromArray( component.position )
        // apply world transformation
        // implement

      })

    }

    return closest

  }

  getComponentByFace ( face ) {
    
    let component = false

    this.compsByFaceIndex.forEach(( comp ) => {

      if ( face >= comp.from && face <= comp.to ) {

        component = comp.component

      } 

    })

    return component

  }

}
