const graphAnimation = () => {
    const graphs = document.querySelectorAll('.graph-progress');
    graphs.forEach(graph => {
        graph.classList.remove("ready");
    })
}
const calcBMR = () => {
    const age = document.querySelector("#age").value;
    const height = document.querySelector("#height").value;
    const weight = document.querySelector("#weight").value;

    const bmr = 6647 + (1375 * weight) + (500 * height) - (676 * age);

    const target = document.querySelector("#kal");
    target.value = bmr / 100;
}
const calcDate = () => {
    const startDate = new Date(document.querySelector("#start-date").value);
    const today = new Date();
    const diff = Math.abs(today.getTime() - startDate.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const target = document.querySelector("#date-diff");
    target.innerHTML = String(days);
}
window.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.user-input > input');
    inputs.forEach((input) => {
        input.onchange = calcBMR;
    })
    calcDate();
    calcBMR();
    setTimeout(graphAnimation, 300);
});