const setExampleContainerSize = () => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const widthPct = vw < vh || vw < 800 ? "98%" : vw < 1200 ? "48%" : "31%";
    const exampleContainer = document.getElementsByClassName("example-container");
    for (const container of exampleContainer) {
        container.style.width = widthPct;
        container.style.height = `${container.offsetWidth * 0.8 / vh * 100}%`;
    }
}

window.onload = () => {
    window.onresize = setExampleContainerSize;
    setExampleContainerSize();

    drawSmileyFace("#smiley-face");
    drawBarChart("#bar-chart");
    drawScatterPlot("#scatter-plot");
    drawLineChart("#line-chart");
    drawBowlOfFruit("#bowl-of-fruit");
    drawWorldMap("#world-map");
};