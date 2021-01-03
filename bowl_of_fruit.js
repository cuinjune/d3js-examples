const drawBowlOfFruit = id => {
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

    const colorScale = d3.scaleOrdinal()
        .domain(["apple", "lemon"])
        .range(["#c11d1d", "#eae600"]);

    const radiusScale = d3.scaleOrdinal()
        .domain(["apple", "lemon"])
        .range([50, 30]);

    const xPosition = (d, i) => i * 120 + 60;

    const fruitBowl = (selection, props) => {
        const {
            fruits,
            height,
            setSelectedFruit,
            selectedFruit
        } = props;

        const bowl = selection.selectAll("rect")
            .data([null])
            .enter().append("rect")
            .attr("y", 110)
            .attr("width", 960)
            .attr("height", 300)
            .attr("rx", 300 / 2)
            .attr("fill", "rgb(55, 55, 55")

        const circles = selection.selectAll("circle")
            .data(fruits, d => d.id);
        circles
            .enter().append("circle")
            .attr("cx", xPosition)
            .attr("cy", height / 2)
            .attr("r", 0)
            .merge(circles)
            .attr("fill", d => colorScale(d.type))
            .attr("stroke-width", 5)
            .attr("stroke", d =>
                d.id === selectedFruit
                    ? "black"
                    : "none"
            )
            .on("mousemove", function (d) {
                tooltip
                    .style("left", `${d3.event.pageX - 50}px`)
                    .style("top", `${d3.event.pageY - 30}px`)
                    .style("display", "inline-block")
                    .html(d.type[0].toUpperCase() + d.type.slice(1));
            })
            .on("mouseout", () => {
                tooltip.style("display", "none");
            })
            .transition().duration(500)
            .attr("cx", xPosition)
            .attr("r", d => radiusScale(d.type));
        circles.exit()
            .transition().duration(500)
            .attr("r", 0)
            .remove();
    }

    const makeFruit = type => ({
        type,
        id: Math.random()
    });
    let fruits = d3.range(8)
        .map((d, i) => makeFruit(i % 2 ? "apple" : "lemon"));
    let selectedFruit = null;

    const setSelectedFruit = id => {
        if (id && selectedFruit !== id) {
            selectedFruit = id;
            render();
        }
    };

    const render = () => {
        fruitBowl(svg, {
            fruits,
            height: height,
            setSelectedFruit,
            selectedFruit
        });
    };

    render();

    const animateFruits = () => {

        setTimeout(() => {
            fruits = fruits.filter((d, i) => i !== 0);
            render();
        }, 500);

        setTimeout(() => {
            fruits.push(makeFruit("lemon"));
            render();
        }, 1000);

        setTimeout(() => {
            fruits = fruits.filter((d, i) => i !== 0);
            render();
        }, 1500);

        setTimeout(() => {
            fruits.push(makeFruit("apple"));
            render();
            animateFruits();
        }, 2000);
    }
    animateFruits();
}