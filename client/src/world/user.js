export default class User {

  constructor ( data ) {

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

  useAvatar ( avatar ) {

    if ( this.avatar ) {
      this.mesh.parent.remove( this.mesh )
    }

    this.avatar = avatar
    this.mesh = avatar.mesh
    this.hands = avatar.componentsByProp.hand

  }

}
