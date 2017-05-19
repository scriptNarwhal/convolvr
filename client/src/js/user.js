export default class User {
  constructor (data) {
    this.id = -Math.floor(Math.random()*99999999)
    this.hands = []
    this.hud = null
    this.cursor = null
    this.name = "Human"
    this.toolbox = null
    this.mesh = new THREE.Object3D()
    this.velocity = new THREE.Vector3(0, -10, 0)
    this.light = new THREE.PointLight(0xffffff, 0.15, 200000)
    this.gravity = 1
    this.falling = true
    this.avatar = false
  }
  useAvatar (avatar) {
    this.avatar = avatar
    this.mesh = avatar.mesh
    this.hands = avatar.componentsByProp.hand
    console.log("use avatar", avatar, this.mesh)
  }
}
