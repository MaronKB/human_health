const graphAnimation = () => {
    const graphs = document.querySelectorAll('.graph-progress');
    graphs.forEach(graph => {
        graph.classList.remove("ready");
    })
}
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(graphAnimation, 300);
});