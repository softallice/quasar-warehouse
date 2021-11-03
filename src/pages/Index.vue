<template>
  <q-page class="rows">
    <div id="warehouse" ref="wh" >렌더링 전</div>
  </q-page>
</template>

<script>
import { onMounted ,ref } from 'vue';

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import createFloor from "src/use/floor";
import createWall from "src/use/wall";
// import createZone from "src/use/zone";
import createShelves from "src/use/shelves";

import store from 'src/use/useStore'

let dragEleControls = null;
let boxs = [];
let shelves = [];
let INTERSECTED;
let scene = null, // 장면
  camera = null, // 카메라 
  renderer = null, // 렌더러
  controls = null, // 마우스 컨드롤
  mouse = null,
  font = null,
  raycaster = null;

export default {
  name: 'PageIndex',
  setup() {
    let wh = ref(null)

    const init = ( async () => {
      scene = new THREE.Scene();
      // 백그라운드 배경색 설정
      scene.background = new THREE.Color(0xb0c4de);
      
      // 카메라를 만들고 매개변수 설정
      camera = new THREE.PerspectiveCamera(
        45,
        wh.value.clientWidth / wh.value.clientHeight,
        0.1,
        20000
      );
      camera.position.set(-Math.PI * 10, 60, 80);
      camera.focus = 0.1;
      scene.add(camera);
      
      // 렌더러 안티알리아스(라인을 부드럽게)
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.outline = "none";
      renderer.setSize(wh.value.clientWidth, wh.value.clientHeight);

      // 로드 하기전 자식 노드 삭제
      let childNodes = wh.value.childNodes;
      if (childNodes[0]) wh.value.removeChild(childNodes[0]);
      wh.value.appendChild(renderer.domElement);

      // 광원
      initLight();
      // 바닥
      initFloor();
      // 벽
      initWall();
      // 스토어 정보
      initStore();
      // 마우스 컨드롤
      initControls();
      mouse = new THREE.Vector2();
      raycaster = new THREE.Raycaster();
      wh.value.addEventListener("click", handleCLick, false);

      // 렌더링 시작
      animate();
      // 창 크기 변경시 다시 그리기
      window.addEventListener("resize", onWindowResize, false);

      loadGltfShelves();
    })

    const handleCLick = (( event ) => {    

      if (store.state.dragStatus) {
        return;
      }
      event.preventDefault();
      mouse.x = ((event.clientX - wh.value.offsetLeft) / wh.value.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - wh.value.offsetTop) / wh.value.clientHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);

      let intersects = raycaster.intersectObjects(boxs);
      
      if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
          if (INTERSECTED) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
          }

          INTERSECTED = intersects[0].object;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0x4682b4);
          showBoxDetail(INTERSECTED);
        }
      } else {
        if (INTERSECTED) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        }
        INTERSECTED = null;
      }

      renderer.render(scene, camera);
    })

    // 창 변경 후 다시 렌더링
    const onWindowResize = (() => {
      camera.aspect = wh.value.clientWidth / wh.value.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wh.value.clientWidth, wh.value.clientHeight);
    })

    // 광원의 색상, 강도 초기화
    const initLight = (() => {
       var light = new THREE.DirectionalLight();
      light.position.set(20, 50, 40);
      // light.castShadow = true;
      // 그림자 계산을 위한 영역 설정
      // 그림자 계산 영역이 너무크면 흐릿
      // 그림자 계산 영역이 너무 작으면 보이지 않거나 불완전하게 표시
      // light.shadow.camera.near = 0.5;
      // light.shadow.camera.far = 300;
      // light.shadow.camera.left = -50;
      // light.shadow.camera.right = 50;
      // light.shadow.camera.top = 200;
      // light.shadow.camera.bottom = -100;

      // var helper = new THREE.DirectionalLightHelper(light, 5);

      // scene.add(helper);

      scene.add(light);
    })

    // 마우스 공간
    const initControls = (() => {
      controls = new OrbitControls(camera, renderer.domElement);
      // 최소한의 시청 거리
      controls.minDistance = 0.001;
      // 최대 시청 거리
      controls.maxDistance = 100;
      // 최대 각도
      controls.maxPolarAngle = Math.PI * 0.5;
      controls.target = new THREE.Vector3(0.01, 0.01, 0.01);
    })

    // 렌더링
    const render = ( () => {
      renderer.render(scene, camera);
    })

    // 애니메이트
    const animate = (() => {
      requestAnimationFrame(animate);
      render();
    })

    // 바닥 초기화
    const initFloor = (() => {
      // 층 추가(width, height, depth, position, rotation)
      let floorMesh = createFloor(
        store.state.wareHouse.width,
        store.state.wareHouse.depth,
        store.state.depth,
        { x: 0, y: 0, z: 0 },
        { x: Math.PI / 2 }
      );
      scene.add(floorMesh);
    })

    // 벽 초기화
    const initWall = (() => {
      // 뒷 벽 추가(width, height, depth, position, rotation)
      let backUpWall = createWall(
        store.state.wareHouse.width,
        store.state.wareHouse.height,
        store.state.depth,
        { y: store.state.wareHouse.height / 2, z: -store.state.wareHouse.depth / 2 },
        { x: 0 }
      );
      scene.add(backUpWall);
      // 왼쪽 벽 추가(width, height, depth, position, rotation)
      let leftWall = createWall(
        store.state.wareHouse.depth,
        store.state.wareHouse.height,
        store.state.depth,
        { x: -store.state.wareHouse.width / 2, y: store.state.wareHouse.height / 2 },
        { y: Math.PI / 2 }
      );
      scene.add(leftWall);
      // 오른쪽 벽 추가(width, height, depth, position, rotation)
      let rightWall = createWall(
        store.state.wareHouse.depth,
        store.state.wareHouse.height,
        store.state.depth,
        { x: store.state.wareHouse.width / 2, y: store.state.wareHouse.height / 2 },
        { y: Math.PI / 2 }
      );
      scene.add(rightWall);
    })

    // 저장공간 초기화
    const initStore = (() =>{
      // 저장공간 영역의 이름 표시 글꼴
      let loader = new FontLoader();
      
      loader.load("wh/fonts/SimHei_Regular.json", (_font) => {
        font = _font;
        // 저장공간 영역 이름 텍스트 생성
        // 글꼴 소재
        let matLite = new THREE.MeshBasicMaterial({
          color: 0x000000,
          side: THREE.DoubleSide,
        });
      
      // 선반이 존재하면 수납 공간에 선반 추가
        store.state.zoneList.forEach((zone) => {
          zone.height = 0.01;
          if (zone.shelves) {
            zone.shelves.x = zone.position.x;
            zone.shelves.y = 0.1;
            zone.shelves.z = zone.position.z;

            let qq = createShelves(zone);
            let shelvesGroup = qq.shelves;
            boxs = boxs.concat(...qq.all_boxs);

            let zShelves = zone.shelves;
            let boardStartX =
              zShelves.x - zone.width / 2 + zShelves.width / 2 + 0.1;
            let boardX =
              boardStartX + zShelves.width * (zShelves.columnNum - 1);
            let shapes = font.generateShapes(
              `${zone.name}\n${zone.shelves.name}`,
              0.2
            );
            let geometry = new THREE.ShapeBufferGeometry(shapes);
            // 왼쪽 텍스트
            let text = new THREE.Mesh(geometry, matLite);
              text.position.set(
                boardStartX - zShelves.width / 2 - 0.01,
                zShelves.height + 0.05,
                zShelves.z - 0.5
              );
              text.rotation.y = -Math.PI / 2;
              shelvesGroup.add(text);
              // 오른쪽 텍스트
              text = new THREE.Mesh(geometry, matLite);
              text.position.set(
                boardX + zShelves.width / 2 + 0.01,
                zShelves.height + 0.05,
                zShelves.z + 0.5
              );
              text.rotation.y = Math.PI / 2;
              shelvesGroup.add(text);
              // zoneGroup.add(shelvesGroup);
              scene.add(shelvesGroup);
              shelves.push(shelvesGroup);
              // scene.add(shelvesGroup);
          }
        });
      
        dragEleControls = new DragControls(
            [...shelves],
            camera,
            renderer.domElement
        );
        dragEleControls.addEventListener("hoveron", () => {
            controls.enabled = false;
        });
        dragEleControls.addEventListener("hoveroff", () => {
          controls.enabled = true;
        });
        
        dragStatusChange();
      })
    })

    const dragStatusChange = (() => {
      if (store.state.dragStatus) {
        dragEleControls.activate();
      } else {
        dragEleControls.deactivate();
        if (store.state.detailDialogVisible) {
          store.state.detailDialogVisible = false;
        }
      }
    })

    const showBoxDetail = (({ shelf, box }) => {

      // TODO: notify 처리

      // this.boxDetail = {
      //   shelfName: shelf.name,
      //   rowIndex: box.rowIndex,
      //   colIndex: box.colIndex,
      // };
      // this.detailDialogVisible = true;
      // if (box.status === 1) {
      //   this.$notify.error({
      //     title: `${shelf.name} - ${box.rowIndex}열 ${box.rowIndex}목록`,
      //     dangerouslyUseHTMLString: true,
      //     message: `<strong><i>비정상</i></strong><br/>xxxxxx<br/>xxxxxx`,
      //   });
      //   return;
      // }
      // this.$notify({
      //   title: `${shelf.name} - ${box.rowIndex}열 ${box.rowIndex}목록`,
      //   dangerouslyUseHTMLString: true,
      //   type: box.status === 2 ? "warning" : "",
      //   message: `<strong><i>${
      //     box.status === 2 ? "재고 알림" : "정상"
      //   }</i></strong><br/>샴푸<br/>50개`,
      // });
    })

    const addShelve = (() => {
      if (!store.state.form.name) {
        return;
      }
      let test = {
        name: store.state.form.name,
        width: 12, // 가로
        depth: 2, // 깊이
        // 3차원 위치
        position: {
          x: 0,
          y: 0.1,
          z: 0,
        },
        // 저장영역의 선반 매개변수
        shelves: {
          name: "xxx",
          rowNum: store.state.form.row, // 레이어수
          columnNum: store.state.form.col, // 행
          width: 1.8, // 가로
          height: 1.2, // 높이
          depth: 1.6, // 깊이
        },
      };
      store.state.form.name = "";
      newStore(test);
    })

    const newStore = ((zone) => {
      // 저장영역의 이름 표시하는데 사용되는 글꼴
      // 글꼴 소재
      let matLite = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
      });

      zone.height = 0.01;
      if (zone.shelves) {
        zone.shelves.x = zone.position.x;
        zone.shelves.y = 0.1;
        zone.shelves.z = zone.position.z;
        let qq = createShelves(zone);
        let shelvesGroup = qq.shelves;
        boxs = boxs.concat(...qq.all_boxs);
        let zShelves = zone.shelves;
        let boardStartX =
          zShelves.x - zone.width / 2 + zShelves.width / 2 + 0.1;
        let boardX = boardStartX + zShelves.width * (zShelves.columnNum - 1);
        let shapes = font.generateShapes(
          `${zone.name}\n${zone.shelves.name}`,
          0.2
        );
        let geometry = new THREE.ShapeBufferGeometry(shapes);
        // 왼쪽 텍스트
        let text = new THREE.Mesh(geometry, matLite);
        text.position.set(
          boardStartX - zShelves.width / 2 - 0.01,
          zShelves.height + 0.05,
          zShelves.z - 0.5
        );
        text.rotation.y = -Math.PI / 2;
        shelvesGroup.add(text);
        // 오른쪽 텍스트
        text = new THREE.Mesh(geometry, matLite);
        text.position.set(
          boardX + zShelves.width / 2 + 0.01,
          zShelves.height + 0.05,
          zShelves.z + 0.5
        );
        text.rotation.y = Math.PI / 2;
        shelvesGroup.add(text);
        // zoneGroup.add(shelvesGroup);
        scene.add(shelvesGroup);
        shelves.push(shelvesGroup);
        // scene.add(shelvesGroup);
      }

      dragEleControls.dispose();
      dragEleControls = new DragControls(
        [...shelves],
        camera,
        renderer.domElement
      );
      dragEleControls.addEventListener("hoveron", () => {
        controls.enabled = false;
      });
      dragEleControls.addEventListener("hoveroff", () => {
        controls.enabled = true;
      });
      dragStatusChange();
      store.state.dialogVisible = false;
    })

    const loadGltfShelves = (() => {
      var loader = new GLTFLoader();
      loader.load(
        "wh/model/desk/scene.gltf",
        function (gltf) {
          console.log(gltf);
          gltf.scene.scale.set(0.01, 0.01, 0.01);
          gltf.scene.position.set(26, 0.1, 26);
          gltf.scene.traverse(function (child) {
            child.castShadow = true;
            if (child.isMesh) {
              // child.castShadow = true;
              // child.receiveShadow = true;
            }

            // if (child.isMesh) {
            //   child.material.emissive = child.material.color;
            //   child.material.emissiveMap = child.material.map;
            // }
          });

          scene.add(gltf.scene);
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
    })

    onMounted(() => {
      init()
    })


    return {
      wh,
      store
    }
  }
}
</script>
<style scoped>
/* #canvas {
  width: 10vw;
  height: 10vh;
  background-color: rgba(0, 222, 222, 0.5);
} */
.container {
  position: relative;
}
#operate-container {
  position: absolute;
  left: 20px;
  top: 20px;
  display: inline-block;
  width: auto;
  height: auto;
  overflow: hidden;
}
#warehouse {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
}
.el-row {
  padding-bottom: 10px;
}
</style>