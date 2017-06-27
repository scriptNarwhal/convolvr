export default class Component {

  constructor ( data, entity, systems, appConfig = false, parent = false ) {

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
      this._compPos = new THREE.Vector3()

      if ( parent ) {

        this.parent = parent

      }

      if ( !!! props ) {

        console.warn("Component must have props")
        this.props = props = {}

      }

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
        nonMerged = [],
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

        comp = new Component( components[ c ], entity, systems, {mobile}, this ) // use simpler shading for mobile gpus

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

          nonMerged.push( comp.mesh )

        }

        this.allComponents.push( comp )
        c ++
    }
    
    if ( s > 0 ) {

      combined = new THREE.Mesh( base, materials ) //new THREE.MultiMaterial( materials ) )
      combined.userData = {
        compsByFaceIndex: this.compsByFaceIndex,
        component: this,
        entity
      }
      this.mesh.add( combined )

    } else {

      while ( s < nonMerged.length ) { // these might thow things off /wrt face index / ray casting

          this.mesh.add( nonMerged[ s ] )
          s ++

      }

    }

    this.mesh.userData.compsByFaceIndex = this.compsByFaceIndex     

  }

  getClosestComponent( position, recursive = false ) {
 
    let compPos = this._compPos, 
        entMesh = this.mesh,
        worldCompPos = null,
        distance = 200000,
        newDist = 0,
        closest = null;

    parentMesh.updateMatrixWorld()
    this.allComponents.map( component => {

      if ( !! component.merged ) {

        return false

      }

      compPos.setFromMatrixPosition( component.mesh.matrixWorld ) // get world position
      newDist = compPos.distanceTo( position )

      if ( newDist < distance ) { 

        distance = newDist
        closest = component

      }

    })

    if ( !!!closest ) {

      distance = 200000
      newDist = 0
      this.combinedComponents.map( component => {
        console.log("From Component: ")
        compPos.fromArray( component.data.position ); console.log("compPos", compPos)
        worldCompPos = parentMesh.localToWorld( compPos ); console.log("worldCompPos", worldCompPos )
        newDist = worldCompPos.distanceTo( position ); console.log("newDist", newDist)
        
        if ( newDist < distance ) {  

          distance = newDist
          closest = component

        }

      })

    }
    !!closest && console.log(closest.props.geometry.size, closest, closest.entity)
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
