
export default class ParentChart {
    constructor(id, data) {
        this.data = data;
        this.div = id;

    }

    add_svg() {
        d3.select('body').append('div').style('display', 'none').attr('position', 'absolute').attr('class', 'd3-tip')
        this.add_margin();
        this.add_chart_area();

    }

    add_margin() {
        const div = d3.select(`#${this.div}`);



        div.selectAll("*").remove()
        this.getWH(div);
        this.margin = { left: 60, right: 20, top: 60, bottom: 60 };
        this.innerW = this.width - this.margin.left - this.margin.right;
        this.innerH = this.height - this.margin.top - this.margin.bottom;
        this.svg = div
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    add_chart_area() {
        this.ChartArea = this.svg
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
        this.draw_area = this.ChartArea.append("g");
        this.AxisY = this.ChartArea.append("g");
        this.AxisX = this.ChartArea.append("g").attr(
            "transform",
            `translate(0,${this.innerH})`
        );
    }
    add_label() {
        this.ChartArea.selectAll(".x_label").data([0]).join("text").attr('class', 'x_label')
            .attr("transform", `translate(${this.innerW / 2},${this.innerH + 30})`)
            .text(this.x_field);
        // y1
        this.ChartArea.selectAll(".y_label").data([0]).join("text").attr('class', 'y_label')
            .attr("transform", `translate(,) rotate(90)`)
            .text(this.y_field);



    }

    add_axis() {
        this.x && this.AxisX.transition().delay(200).call(d3.axisBottom(this.x));
        this.y && this.AxisY.transition().delay(200).call(d3.axisLeft(this.y))
    }

    tips_show(e, v, html) {
        d3.select(".d3-tip")
            .style("display", "block")
            .style("position", "absolute")
            .style("top", e.pageY + "px")
            .style("left", e.pageX + "px")
            .style("background-color", "white")
            .style("padding", "5px")
            .html(html);

    }
    tips_hide() {
        d3.select(".d3-tip").style("display", "none");


    }
    update_chart() {
        this.update_data()
        this.add_scale()
        this.add_axis()
        this.draw_chart()
    }


    getWH(node) {
        this.width = node.node().getBoundingClientRect().width * 0.9;
        this.height = node.node().getBoundingClientRect().height * 0.9;
    }





}