let count = 0;
const comments = {
    stress : [
        {
            tier: 1,
            text: "인생이 행복합니다!",
            url: "LzAgYVknNYg",
        },
        {
            tier: 2,
            text: "오늘도 좋은 하루!",
            url: "r2ko422xW0w",
        },
        {
            tier: 3,
            text: "일상이 힘들고 지칠 땐,<br/>휴일을 떠올려봐요.",
            url: "-FoLIeLo3eQ",
        },
        {
            tier: 4,
            text: "아직 경미한 수준입니다.<br/>천천히 심호흡을 해봐요.",
            url: "2aFXEDNQB4A",
        },
        {
            tier: 5,
            text: "많이 피곤하셨나요?<br/>오늘은 좋아하는 음식을 먹어요.",
            url: "3nzlIlsF9Cs",
        },
        {
            tier: 6,
            text: "힘든 일이 있었나요?<br/>취미활동을 시작해보세요.",
            url: "RohZ89_w93o",
        },
        {
            tier: 7,
            text: "안 좋은 일이 있었나봐요.<br/>가족이나 친구들과 이야기해봐요.",
            url: "uc3dpkLTYzQ",
        },
        {
            tier: 8,
            text: "행복한 것들을 눈에 담고,<br/>좋은 말들에 귀기울이세요.",
            url: "WRuqiJ25O0I",
        },
        {
            tier: 9,
            text: "고민을 털어놓아보세요.<br/>힘들어도 결코 포기하지 말아요.",
            url: "k7ct73nkDko",
        },
        {
            tier: 10,
            text: "정신과 상담을 권장합니다.<br/>즉시 휴식을 취하십시오.",
            url: "dH3dUtbzpUA",
        }
    ],
    sleep : {
        0 : "",
        1 : "",
        2 : "",
        3 : "",
        4 : "",
        5 : "",
        6 : "권장 최소 수면시간입니다.",
        7 : "적정 수면시간입니다.",
        8 : "정상적인 수면시간입니다.",
        9 : "",
        10 : "",
        11 : "",
        12 : "",
    }
}
const stretchList = [
    {
        index: 0,
        title: "neck",
        url: "mUnSpfItRf0",
    },
    {
        index: 1,
        title: "shoulder",
        url: "eDdT-IPPVZM",
    },
    {
        index: 2,
        title: "chest",
        url: "prWqSPB68wM",
    },
    {
        index: 3,
        title: "wrist",
        url: "aNJT6DGRZ5g",
    },
    {
        index: 4,
        title: "ankle",
        url: "ynAMChUuJkU",
    },
    {
        index: 5,
        title: "leg",
        url: "--MMq6I07b4",
    },
    {
        index: 6,
        title: "waist",
        url: "abiyAQu-Pf0",
    }
];

const progressing = (ev) => {
    const elements = Array.from(document.querySelectorAll("#stretch > input"));

    const index = Number(ev.target.dataset.index);
    const next = index + 1;
    const checked = ev.target.checked;

    const video = document.querySelector("#stretch-recommend");
    const text = document.querySelector("#stretch-end");

    if (next > 6) {
        video.classList.add("hidden");
        text.classList.remove("hidden");
        return;
    }

    video.classList.remove("hidden");
    text.classList.add("hidden");

    const prevElements = elements.filter(e => Number(e.dataset.index) < index);
    prevElements.forEach(e => {
        e.checked = true;
    });

    const nextElements = elements.filter(e => Number(e.dataset.index) > index);
    nextElements.forEach(e => {
        e.checked = false;
        e.disabled = true;
    });

    const nextInput = elements.find(e => Number(e.dataset.index) === next);
    nextInput.disabled = !checked;

    const url = stretchList.find(s => s.index === next).url;
    const target = document.querySelector("#stretch-recommend");
    target.src = `https://www.youtube.com/embed/${url}`;
}
const onRangeChange = (input) => {
    const val = input.value;
    const string = input.id.split("-")[1];
    const target = document.querySelector(`#${string}-content`);
    target.innerHTML = val;

    const comment = comments[string].find(c => c.tier === Number(val));
    if (!comment) return;

    const tooltip = document.querySelector(`#vital-${string}-tooltip`);
    tooltip.innerHTML = comment.text;
    tooltip.classList.remove("hidden");

    const video = document.querySelector("#stress-recommend");
    video.src = `https://www.youtube.com/embed/${comment.url}`;

    if (count === 0) {
        count = 20;
        const countDown = setInterval(() => {
            if (count === 0) {
                tooltip.classList.add("hidden");
                clearInterval(countDown);
            } else {
                count--;
            }
        }, 100);
    } else {
        count = 20;
    }
}
const init = () => {
    const checkboxes = document.querySelectorAll("#stretch > input");
    checkboxes.forEach(checkbox => {
        checkbox.onchange = ev => progressing(ev);
    })
}
window.addEventListener('DOMContentLoaded', init);