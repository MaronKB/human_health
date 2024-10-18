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
            url: "sifMD_Sqe_A",
        },
        {
            tier: 4,
            text: "아직 경미한 수준입니다.<br/>천천히 심호흡을 해봐요.",
            url: "dZewQEbQQM0",
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
            url: "TFBuCo-Yh_4",
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
    sleep : [
        {
            tier: 0,
            text: "밤샘은 몸에 지극히 해롭습니다.<br/>즉각적인 수면을 권고합니다.",
            url: "PAG7hJ9J-zQ",
        },
        {
            tier: 1,
            text: "수면의 효과를 보기 어렵습니다.<br/>가능하면 더 주무세요.",
            url: "qWDJVbyX25A",
        },
        {
            tier: 2,
            text: "불면증이 의심됩니다.<br/>주의하십시오.",
            url: "uHF0e-TuPeA",
        },
        {
            tier: 3,
            text: "평균 수면시간이 낮아질 경우<br/>건강이 악화될 수 있습니다.",
            url: "rmJ7IauMbG0",
        },
        {
            tier: 4,
            text: "밤잠을 설쳤나요?<br/>오늘은 일찍 주무셨으면 합니다.",
            url: "0dNMdD_I0KI",
        },
        {
            tier: 5,
            text: "조금 부족합니다.<br/>낮잠으로 보충해봅시다.",
            url: "SVmjYoZlj6I",
        },
        {
            tier: 6,
            text: "권장 최소 수면시간입니다.<br/>조금 노곤할 수도 있겠네요.",
            url: "jKQ3nWmSafk",
        },
        {
            tier: 7,
            text: "적정 수면시간입니다.<br/>잘 하고 있습니다!",
            url: "PgW7wVqXdWw",
        },
        {
            tier: 8,
            text: "정상적인 수면시간입니다.<br/>좋은 꿈 꾸셨나요?",
            url: "vfWwL4N8CM4",
        },
        {
            tier: 9,
            text: "푹 주무셨군요.<br/>오늘은 기운차게 시작해봅시다.",
            url: "pedawjCCEdA",
        },
        {
            tier: 10,
            text: "너무 오래 자면 더 피곤해요.<br/>힘들어도 열심히 해봐요.",
            url: "tn89hk2j2-o",
        },
        {
            tier: 11,
            text: "과수면 기미가 보입니다.<br/>만성피로가 의심됩니다.",
            url: "-EdU5IeVBtI",
        },
        {
            tier: 12,
            text: "지속적으로 수면이 장기화된다면,<br/>의사와 상담해보아야 합니다.",
            url: "0tvrcyZknio",
        }
    ]
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
    const buttons = Array.from(document.querySelectorAll(".vital-input > button"));
    const index = Number(ev.target.dataset.index);
    const current = ev.target.dataset.current;

    const playing = buttons.filter(b => b.dataset.current === "playing" && b.id !== ev.target.id);
    playing.forEach(p => p.dataset.current = "yet");

    switch (current) {
        case "yet":
            ev.target.dataset.current = "playing";
            break;
        case "playing":
            ev.target.dataset.current = "finished";
            break;
        case "finished":
            ev.target.dataset.current = "yet";
            break;
        default:
            break;
    }

    const video = document.querySelector("#stretch-recommend");
    const text = document.querySelector("#stretch-end");

    if (document.querySelectorAll("button[data-current='finished']").length === buttons.length) {
        video.classList.add("hidden");
        text.classList.remove("hidden");
    } else {
        const url = stretchList.find(s => s.index === index).url;
        const src = `https://www.youtube.com/embed/${url}`;
        if (video.src !== src) video.src = src;

        video.classList.remove("hidden");
        text.classList.add("hidden");
    }
};

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

    const video = document.querySelector(`#${string}-recommend`);
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
};

const init = () => {
    const buttons = document.querySelectorAll("#stretch > button");
    buttons.forEach(button => {
        button.onclick = ev => progressing(ev);
    });
};

window.addEventListener('DOMContentLoaded', init);
