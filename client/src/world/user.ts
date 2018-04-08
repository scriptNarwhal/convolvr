import Entity from '../core/entity'

let THREE = (window as any).THREE;

export default class User {
  public id: number
  public hands: any[]
  public data: any
  public hud: any
  public cursor: any
  public name: string
  public toolbox: any
  public mesh: any
  public velocity: any
  public gravity: number
  public falling: any
  public avatar: any

  constructor ( data: any ) {
    this.id = data ? data.id : -Math.floor(Math.random()*99999999)
    this.hands = []
    this.data = data ? data.data : {}
    this.hud = null
    this.cursor = null
    this.name = data ? data.name : "Human_"+this.id
    this.toolbox = null
    this.mesh = new THREE.Object3D()
    this.velocity = new THREE.Vector3(0, -0.0001, 0)
    this.gravity = 1
    this.falling = true
    this.avatar = false 
  }

  useAvatar ( avatar: Entity ) {
    if ( this.avatar ) {
      this.mesh.parent.remove( this.mesh )
    }

    this.avatar = avatar
    this.mesh = avatar.mesh
    this.hands = avatar.componentsByAttr.hand
  }

}
