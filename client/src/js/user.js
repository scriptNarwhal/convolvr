export let initUser = () => {
 return {
     id: Math.floor(Math.random()*99999999),
     hands: [],
     hud: null,
     cursor: null,
     name: "Human",
     toolbox: null,
     mesh: new THREE.Object3D(),
     velocity: new THREE.Vector3(0, -10, 0),
     light: new THREE.PointLight(0xffffff, 0.15, 200000),
     gravity: 1,
     falling: true
 }
}
