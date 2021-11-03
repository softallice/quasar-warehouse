import { reactive } from 'vue';

const state = reactive({
    formLabelWidth: "70px",
    form: {
        name: "",
        row: 1,
        col: 1,
    },
    dialogVisible: false,
    detailDialogVisible: false,
    boxDetail: {
        shelfName: "",
        rowIndex: "",
        colIndex: "",
    },
    dragStatus: false,
    // 창고
    wareHouse: {
    width: 100, // 가로
    depth: 100, // 깊이
    height: 5, // 높이
    },
    depth: 0.1, // 벽의 두께
    // 저장공간
    zoneList: [
        {
            name: "저장행1",
            width: 12, // 가로
            depth: 2, // 깊이
            // 3차원 위치 정보
            position: {
                x: -10,
                y: 0.1,
                z: -12,
            },
            // 선반 매개변수
            shelves: {
                name: "샴푸",
                rowNum: 9, // 레이어수
                columnNum: 12, // 열
                width: 1.8, // 가로
                height: 1.2, // 높이
                depth: 1.6, // 깊이
            },
        },
        {
            name: "매장3",
            width: 12, // 가로
            depth: 2, // 깊이
            // 3차원 위치 정보
            position: {
                x: -10,
                y: 0.1,
                z: -4,
            },
            // 선반매개변수
            shelves: {
                name: "비누",
                rowNum: 9, // 레이어수
                columnNum: 12, // 열
                width: 1.8, // 깊이
                height: 1.2, // 높이
                depth: 1.6, // 깊이
            },
        },
        {
            name: "매장5",
            width: 12, // 가로
            depth: 2, // 깊이
            // 선반매개변수
            position: {
                x: -10,
                y: 0.1,
                z: 4,
            },
            // 3차원 위치 정보
            shelves: {
                name: "타월",
                rowNum: 9, // 레이어수
                columnNum: 12, // 열
                width: 1.8, // 깊이
                height: 1.2, // 높이
                depth: 1.6, // 깊이
            },
        },
        {
            name: "매장7",
            width: 12, // 가로
            depth: 2, // 깊이
            // 3차원 위치 정보
            position: {
                x: -10,
                y: 0.1,
                z: 12,
            },
            // 선반매개변수
            shelves: {
                name: "그냥 모름",
                rowNum: 9, // 레이어수
                columnNum: 12, // 열
                width: 1.8, // 깊이
                height: 1.2, // 높이
                depth: 1.6, // 깊이
            },
        },
    ],
});

const store = {
    state
  };
  
  export default store;