export default class Icon {
  constructor () {

  }

  initButtonMesh (data) {
    let mesh = null,
        finalMesh = null,
        color = data.color || 0x404040,
        geom = new THREE.BoxGeometry(16, 132, 132),
        mat = new THREE.MeshPhongMaterial({color: color, fog: false}),
        finalGeom = new THREE.Geometry();
        x = 2;

    while (x > 0) {
      mesh = new THREE.Mesh(geom);
      mesh.position.set(-66+(x>1?132:0), 0, 0);
      mesh.updateMatrix();
      finalGeom.merge(mesh.geometry, mesh.matrix);
      x --;
    }
    x = 2;
    while (x > 0) {
      mesh = new THREE.Mesh(geom);
      mesh.position.set(0, -66+(x>1?132:0), 0);
      mesh.updateMatrix();
      finalGeom.merge(mesh.geometry, mesh.matrix);
      x --;
    }

    mesh.add(new THREE.Mesh(finalGeom, mat));
    return mesh;
  }
}
