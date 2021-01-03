const drawWorldMap = id => {
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
    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g");

    g.append("path")
        .attr("class", "sphere")
        .attr("d", pathGenerator({ type: "Sphere" }));

    svg.call(d3.zoom().on("zoom", () => {
        g.attr("transform", d3.event.transform);
    }));

    Promise.all([
        d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
        d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json")
    ]).then(([tsvData, topoJSONdata]) => {
        const countryName = tsvData.reduce((accumulator, d) => {
            accumulator[d.iso_n3] = d.name;
            return accumulator;
        }, {});

        const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
        const renderPaths = (selectedIndex) => {
            const paths = g.selectAll("path").data(countries.features);
            paths
                .enter().append("path")
                .attr("stroke", "black")
                .attr("stroke-width", 0.05)
                .attr("d", pathGenerator)
                .merge(paths)
                .attr("fill", (d, i) => i === selectedIndex ? "red" : "lightgreen")
                .on("mouseover", (d, i) => renderPaths(i))
                .on("mousemove", function (d) {
                    const name = countryName[d.id];
                    if (name === "Aruba") {
                        tooltip.style("display", "none");
                        return;
                    }
                    tooltip
                        .style("left", `${d3.event.pageX - 50}px`)
                        .style("top", `${d3.event.pageY - 50}px`)
                        .style("display", "inline-block")
                        .html(name);
                })
                .on("mouseout", () => {
                    tooltip.style("display", "none");
                    renderPaths(null);
                });
        }
        renderPaths(null);
    });
}
