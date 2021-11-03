import * as THREE from 'three';
export default function (zone) {
    let all_boxs = [];
    let zShelves = zone.shelves;
    // 선반 두께
    let thickness = 0.1;
    // 선반 그룹
    let shelves = new THREE.Group();
    // 선반 재료
    let material = new THREE.MeshLambertMaterial({ color: 0x4169E1 }); // 색상
    // 첫번째 그리드의 x축 중심 위치
    let boardStartX = zShelves.x - zone.width / 2 + zShelves.width / 2 + 0.1;
    
    // 레이어 생성
    for (let i = 0; i <= zShelves.rowNum; i++) {
        
        // 각 선반의 Y축 중심위치
        let rowY = zShelves.y + thickness / 2 + zShelves.height * i;
        // 모든 그리드 생성
        for (let j = 0; j < zShelves.columnNum; j++) {
            
            // X축을 따른 수평 
            let trestleGeoV = new THREE.BoxBufferGeometry(zShelves.width, thickness, thickness);
            // Y축을 따른 수직 
            let trestleGeo = new THREE.BoxBufferGeometry(thickness, zShelves.height, thickness);
            // 재고박스의 y축 중심
            let trestleY = rowY + zShelves.height / 2;
            // 수평 브래킷 및 화물의 x축 중심 위치
            let boardX = boardStartX + zShelves.width * j;
            // 상v
            
            let mesh = new THREE.Mesh(trestleGeoV, material);
            // mesh.position.set(zShelves.x - zShelves.width/2 + thickness - thickness/2, rowY, boardZ);
            mesh.position.set(boardX, rowY, zShelves.z - zShelves.depth / 2 + thickness / 2);
            shelves.add(mesh);
            // 하v
            mesh = new THREE.Mesh(trestleGeoV, material);
            // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, rowY, boardZ);
            mesh.position.set(boardX, rowY, zShelves.z + zShelves.depth / 2 - thickness / 2);
            shelves.add(mesh);
            // 중x1
            let trestleGeoH = new THREE.BoxBufferGeometry(thickness, thickness, zShelves.depth);
            mesh = new THREE.Mesh(trestleGeoH, material);
            // mesh.position.set(zShelves.x, rowY, boardZ - zShelves.depth/4 + thickness/2);
            mesh.position.set(boardX - zShelves.width / 4 + thickness / 2, rowY, zShelves.z);
            
            shelves.add(mesh);
            // 중x2
            mesh = new THREE.Mesh(trestleGeoH, material);
            // mesh.position.set(zShelves.x, rowY, boardZ + thickness/2);
            mesh.position.set(boardX + thickness / 2, rowY, zShelves.z);
            shelves.add(mesh);
            // 중x3
            mesh = new THREE.Mesh(trestleGeoH, material);
            // mesh.position.set(zShelves.x, rowY, boardZ + zShelves.depth/4 + thickness/2);
            mesh.position.set(boardX + zShelves.width / 4 + thickness / 2, rowY, zShelves.z);
            shelves.add(mesh);
            // 전x
            mesh = new THREE.Mesh(trestleGeoH, material);
            // mesh.position.set(zShelves.x, rowY, boardZ + zShelves.depth/2 - thickness/2);
            mesh.position.set(boardX + zShelves.width / 2 - thickness / 2, rowY, zShelves.z);
            shelves.add(mesh);
            
            // 마지막 레이어에 수직 브래킷을 추가할 필요가 없음
            if (i !== zShelves.rowNum) {
                // 첫 번째 그리드에서 2개의 추가 기둥 + 수평 브래킷 추가
                if (j === 0) {
                    // 좌v
                    let mesh = new THREE.Mesh(trestleGeo, material);
                    // mesh.position.set(zShelves.x - zShelves.width/2 + thickness/2, trestleY, boardZ - zShelves.depth/2 + thickness/2);
                    mesh.position.set(boardX - zShelves.width / 2 + thickness / 2, trestleY, zShelves.z - zShelves.depth / 2 + thickness / 2);
                    shelves.add(mesh);
                    // 우v
                    mesh = new THREE.Mesh(trestleGeo, material);
                    // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, trestleY, boardZ - zShelves.depth/2 + thickness/2);
                    mesh.position.set(boardX - zShelves.width / 2 + thickness / 2, trestleY, zShelves.z + zShelves.depth / 2 - thickness / 2);
                    shelves.add(mesh);
                    // 전x
                    let trestleGeoH = new THREE.BoxBufferGeometry(thickness, thickness, zShelves.depth);
                    mesh = new THREE.Mesh(trestleGeoH, material);
                    // mesh.position.set(zShelves.x, rowY, boardZ - zShelves.depth/2 + thickness/2);
                    mesh.position.set(boardX - zShelves.width / 2 + thickness / 2, rowY, zShelves.z);
                    shelves.add(mesh);
                }
                // 박스추가
                let randomNumber = Math.floor(Math.random()*10); 
                let boxMat;
                if(randomNumber<1){
                    randomNumber=1;
                    boxMat = new THREE.MeshLambertMaterial({ color: 0xe57470 }); // 박스 색상
                }else if(randomNumber<2){
                    randomNumber=2;
                    boxMat = new THREE.MeshLambertMaterial({ color: 0xDda450 }); // 박스 색상
                }else{
                    randomNumber=3;
                    boxMat = new THREE.MeshLambertMaterial({ color: 0xffcc99 }); // 박스 색상
                }
                let boxGeo = new THREE.BoxBufferGeometry(1, 0.8, 1); // 박스 크기
                let boxMesh = new THREE.Mesh(boxGeo, boxMat);
                // boxMesh.position.set(zShelves.x + zShelves.width/2 - 0.8 - thickness/2, rowY + 0.45, boardZ + zShelves.depth/2 - thickness/2 - 1);
                boxMesh.position.set(boardX + zShelves.width / 2 - thickness / 2 - 1, rowY + 0.45, zShelves.z + zShelves.depth / 2 - 0.8 - thickness / 2);
                boxMesh.shelf = {
                    name: zone.name
                }
                boxMesh.box = {
                    rowIndex: i + 1, // 행
                    colIndex: j + 1, // 열
                    status: randomNumber
                }
            
                // boxMesh.receiveShadow = true;
                // boxMesh.castShadow = true;
                all_boxs.push(boxMesh)
                shelves.add(boxMesh);
                // 각 그리드는 2개의 수직 지지 기둥(0.1*0.1*1)
                let mesh = new THREE.Mesh(trestleGeo, material);
                // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, trestleY, boardZ + zShelves.depth/2 - thickness/2);
                mesh.position.set(boardX + zShelves.width / 2 - thickness / 2, trestleY, zShelves.z + zShelves.depth / 2 - thickness / 2);
                shelves.add(mesh);
                mesh = new THREE.Mesh(trestleGeo, material);
                // mesh.position.set(zShelves.x - zShelves.width/2 + thickness/2, trestleY, boardZ + zShelves.depth/2 - thickness/2);
                mesh.position.set(boardX + zShelves.width / 2 - thickness / 2, trestleY, zShelves.z - zShelves.depth / 2 + thickness / 2);
                shelves.add(mesh);
            }
        }
    }
    // 기호의 길이, 너비 및 높이
    // 타블렛의 시작 위치
    // shelves.position.set(zShelves.x, zShelves.y, zShelves.z);
    let flagGeo = new THREE.BoxBufferGeometry(0.01, 0.8, 1.2);
    let flatMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // 왼쪽 화이트보드
    let mesh = new THREE.Mesh(flagGeo, flatMat);
    // mesh.position.set(zShelves.x, zShelves.height, boardZ + zShelves.depth/2);
    mesh.position.set(boardStartX - zShelves.width / 2, zShelves.height, zShelves.z);
    mesh.name = 'flagBoard';
    shelves.add(mesh);
    // 오른쪽 화이트보드
    let boardX = boardStartX + zShelves.width * (zShelves.columnNum - 1);
    mesh = new THREE.Mesh(flagGeo, flatMat);
    // mesh.position.set(zShelves.x, zShelves.height, boardZ + zShelves.depth/2);
    mesh.position.set(boardX + zShelves.width / 2, zShelves.height, zShelves.z);
    mesh.name = 'flagBoard';
    shelves.add(mesh);
    shelves.name = zShelves.name;
    return { shelves, all_boxs };
}