const calcDate = () => {
    const startDate = new Date(document.querySelector("#start-date").value);
    const today = new Date();
    const diff = Math.abs(today.getTime() - startDate.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const target = document.querySelector("#date-diff");
    target.innerHTML = String(days);
}
const getBMI = () => {
    const targetWeightValue = document.querySelector('#target-weight').value;
    const currentWeightValue = document.querySelector("#weight").value;
    const height = document.querySelector("#height").value;
    const under = (height / 100) ** 2;

    const targetBMI = (targetWeightValue / under) - 16;
    const currentBMI = (currentWeightValue / under) - 16;

    return {
        target : (targetBMI * 100 / 21.5).toFixed(1),
        current : (currentBMI * 100 / 21.5).toFixed(1)
    }
}
const getSkeletal = () => {
    const targetSkeletalValue = document.querySelector('#target-skeletal').value;
    const currentSkeletalValue = document.querySelector("#skeletal").value;
}
const setGraph = () => {
    const bmi = getBMI();

    const targetFatValue = document.querySelector('#target-fat').value;
    const currentFatValue = document.querySelector("#fat").value;
    
    const graphs = Array.from(document.querySelectorAll('.graph-progress'));

    const targetWeight = graphs.find(g => g.id === 'weight-target');
    const currentWeight = graphs.find(g => g.id === 'weight-current');
    const targetFat = graphs.find(g => g.id === 'fat-target');
    const currentFat = graphs.find(g => g.id === 'fat-current');
    const targetSkeletal = graphs.find(g => g.id === 'skeletal-target');
    const currentSkeletal = graphs.find(g => g.id === 'skeletal-current');

    const animate = (doc, val) => {
        const getFinalValue = (float) => {
            let n = Math.round(float * 10);
            if (n % 2 !== 0) n += 1;
            return n / 10;
        }

        let value = (doc.value) ? Number(Number(doc.value).toFixed(1)) : 0;
        const finalValue = getFinalValue(val).toFixed(1);

        const animation = setInterval(() => {
            console.log(value);
            doc.value = value;
            if (value > finalValue) {
                value = (value * 10 - 2) / 10;
            } else if (value < finalValue) {
                value = (value * 10 + 2) / 10;
            } else {
                clearInterval(animation);
            }
        }, 1);
    }

    animate(targetWeight, bmi.target);
    animate(currentWeight, bmi.current);
    animate(targetFat, targetFatValue);
    animate(currentFat, currentFatValue);
    animate(targetSkeletal, targetSkeletalValue);
    animate(currentSkeletal, currentSkeletalValue);
}
const calcBMR = () => {
    const gender = document.querySelector("[name='gender']:checked").value;
    const age = document.querySelector("#age").value;
    const height = document.querySelector("#height").value;
    const weight = document.querySelector("#weight").value;

    const bmr = (gender === "male")
        ? 6647 + (1375 * weight) + (500 * height) - (676 * age)
        : 65510 + (956 * weight) + (185 * height) - (468 * age);
    const bmrArr = String(bmr / 100).split(".");

    const spanA = document.createElement("span");
    spanA.className = "bmr-main";
    spanA.innerText = bmrArr[0];

    const spanB = document.createElement("span");
    spanB.className = "bmr-sub";
    spanB.innerText = "." + bmrArr[1];

    const target = document.querySelector("#bmr");
    target.replaceChildren(spanA, spanB);
}
const onChange = () => {
    calcBMR();
    setGraph();
}
const init = () => {
    const inputs = document.querySelectorAll('.user-input input');
    inputs.forEach((input) => {
        input.onchange = onChange;
    });
    const date = document.querySelector(".date");
    date.addEventListener("change", calcDate);
    calcDate();
    calcBMR();
    setTimeout(setGraph, 300);
}
window.addEventListener('DOMContentLoaded', init);