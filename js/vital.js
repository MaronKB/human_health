const comments = {
    stress : {
        1 : "인생이 행복합니다!",
        2 : "오늘도 좋은 하루!",
        3 : "일상이 힘들고 지칠 땐,<br/>휴일을 떠올려봐요.",
        4 : "아직 경미한 수준입니다.<br/>천천히 심호흡을 해봐요.",
        5 : "많이 피곤하셨나요?<br/>오늘은 좋아하는 음식을 먹어요.",
        6 : "힘든 일이 있었나요?<br/>취미활동을 시작해보세요.",
        7 : "안 좋은 일이 있었나봐요.<br/>가족이나 친구들과 이야기해봐요.",
        8 : "행복한 것들을 눈에 담고,<br/>좋은 말들에 귀기울이세요.",
        9 : "고민을 털어놓아보세요.<br/>힘들어도 결코 포기하지 말아요.",
        10 : "정신과 상담을 권장합니다.<br/>즉시 휴식을 취하십시오."
    },
    sleep : {
        0 : "",
        1 : "",
        2 : "",
        3 : "",
        4 : "",
        5 : "",
        6 : "",
        7 : "",
        8 : "정상적인 수면시간입니다.",
        9 : "",
        10 : "",
        11 : "",
        12 : "",
        13 : "",
        14 : "",
        15 : "",
        16 : "",
        17 : "",
        18 : "",
        19 : "",
        20 : "",
        21 : "",
        22 : "",
        23 : "",
        24 : "",
    }
}
const stretchList = [
    {
        index: 0,
        title: "neck",
        url: "",
    },
    {
        index: 1,
        title: "shoulder",
        url: "",
    },
    {
        index: 2,
        title: "chest",
        url: "",
    },
    {
        index: 3,
        title: "wrist",
        url: "",
    },
    {
        index: 4,
        title: "ankle",
        url: "",
    },
    {
        index: 5,
        title: "leg",
        url: "",
    },
    {
        index: 6,
        title: "waist",
        url: "",
    }
];
let currentStretch = 0;

const progressing = () => {

}
const onRangeChange = (input) => {
    const val = input.value;
    const string = input.id.split("-")[1];
    const target = document.querySelector(`#${string}-content`);
    target.innerHTML = val;

    const comment = comments[string][Number(val)];
    if (!comment) return;

    const tooltip = document.querySelector(`#vital-${string}-tooltip`);
    tooltip.innerHTML = comment;

    tooltip.classList.remove("hidden");
    setTimeout(() => {
        tooltip.classList.add("hidden");
    }, 2000);
}
const init = () => {

}