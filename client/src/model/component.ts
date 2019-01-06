import * as THREE from 'three';

import Entity from "./entity";
import Binding from './binding';
import Property from "./property";
import { Attributes, AttributeName } from './attribute';
import { AnyObject } from '../util';
import AssetSystem from '../systems/core/assets';
import { Vector3 } from 'three';
import Systems from '../systems';

export type NameOrId = string|number;
export type EntityPath = [string, NameOrId];
export type ComponentPath = [string, NameOrId, NameOrId|NameOrId[]];

export type DBComponent = {
  id?:         number
  name?:       string
  class?:      string
  components?: DBComponent[]
  position?:   number[]
  quaternion?: number[]
  attrs?:      Attributes
  props?:      { [key: string]: Property }
  state?:      { [key: string]: AnyObject }
  tags?:       string[]
}

export default class Component {

  public entity:             Entity
  public mesh:               any
  public attrs:              Attributes
  public props:              { [key: string]: any }
  public state:              { [key: string]: any }
  public bindings:           Binding[]
  public components:         DBComponent[]
  public compsByFaceIndex:   any[]
  public allComponents:      Component[]
  public combinedComponents: Component[]
  public data:               any
  public parent:             Component | null //| Entity | null
  public index:              number
  public path:               number[]
  public lastFace:           number;
  public detached:           boolean;
  public merged:             boolean;
  public isComponent:        boolean;
  private _compPos:          any;


  constructor (data: DBComponent, entity: Entity, systems: Systems, config: any = false, parent?: Component | null) {
      this.init(systems, data, entity, config, parent)
  }

  public reInit(systems: Systems, data: DBComponent = {}, config?: any, parent?: Component | null) {
    if (this.mesh && this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
    this.init(systems, this.data ? {...this.data, ...data} : data, this.entity, config, this.parent)
    this.parent.mesh.add(this.mesh);
  }

  private init(systems: Systems, data: DBComponent, entity?: Entity, config?: any, parent?: Component | null) {
    let quaternion,
          position,
          path = config && config.path ? config.path : [],
          attrs: Attributes,
          mesh = null,
          pl = path.length,
          p = 0
          
      this.index = this.index || config && config.index ? config.index : 0
      this.path = []

      while ( p < pl ) {
        this.path.push( path[ p ] )
        p += 1
      }
      
      /**
       * Templated Components
       */
      if (data.class) {
        data = systems.assets.makeComponent(data.class, data); 
      }

      data.components =  data.components || []
      attrs = data.attrs;
      quaternion = data.quaternion ? data.quaternion : null;
      position = data.position ? data.position : [ 0, 0, 0 ];

      this.entity = entity
      this.data = data
      this.attrs = attrs || this.attrs || {}
      this.state = {}
      this.components = data.components
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
        this.attrs = attrs = {} ;
        console.warn("Component must have attributes");
      }

      if ( attrs.geometry == undefined ) {
        attrs.geometry = {
          shape: "box",
          size: [ 0.333, 0.333, 0.333 ]
        }
      } else if ( attrs.geometry.merge === true ) {
          this.merged = true
      }

      if ( attrs.material == undefined ) {
        attrs.material = {
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

      !! quaternion && mesh.quaternion.fromArray(quaternion);
      mesh.position.fromArray(position);
      mesh.updateMatrix()

      if ( this.attrs.hand != undefined )
        this.detached = true

      this.components.length > 0 && this.initSubComponents( this.components, entity, systems, config )
  }
  
  private initSubComponents(components: any[], entity: Entity, systems: any, config: { [key:string]: any } ): void {
    let base = new THREE.Geometry(),
        three = (window as any).three,
        mobile = !!config ? config.mobile : three.world.mobile,
        ncomps = components.length,
        nonMerged = [],
        compMesh = null,
        materials = [],
        // addToOctree = true,
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

        // if ( comp.attrs.noRaycast === true )
        //   addToOctree = false
      
        compMesh = comp.mesh

        if ( comp.attrs.geometry ) { // this keeps happening.. arrays are geometrically filling up too quickly
          faces = compMesh.geometry.faces
          face = faces.length-1
          toFace = this.lastFace + face
          this.compsByFaceIndex.push({
            component: comp,
            from: this.lastFace,
            to: toFace
          });  
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
      combined = new THREE.Mesh( base, materials );
      combined.userData = {
        compsByFaceIndex: this.compsByFaceIndex,
        component: this,
        entity
      }
      this.mesh.add( combined )
    } else {
      while ( s < nonMerged.length ) { // these might thow things off /wrt face index / ray casting
          this.mesh.add( nonMerged[ s ] );
          s ++;
      }
    }
    this.mesh.userData.compsByFaceIndex = this.compsByFaceIndex     
  }

  private updateBindings(properties: {[propName: string]: Property}) {
    for (let binding of this.bindings) {
      if (binding.name in properties) {
        binding.update();
      }
    }
  }

  public setProps(props: {[propName: string]: Property}): void {
    for (let prop in props) {
      this.props[prop as any] = props[prop]; 
    }
    this.updateBindings(props);
  }

  public getBindingByName(name: string): Binding | boolean {
    for (let binding of this.bindings) {
      if (binding.name == name) {
        return binding;
      }
    }
    return false;
  }

  public getClosestComponent(position: Vector3, recursive = false): Component  {
    let compPos = this._compPos, 
        entMesh = this.mesh,
        parentMesh = this.parent ? this.parent.mesh : false,
        worldCompPos = null,
        distance = 0.0900,
        newDist = 0,
        closest: Component | null = null;

    parentMesh && parentMesh.updateMatrixWorld()
   // this.allComponents.map( component => {
   for (let c = 0, cl = this.allComponents.length; c < cl; c++) {
     const component = this.allComponents[c];
      if ( !! component.merged ) return null

      compPos.setFromMatrixPosition( component.mesh.matrixSpace ) // get world position
      newDist = compPos.distanceTo( position )

      if ( newDist < distance ) { 
        distance = newDist
        closest = component
      }

    }

    if ( !!!closest ) {

      distance = 0.0900
      newDist = 0

      for (let c = 0, cl = this.combinedComponents.length; c > cl; c++) {
        const component = this.combinedComponents[c];
        console.log("Finding Combined Component: ");
        compPos.fromArray( component.data.position ); console.log("compPos", compPos)
        if ( parentMesh ) {
          worldCompPos = parentMesh.localToWorld( compPos ); console.log("worldCompPos", worldCompPos )
        } else {
          worldCompPos = new THREE.Vector3().fromArray(this.entity.position || [0,0,0]).add( compPos )
        }
        newDist = worldCompPos.distanceTo( position ); console.log("newDist", newDist)
        
        if ( newDist < distance ) {  
          distance = newDist
          closest = component
        }

      }
    }
    !!closest && console.log(closest.attrs.geometry.size, closest, closest.entity)
    return closest
  }

  public getComponentByFace(face: number): Component | boolean {
    let component: any = false

    this.compsByFaceIndex.forEach(( comp ) => {
      if ( face >= comp.from && face <= comp.to )
        component = comp.component

    })
    return component
  }
}
