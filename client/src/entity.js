 import { 
  GRID_SIZE,
  API_SERVER
 } from './config'
import Component from './component'
import axios from 'axios'

export default class Entity {

  constructor ( id, components, position, quaternion, voxel, name, tags ) {

      let world = window.three.world

      if ( id == -1 ) {
        world && world.systems.assets.autoEntityID()
      }

      this.id = id
      this.components = components || []
      this.position = position ? position : false
      this.quaternion = quaternion ? quaternion : false
      this.mesh = null
      this.boundingRadius = 0.5 // set in init()
      this.componentsByProp = {} // arrays are defined here with key of prop
      this.compsByFaceIndex = [] // possibly deprecated
      this.allComponents = []
      this.combinedComponents = []
      this.voxel = voxel ? voxel : this.getVoxel( true )
      this.oldCoords = [ ...this.voxel ]
      this.name = name || `entity${this.id}:${this.voxel.join("x")}`
      this.lastFace = 0
      this._compPos = new THREE.Vector3()
      this.tags = tags ? tags : [];
      this.handlers = {
        init: [],
        update: [],
        save: [],
        addToVoxel: [],
        removeFromVoxel: []
      }
  }

  serialize( ) {
    return {
      id: this.id,
      name: this.name,
      components: this.components,
      position: this.position,
      quaternion: this.quaternion,
      voxel: this.voxel,
      tags: this.tags,
      boundingRadius: this.boundingRadius
    }
  }

  update( position, quaternion = false, components, component, componentPath, config = {} ) {
    let entityConfig = Object.assign({}, config, { updateWorkers: true } )

    if ( !! componentPath ) {
      this.updateComponentAtPath( component, componentPath )
      this.init( this.anchor, entityConfig )
    }
    if ( !! components ) {
      this.components = components
      this.init( this.anchor, entityConfig )
    }
    if ( position ) {
      if ( !! position ) {
        this.position = position
        this.mesh.position.fromArray( position )
      }
      if ( !!quaternion ) {
        this.quaternion = quaternion
        this.mesh.quaternion.fromArray( quaternion )  
      }
      this.updateWorkers(
        "update-telemetry", 
        three.world.systems, 
        {
          oldCoords: this.oldCoords
        }
      )
      this.updateOldCoords()
    }

    this.mesh.updateMatrix()
    this.callHandlers("update")
  }

  addHandler(type: string, handler: Function): void {
    this.handlers[ type ].push( handler );
  }

  callHandlers(type: string): void {
    let ent = this;

    this.handlers[ type ].forEach( handler => {
      handler( ent )
    })
  }

  addTag(tagName: string): void {
    if (!this.hasTag(tagName)) {
      this.tags.push(tagName);
    }
  }

  removeTag(tagName: string): void {
    let tagIndex = this._getTagIndex(tagName)
    if (tagIndex > -1) {
      this.tags.splice(tagIndex, 1);
    }
  }

  hasTag(tagName: string): boolean {
    return this._getTagIndex(tagName) > -1;
  }

  _getTagIndex(tagName: string) {
    return this.tags.indexOf(tagName);
  }

  reInit( ) {
    this.init( this.parent, { updateWorkers: true } )
  }

