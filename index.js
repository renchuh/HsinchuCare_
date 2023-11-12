import Chart from './Chart.js'


export default class MapChart extends Chart {
    constructor(id, data, map_data) {
        super(id, data)
        this.x_field = "City"
        this.y_field = "agingIndex"
        this.xinzu = map_data

        super.add_svg();
        this.legendG = this.svg
            .append("g")
            .attr("transform", `translate(${this.innerW - 210},0)`);
        super.update_chart()

    }

    add_scale() {

        this.color = d3.scaleSequential().domain(d3.extent(this.year_data, d => d[1])).range(['#f8d1c8', '#e34a3b'])
    }
    update_data() {
        this.year = d3.select("#customRange3").property('value')
        this.year_data = this.data.filter(d => d.Year === this.year)

        this.year_data = d3.rollups(this.year_data, d => d3.sum(d, v => v[this.y_field]), d => d[this.x_field])
        // this.xinzu = topojson.feature(this.xinzu, this.xinzu.objects.TOWN_MOI_1100415)
        this.xinzu.features = this.xinzu.features.filter(d => d.properties.COUNTYNAME === "新竹縣")
        this.xinzu.features.forEach((d) => {
            let values = this.year_data.find((v) => v[0] === d.properties.TOWNNAME.slice(0, 2))
            if (values) {
                d[this.y_field] = + values?.[1]
            } else {
                d[this.y_field] = 0;
            }
        });

        console.log(this.xinzu);
    }

    draw_chart() {
        this.initMap()
        let color = this.color;
        let mapPath = this.map
            .selectAll("path")
            .data(this.xinzu.features)
            .join("path")
            .lower()
            .attr("d", this.path);

        mapPath
            .attr("fill", (d) => color(d[this.y_field]))
            .attr("stroke", "gray")
            .attr("stroke-width", "1")
            .attr("class", (d) => d.properties.TOWNNAME)
            .on('mouseenter', (e, d,) => {
                const html = `<p>${this.year}</p><p>${d.properties.TOWNNAME}</p><p>${d.agingIndex}</p>`
                this.tips_show(e, d, html)
            })
            .on('mouseout', this.tips_hide)
        this.add_legend()

    }

    initMap() {
        const projection = d3
            .geoMercator()
            .fitSize([this.width, this.height], this.xinzu)
            .clipExtent([[0, 20], [this.width, this.height]])
            .center([120.96755202378847, 24.81651208598769])
            .scale(52000)
            .translate([this.width / 2 - 200, this.height / 2 - 80]);


        this.path = d3.geoPath().projection(projection);
        this.map = this.svg.append("g");
        this.legend = this.map.append('g').attr('transform', `translate(${this.width - 150},0)`);

    }

    add_legend() {
        let max_value =400
        let raneg_value =50
        let data = d3.range(0, max_value, raneg_value)
        this.legendG.selectAll("*").remove()
        let g = this.legendG
        g.append('text').text('AgeIndex').attr('x', 20).attr('y', 20).attr("fill", "gray");

        g.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", 20)
            .attr("y", (d, i) => 30 + i * 25)
            .attr("fill", (d) => this.color(d))
            .attr("stroke", "darkgray");
        g.selectAll("mytext")
            .data(data)
            .join("text")
            .attr("x", 45)
            .attr("y", (d, i) => 30 + i * 25 + 15)
            .text((d) => d)
            .attr("fill", "gray");
    }

}



async function read_data() {
    const data = await d3.csv('./data.csv')
    const map_data = await d3.json('./twTown1982.geo.json')

    console.log(data, map_data);

    const map = new MapChart("viz", data, map_data)

    d3.select('#customRange3').on('change', (e) => {
        const year = e.target.value
        console.log(year);
        d3.select('#yearLabel').html(year)
        map.update_chart()
    })

    let inerval
    let isPlay = false
    d3.select('#play').on('click', () => {
        // 切换为暂停按钮
        isPlay = !isPlay
        let pause = `<svg class="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`
        let play = `<svg class="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="12" cy="12" r="10" />  <polygon points="10 8 16 12 10 16 10 8" /></svg>`

        const update_map = () => {
            let year = d3.select("#customRange3").property('value')
            year++

            if (year > 2026) {
                year = 2026
                clearInterval(inerval)
                d3.select('#play').html(play)
                return
            } else {
                map.update_chart()
            }
            d3.select('#yearLabel').html(year)
            d3.select('#customRange3').property('value', year)
        }



        d3.select('#play').selectAll('*').remove()
        if (!isPlay) {
            d3.select('#play').html(play)
            clearInterval(inerval)
        } else {
            d3.select('#play').html(pause)
            inerval = setInterval(update_map, 1000)
        }



    }
    )

}

read_data()