export default class Component {

  constructor ( data, entity, systems, config = false, parent = false ) {

      let quaternion = data.quaternion ? data.quaternion : false,
          position = data.position ? data.position : [ 0, 0, 0 ],
          path = config && config.path ? config.path : [],
          attrs = data.attrs,
          mesh = null,
          pl = path.length,
          p = 0
          
      this.index = config.index ? config.index : 0
      this.path = []

      while ( p < pl ) {
        this.path.push( path[ p ] )
        p += 1
      }
      
      this.entity = entity
      this.data = data
      this.attrs = data.attrs || {}
      this.state = {}
      this.components = data.components || []
      this.compsByFaceIndex = []
      this.allComponents = []
      this.combinedComponents = []
      this.lastFace = 0
      this.detached = false
      this.merged = false
      this.isComponent = true
      this._compPos = new THREE.Vector3()
      this.parent = parent ? parent : null

      if ( !!! attrs ) {
        this.attrs = attrs = {} 
        console.warn("Component must have attrs")
      }

      if ( attrs.geometry == undefined ) {
        attrs.geometry = {
          shape: "box",
          size: [ 0.333, 0.333, 0.333 ]
        }
      } else if ( attrs.geometry.merge === true ) {
          this.merged = true
      }

      if ( attrs.material == undefined )
        attrs.material = {
          name: 'wireframe',
          color: 0xffffff
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

      if ( this.attrs.hand != undefined )
        this.detached = true

      this.components.length > 0 && this.initSubComponents( this.components, entity, systems, config )
  }

  initSubComponents( components, entity, systems, config ) {
    let base = new THREE.Geometry(),
        three = window.three,
        mobile = !!config ? config.mobile : three.world.mobile,
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
        s = 0;

    this.lastFace = 0
        
    while ( c < ncomps ) {
        comp = new Component( components[ c ], entity, systems, { mobile, path: this.path.concat([c]), index: c }, this ) // use simpler shading for mobile gpus

        if ( comp.attrs.noRaycast === true )
          addToOctree = false
      
        compMesh = comp.mesh

        if ( comp.attrs.geometry ) { // this keeps happening.. arrays are geometrically filling up too quickly
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
    
    if (s > 0) {
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
        parentMesh = this.parent ? this.parent.mesh : false,
        worldCompPos = null,
        distance = 0.0900,
        newDist = 0,
        closest = null;

    parentMesh && parentMesh.updateMatrixWorld()
    this.allComponents.map( component => {

      if ( !! component.merged ) return false

      compPos.setFromMatrixPosition( component.mesh.matrixWorld ) // get world position
      newDist = compPos.distanceTo( position )

      if ( newDist < distance ) { 
        distance = newDist
        closest = component
      }

    })

    if ( !!!closest ) {

      distance = 0.0900
      newDist = 0
      this.combinedComponents.map( component => {
        console.log("Finding Combined Component: ")
        compPos.fromArray( component.data.position ); console.log("compPos", compPos)
        if ( parentMesh ) {
          worldCompPos = parentMesh.localToWorld( compPos ); console.log("worldCompPos", worldCompPos )
        } else {
          worldCompPos = new THREE.Vector3().fromArray(this.entity.position).add( compPos )
        }
        newDist = worldCompPos.distanceTo( position ); console.log("newDist", newDist)
        
        if ( newDist < distance ) {  
          distance = newDist
          closest = component
        }

      })
    }
    !!closest && console.log(closest.attrs.geometry.size, closest, closest.entity)
    return closest
  }

  getComponentByFace ( face ) {
    let component = false

    this.compsByFaceIndex.forEach(( comp ) => {
      if ( face >= comp.from && face <= comp.to )
        component = comp.component

    })

    return component
  }

}
