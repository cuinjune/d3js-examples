const drawLineChart = id => {
    const width = 960;
    const height = 500;

    const svg = d3.select(id)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content", true);

    const tooltip = d3.select("#toolTip");

    const render = data => {
        const title = "A Week in San Francisco";

        const xValue = d => d.timestamp;
        const xAxisLabel = "Time";

        const yValue = d => d.temperature;
        const yAxisLabel = "Temperature";

        const margin = { top: 60, right: 40, bottom: 88, left: 105 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth])
            .nice();

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue))
            .range([innerHeight, 0])
            .nice();

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const xAxis = d3.axisBottom(xScale)
            .tickSize(-innerHeight)
            .tickPadding(15);

        const yAxis = d3.axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickPadding(10);

        const yAxisG = g.append("g").call(yAxis);
        yAxisG.selectAll(".domain").remove();
        yAxisG.selectAll("line")
            .style("stroke", "#C0C0BB");
        yAxisG.selectAll("text")
            .style("font-size", "2.7em")
            .style("fill", "#635F5D");

        yAxisG.append("text")
            .attr("y", -60)
            .attr("x", -innerHeight / 2)
            .attr("font-size", "5em")
            .attr("fill", "#8E8883")
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text(yAxisLabel);

        const xAxisG = g.append("g").call(xAxis)
            .attr("transform", `translate(0, ${innerHeight})`);

        xAxisG.select(".domain").remove();
        xAxisG.selectAll("line")
            .style("stroke", "#C0C0BB");
        xAxisG.selectAll("text")
            .style("font-size", "2.7em")
            .style("fill", "#635F5D");

        xAxisG.append("text")
            .attr("y", 80)
            .attr("x", innerWidth / 2)
            .attr("font-size", "5em")
            .attr("fill", "#8E8883")
            .text(xAxisLabel);

        const lineGenerator = d3.line()
            .x(d => xScale(xValue(d)))
            .y(d => yScale(yValue(d)))
            .curve(d3.curveBasis);

        g.append("path")
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "maroon")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .attr("d", lineGenerator(data));

        const circleRadius = 25;

        g.selectAll("circle").data(data)
            .enter().append("circle")
            .attr("cx", d => xScale(xValue(d)))
            .attr("cy", d => yScale(yValue(d)))
            .attr("r", circleRadius)
            .attr("fill", "red")
            .attr("opacity", 0);

        const renderCircles = (selectedIndex) => {
            
            const circles = g.selectAll("circle").data(data);
            circles
                .enter().append("circle")
                .attr("cy", d => yScale(yValue(d)))
                .attr("cx", d => xScale(xValue(d)))
                .attr("r", circleRadius)
                .merge(circles)
                .on("mouseover", (d, i) => renderCircles(i))
                .on("mousemove", function (d) {
                    tooltip
                        .style("left", `${d3.event.pageX - 50}px`)
                        .style("top", `${d3.event.pageY - 50}px`)
                        .style("display", "inline-block")
                        .html(`${d.temperature.toFixed(0)}°C`);
                })
                .on("mouseout", () => {
                    tooltip.style("display", "none");
                    renderCircles(null);
                });
        }
        renderCircles(null);

        g.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", -10)
            .attr("font-size", "3.7em")
            .attr("fill", "#635F5D")
            .attr("text-anchor", "middle")
            .text(title);
    };

    d3.csv("temperature-in-san-francisco.csv")
        .then(data => {
            data.forEach(d => {
                d.temperature = +d.temperature;
                d.timestamp = new Date(d.timestamp);
            });
            render(data);
        });
}