  init( parent, config = {}, callback ) {
    let mesh = new THREE.Object3D(),
        base = new THREE.Geometry(),
        three = window.three,
        world = three.world,
        systems = world.systems,
        mobile = world.mobile,
        ncomps = this.components.length,
        nonMerged = [],
        dimensions = [0, 0, 0],
        compMesh = null,
        compGeom = null,
        compRadius = 0.5,
        materials = [],
        addToOctree = true,
        workerUpdate = "",
        updateVoxel = false,
        comp = null,
        face = 0,
        faces = null,
        toFace = 0,
        c = 0,
        s = 0

    this.lastFace = 0
    this.componentsByProp = {} // reset before (re)registering components 
    this.allComponents = []
    
    if ( this.mesh != null ) {

      world.octree.remove( this.mesh )

      if ( this.anchor ) {
        this.anchor.remove( this.mesh )
      } else {
        three.scene.remove( this.mesh )
      }

      this.removeFromVoxel( this.voxel )
      workerUpdate = !! config && config.updateWorkers ? "update" : workerUpdate

    } else {
      workerUpdate = !! config && config.updateWorkers ? "add" : workerUpdate
    }

    this.anchor = parent 
    
    if ( this.components.length == 0 ) {
      console.warn("Entity must have at least 1 component")
      return false
    }

    while ( c < ncomps ) {

        comp = new Component( this.components[ c ], this, systems, { mobile, index: c, path: [ c ] } ) // use simpler shading for mobile gpus
        compMesh = comp.mesh
        if ( !!!compMesh || !!!compMesh.geometry.computeBoundingSphere ) { 
          console.error("no geometry; aborting", c, this) 
        }
 
        compMesh.geometry.computeBoundingSphere() // check bounding radius
        compRadius = compMesh.geometry.boundingSphere.radius 
        dimensions = [
          Math.max( dimensions[ 0 ], Math.abs( compMesh.position.x ) + compRadius ),
          Math.max( dimensions[ 1 ], Math.abs( compMesh.position.y ) + compRadius ), 
          Math.max( dimensions[ 2 ], Math.abs( compMesh.position.z ) + compRadius )
        ]

        if ( comp.props.geometry ) {

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

        } else if ( !comp.detached ) {
          nonMerged.push( comp.mesh )
        }

        this.allComponents.push( comp )
        c += 1
    }

    addToOctree = this.componentsByProp.terrain != true && this.componentsByProp.noRaycast != true
    this.boundingRadius = Math.max( dimensions[0], dimensions[1], dimensions[2] )
    this.boundingBox = dimensions
    !! workerUpdate && this.updateWorkers( workerUpdate, systems )

    if ( s > 0 ) {
      mesh = new THREE.Mesh( base, materials )
    } else {
      mesh = nonMerged[ 0 ] // maybe nest inside of Object3D ?
    }

    if (!mesh) {
      console.warn("entity mesh failed to generate", this)
      return
    }

    if ( world.settings.shadows > 0 ) {
      mesh.castShadow = true
      mesh.receiveShadow = true
    }

    s = 1

    while ( s < nonMerged.length ) {
        mesh.add( nonMerged[ s ] )
        s ++
    }

    if ( !! this.quaternion && (!config.ignoreRotation || this.components.length == 1) )
        mesh.quaternion.fromArray( this.quaternion )

    !! this.position && mesh.position.fromArray( this.position )

    mesh.userData = { 
      entity: this,
      compsByFaceIndex: this.compsByFaceIndex
    }

    addToOctree && world.octree.add( mesh )
    parent.add( mesh )
    this.mesh = mesh

    if ( (!!!config || !!!config.noVoxel) && addToOctree )
      this.addToVoxel( this.voxel, mesh )

    
    mesh.matrixAutoUpdate = false
    mesh.updateMatrix()
    !! callback && callback( this )
    this.callHandlers("init")
    return this
  }

  save ( oldVoxel = false ) {
    if ( oldVoxel !== false ) {
      this.saveUpdatedEntity( oldVoxel )
    } else {
      this.saveNewEntity()
    }
    this.callHandlers("save")
  }
    
  saveNewEntity () {
    let data = this.serialize()

    axios.put(
      `${API_SERVER}/api/import-to-world/${three.world.name}/${this.voxel.join("x")}`,
       data
    ).then( response => {
      console.info("Entity Saved", this)
    }).catch(response => {
      console.error("Entity failed to save", response)
    })
  }
    
  saveUpdatedEntity ( oldVoxel ) {
    let data = this.serialize()
    console.info("save", data)
    console.log("oldVoxel", oldVoxel, "newVoxel", this.voxel)
    axios.put(
      `${API_SERVER}/api/update-world-entity/${three.world.name}/${this.voxel.join("x")}/${oldVoxel.join("x")}`,
       data
    ).then( response => {
      console.info("Entity Updated", this)
    }).catch( response => {
      console.error("Entity failed to send update", response)
    })   
  }

  getVoxel ( initial, check ) {
    let position = null,
        coords = null

    if (initial) {
      position = this.mesh != null ? this.mesh.position.toArray() : this.position
      coords = [Math.floor( position[ 0 ] / GRID_SIZE[ 0 ] ), 0, Math.floor( position[ 2 ] / GRID_SIZE[ 2 ] )]
    } else {
      coords = this.voxel
    }        
    if (check) {
      if (this.voxel[0] != coords[0] || this.voxel[1] != coords[1] || this.voxel[2] != coords[2]) {
        this.onVoxelChanged(coords)
      }
    }
    this.voxel = coords
    return coords
  }

  onVoxelChanged () {

  }

  updateOldCoords () {
    this.oldCoords = [ ...this.voxel ]
  }

  addToVoxel ( coords, mesh ) {
    let ent = this;

    this.getVoxelForUpdate( coords, addTo => { 
      addTo.meshes.push( mesh ) 
      addTo.entities.push( ent )
    })
    this.callHandlers("addToVoxel")
  }

  removeFromVoxel ( coords, mesh ) {
    let removeFrom = this.getVoxelForUpdate( coords ),
        ent = this;

    removeFrom.entities.splice( removeFrom.entities.indexOf( ent ), 1)
    removeFrom.meshes.splice( removeFrom.meshes.indexOf( mesh ), 1 )
    this.callHandlers("removeFromVoxel")
  }

