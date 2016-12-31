export default class Tool {
    constructor (data, world) {

    }
    
    equip (hand) {
      if (this.mesh == null) {
        let toolMesh = this.initMesh(this.data)
        this.world.user.mesh.add(toolMesh)
        toolMesh.position.set(1500-(2500*hand), -250, -1350)
        // add to respective hand (when implemented)
      } else {
        this.mesh.visible = true;
      }
    }

    unequip (hand) {
      if (this.mesh != null) {
        this.mesh.visible = false;
      }
    }
}
