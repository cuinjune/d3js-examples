const drawSmileyFace = id => {
    const width = 960;
    const height = 500;

    const svg = d3.select(id)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content", true);

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const circle = g.append("circle");

    circle.attr("r", height / 2);
    circle.attr("fill", "yellow");
    circle.attr("stroke", "black");

    const eyeSpacing = 101;
    const eyeYOffset = -89;
    const eyeRadius = 40;
    const eyebrowWidth = 70;
    const eyebrowHeight = 20;
    const eyebrowYOffset = -70;

    const eyesG = g
        .append("g")
        .attr("transform", `translate(0, ${eyeYOffset})`);

    const leftEye = eyesG
        .append("circle")
        .attr("r", eyeRadius)
        .attr("cx", -eyeSpacing);

    const rightEye = eyesG
        .append("circle")
        .attr("r", eyeRadius)
        .attr("cx", eyeSpacing);

    const resizeEyes = () => {
        leftEye
            .transition().duration(500)
            .attr("r", eyeRadius * 1.2)
            .transition().duration(500)
            .attr("r", eyeRadius);

        rightEye
            .transition().duration(500)
            .attr("r", eyeRadius * 1.2)
            .transition().duration(500)
            .attr("r", eyeRadius);
    }

    const eyebrowsG = eyesG
        .append("g")
        .attr("transform", `translate(0, ${eyebrowYOffset})`);

    const moveEyebrows = () => eyebrowsG
        .transition().duration(500)
        .attr("transform", `translate(0, ${eyebrowYOffset - 40})`)
        .transition().duration(500)
        .attr("transform", `translate(0, ${eyebrowYOffset})`);

    const leftEyebrow = eyebrowsG
        .append("rect")
        .attr("x", -eyeSpacing - eyebrowWidth / 2)
        .attr("width", eyebrowWidth)
        .attr("height", eyebrowHeight);

    const rightEyebrow = eyebrowsG
        .append("rect")
        .attr("x", eyeSpacing - eyebrowWidth / 2)
        .attr("width", eyebrowWidth)
        .attr("height", eyebrowHeight);

    const mouth = g
        .append("path")
        .attr("d", d3.arc()({
            innerRadius: 150,
            outerRadius: 170,
            startAngle: Math.PI * 0.5,
            endAngle: Math.PI * 1.5
        }));

    const scaleMouth = () => mouth
        .transition().duration(500)
        .attr("transform", `scale(1.1, 1.1)`)
        .transition().duration(500)
        .attr("transform", `scale(1, 1)`);

    const animateFace = () => {
        resizeEyes();
        moveEyebrows();
        scaleMouth();
        setTimeout(animateFace, 2000);
    }
    animateFace();
}