  getVoxelForUpdate ( coords, callback ) {
    let world = window.three.world,
        thisEnt = this,
        systems = world.systems,
        terrain = systems.terrain,
        voxel = terrain.voxels[ coords.join(".") ];

    if ( !!! voxel) { console.warn("voxel not loaded")
     voxel = terrain.loadVoxel( coords, callback )
    } else if (typeof voxel != 'boolean' ) {
      callback && callback( voxel )
    } else {

      setTimeout( ()=> {

        let voxel = terrain.voxels[ coords.join(".") ]
        if ( typeof voxel === 'object' ) {
          callback( voxel )
        } else {
          terrain.loadVoxel( coords, callback )
        }
      }, 600)
    }

    return voxel

  }

  // refactor to return instantiated component
  getComponentByPath ( path, pathIndex, components = false ) {
    let foundComponent = null

    if ( components == false )
      components = this.components

    if ( pathIndex + 1 < path.length ) {
      foundComponent = this.getComponentByPath( path, pathIndex + 1, components[ path[ pathIndex ] ].components )
    } else {
      foundComponent = components[ path[ pathIndex ] ]
    }
  }

  updateComponentAtPath ( component, path, pathIndex = 0, components = false, resetState = false ) {
    let oldState = {},
        sanitizedState = {}

    console.log( "update component at path", component, path, pathIndex, components )

    if ( components == false )
      components = this.components

    if ( pathIndex + 1 < path.length ) {
      this.updateComponentAtPath( component, path, pathIndex + 1, components[ path[ pathIndex ] ].components )
    } else {

      if ( resetState == false ) {

        if ( this.allComponents.indexOf()) {
          oldState = this.allComponents[ path[ pathIndex ] ].state
        } else {
          console.warn( "Error finding component state", path, pathIndex, path[ pathIndex ], this.allComponents )
        }

        if ( oldState.tool || oldState.toolUI )
          sanitizedState = { tool: {}, toolUI: {} }
        
        component.state = Object.assign({}, oldState, component.state || {}, sanitizedState )
      }

      if ( component.data ) {
        components[ path[ pathIndex ] ] = component.data
      } else {
        components[ path[ pathIndex ] ] = component
      }
    }   
  }

  updateWorkers ( mode, systems, config = {} ) {
    let entityData = {
        id: this.id,
        components: this.components,
        position: this.position,
        quaternion: this.quaternion,
        boundingRadius: this.boundingRadius,
        boundingBox: this.boundingBox
      },
      message = ""

    if ( mode == "add" ) {
      message = JSON.stringify({
        command: "add entity",
        data: {
          coords: this.voxel,
          entity: entityData
        }
      })
      systems.staticCollisions.worker.postMessage( message )
      //systems.oimo.worker.postMessage( message )
    } else if ( mode == "update") {
      message = JSON.stringify({
        command: "update entity",
        data: { 
          entityId: this.id,
          coords: this.voxel,
          entity: entityData
        }
      })
      systems.staticCollisions.worker.postMessage( message )
      //systems.oimo.worker.postMessage( message )
    } else if ( mode == "update-telemetry" ) {
      message = JSON.stringify({
        command: "update telemetry",
        data: {
          entityId: this.id,
          coords: this.voxel,
          oldCoords: config.oldCoords,
          position: entityData.position,
          quaternion: entityData.quaternion
        } 
      })
    }
  }

  getClosestComponent( position, recursive = true ) {
    let compPos = this._compPos, 
        entMesh = this.mesh,
        worldCompPos = null,
        distance = 0.0900,
        newDist = 0,
        closest = null,
        closestSubComp = null;

    entMesh.updateMatrixWorld()
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

      distance = 0.0900
      newDist = 0
      this.combinedComponents.map( component => {
        if ( component.data ) {
          compPos.fromArray( component.data.position )
          worldCompPos = entMesh.localToWorld( compPos )
          newDist = worldCompPos.distanceTo( position ) //console.log("compPos", compPos, "worldCompPos", worldCompPos, "newDist", newDist)
          
          if ( newDist < distance ) {  
            distance = newDist
            closest = component
          }
        }
      })
    }

    if ( !!closest && recursive && closest.components.length > 1 ) {
      closestSubComp = closest.getClosestComponent( position )
      closest = !!closestSubComp ? closestSubComp : closest
    }
    return closest
  }

  getComponentByFace ( face ) {
    let component = false

    this.compsByFaceIndex.forEach((comp) => {
      if ( face >= comp.from && face <= comp.to ) {
        component = comp.component
      } 
    })

    return component
  }
}
