import * as THREE from 'three'
// 변수：객체 길이, 너비, 높이, 위치(x,y,z), 회전(x,y,z)
export default function (width, height, depth, position, rotation) {
    let texture = new THREE.TextureLoader().load('wh/images/floor.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    let floorGeometry = new THREE.BoxGeometry(width, height, depth);
    // let floorMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }); // MeshLambertMaterial不知道为什么加载不出图
    // let floorMaterial = new THREE.MeshBasicMaterial({ color: '0xff00ff' });
    let floorMaterial = new THREE.MeshLambertMaterial({
        color: 0x999999
      });
  
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // 위치
    if (position.x) floor.position.x = position.x;
    if (position.y) floor.position.y = position.y;
    if (position.z) floor.position.z = position.z;
    // 회전
    if (rotation) {
        if (rotation.x) floor.rotation.x = rotation.x;
        if (rotation.y) floor.rotation.y = rotation.y;
        if (rotation.z) floor.rotation.z = rotation.z;
    }
    floor.name = '바닥';
    floor.receiveShadow = true;
    return floor;
}