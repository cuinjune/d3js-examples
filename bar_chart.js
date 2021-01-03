const drawBarChart = id => {
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
    const titleText = "Top 10 Most Populous Countries";
    const xAxisLabelText = "Population";

    const render = data => {
        const xValue = d => d.population;
        const yValue = d => d.country;
        const margin = { top: 50, right: 40, bottom: 77, left: 180 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, xValue)])
            .range([0, innerWidth]);

        const yScale = d3.scaleBand()
            .domain(data.map(yValue))
            .range([0, innerHeight])
            .padding(0.1);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const xAxisTickFormat = number =>
            d3.format(".3s")(number)
                .replace("G", "B");

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(xAxisTickFormat)
            .tickSize(-innerHeight);

        const yAxisG = g.append("g")
            .call(d3.axisLeft(yScale));

        yAxisG.selectAll(".domain").remove();
        yAxisG.selectAll("line").remove();
        yAxisG.selectAll("text")
            .style("font-size", "2.7em")
            .style("fill", "#635F5D");

        const xAxisG = g.append("g")
            .call(xAxis)
            .attr("transform", `translate(0,${innerHeight})`);

        xAxisG.select(".domain").remove();
        xAxisG.selectAll("line").style("stroke", "#C0C0BB");
        xAxisG.selectAll("text")
            .style("font-size", "2.7em")
            .style("fill", "#635F5D");

        xAxisG.append("text")
            .attr("y", 65)
            .attr("x", innerWidth / 2)
            .attr("font-size", "5em")
            .attr("fill", "#8E8883")
            .text(xAxisLabelText);

        const renderRects = (selectedIndex) => {
            const rects = g.selectAll("rect").data(data);
            rects
                .enter().append("rect")
                .attr("y", d => yScale(yValue(d)))
                .attr("width", d => xScale(xValue(d)))
                .attr("height", yScale.bandwidth())
                .attr("fill", "steelblue")
                .merge(rects)
                .attr("opacity", (d, i) => i === selectedIndex ? 0.7 : 1)
                .on("mouseover", (d, i) => renderRects(i))
                .on("mousemove", function (d) {
                    tooltip
                        .style("left", `${d3.event.pageX - 50}px`)
                        .style("top", `${d3.event.pageY - 30}px`)
                        .style("display", "inline-block")
                        .html(`${d.country}: ${xAxisTickFormat(d.population)}`);
                })
                .on("mouseout", () => {
                    tooltip.style("display", "none");
                    renderRects(null);
                });
        }
        renderRects(null);

        g.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", -10)
            .attr("font-size", "3.2em")
            .attr("fill", "#635F5D")
            .attr("text-anchor", "middle")
            .text(titleText);
    };

    d3.csv("population.csv").then(data => {
        data.forEach(d => {
            d.population = +d.population * 1000;
        });
        render(data);
    });
}