<template>
  <div ref="container" class="text-center">
    <div role="radiogroup" tabindex="-1" class="btn-group-toggle btn-group flex-wrap text-uppercase">
      <label :key="'btn-'+index" v-for="(chart, index) in params.charts" class="btn btn-brand-secondary" :class="(selected===index) ? 'active' : ''" @click="changeData(index)">
        <input type="radio" v-model="selected" :value="index">
        {{ chart.name }}
      </label>
      <label class="btn btn-brand-secondary" :class="(selected===params.charts.length) ? 'active' : ''" @click="changeData(params.charts.length)">
        <input type="radio" v-model="selected" :value="params.charts.length">
        Show All
      </label>
    </div>
    <svg ref="svg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import {schemeSet2} from "d3-scale-chromatic";

export default {
  name: 'BarChartCollection',
  data() {
    return {
      selected: 0,
      previous: 0
    }
  },
  props: {
    /**
     * Params for generating pie chart
     *
     *   {
     *     "size":,
     *     "marginTop":,
     *     "marginRight":,
     *     "marginLeft":,
     *     "marginBottom":,
     *     "chartLabelSize":,
     *     "tickLabelSize":,
     *     "chartWidth":,
     *     "chartHeight":,
     *     "charts": [
     *     	  {
     *     		  "name:",
     *             "xScaleType":, Not implemented yet
     *             "xScale":, Not implemented yet
     *             "yScaleType":,
     *             "yScale":,
     *             "data" {
     *	               "key":,
     *    	           "value":,
     *        }
     *     ]
     *   }
     *
     *
     *
     */
    params: {
      required: true,
      type: Object
    },
  },
  computed: {
    constants: function() {
      const CONTAINERWIDTH = this.$refs.container.clientWidth;
      const SIZE = this.params.size ?? CONTAINERWIDTH;
      const MARGINTOP = this.params.marginTop ?? SIZE/50;
      const MARGINRIGHT = this.params.marginRight ?? SIZE/10;
      const MARGINLEFT = this.params.marginLeft ?? SIZE/7;
      const MARGINBOTTOM = this.params.marginBottom ?? SIZE/12;
      const WIDTH = this.params.chartWidth ?? (SIZE - MARGINLEFT - MARGINRIGHT);
      const HEIGHT = this.params.chartHeight ?? (SIZE/2 - MARGINTOP - MARGINBOTTOM);
      const CENTERX = (CONTAINERWIDTH - WIDTH + MARGINLEFT)/2;
      const CHARTLABELSIZE = this.params.chartLabelSize ?? SIZE/35;
      const TICKLABELSIZE = this.params.tickLabelSize ?? SIZE/45;
      return {
        SIZE: SIZE,
        MARGINTOP: MARGINTOP,
        MARGINRIGHT: MARGINRIGHT,
        MARGINLEFT: MARGINLEFT,
        MARGINBOTTOM: MARGINBOTTOM,
        WIDTH: WIDTH,
        HEIGHT: HEIGHT,
        CONTAINERWIDTH: CONTAINERWIDTH,
        CENTERX: CENTERX,
        CHARTLABELSIZE: CHARTLABELSIZE,
        TICKLABELSIZE: TICKLABELSIZE
      }
    }
  },
  methods: {
    changeData: function(chart) {
      // if show all button clicked
      if(chart===this.params.charts.length) {
        this.showAll();
      // else show the chart clicked
      } else {
        this.hideNonSelected(chart);

        let svg = d3.select(this.$refs.svg);
        //if chart selected is NOT one currently shown
        if (chart !== this.previous) {
          //Move old chart out
          svg.select("#chart-" + this.previous)
            .transition()
              .duration(2000)
              .attr("transform", "translate(-" + this.constants.CONTAINERWIDTH + ", " + this.constants.MARGINTOP + ")");

          this.previous = chart;

          //if chart has already been created
          if(document.getElementById("chart-" + chart)!==null) {
            svg.select("#chart-" + chart)
              .transition()
                .duration(2000)
                .attr("transform", "translate(" + this.constants.CENTERX + ", " + this.constants.MARGINTOP + ")");
          //else create the chart and move it into focus
          } else {
            this.createNewChart(chart, 0);
          }
        }
      }
    },
    hideNonSelected: function(selectedChart) {
      let svg = d3.select(this.$refs.svg);
      
      svg.attr("viewBox", "0 0 "
          + this.constants.CONTAINERWIDTH
          + " " + (this.constants.HEIGHT + this.constants.MARGINTOP + this.constants.MARGINBOTTOM));
      this.params.charts.forEach((chart, index) => {
        if(document.getElementById("chart-" + index)!==null) {
          if (index===selectedChart) {
            svg.select("#chart-" + index).transition()
              .duration(2000)
              .attr("transform", "translate(" + this.constants.CENTERX + ", " + this.constants.MARGINTOP + ")");
          } else {
            svg.select("#chart-" + index).transition()
              .duration(2000)
              .attr("transform", "translate(-" + this.constants.CONTAINERWIDTH + ", " + this.constants.MARGINTOP + ")");
          }
        }
      });
    },
    createNewChart: function(chart, numberDisplayed) {
      let svg = d3.select(this.$refs.svg);

      let chartNew = svg
        .append("g")
          .attr("transform", "translate(" + (this.constants.CONTAINERWIDTH + this.constants.MARGINLEFT) + "," + this.constants.MARGINTOP  + ")")
          .attr("id", "chart-" + chart);


      let x = d3.scaleBand()
        .domain(this.params.charts[chart].data.map(function(d) { return d.key; }))
        .range([0, this.constants.WIDTH])
        .padding(0.1);

      let y;
      if (this.params.charts[chart].yScaleType==="ordinal") {
        y = d3.scalePoint()
          .domain([""].concat(this.params.charts[chart].yScale))
          .range([this.constants.HEIGHT, 0]);
      } else if (this.params.charts[chart].yScaleType==="linear") {
        y = d3.scaleLinear()
          .domain([0, d3.max(this.params.charts[chart].data, function(d) { return d.value; })])
          .range([this.constants.HEIGHT, 0]);
      } else {
        //could add other scales in the future
      }


      let colorScale = d3.scaleOrdinal(schemeSet2);

      let xAxis = d3.axisBottom()
        .scale(x);

      let yAxis = d3.axisLeft()
        .scale(y);

      chartNew.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + this.constants.HEIGHT + ")")
        .call(xAxis)
        .attr("font-size", this.constants.TICKLABELSIZE)
        .append("text")
          .attr("class", "bar-chart-label")
          .attr("transform", "translate(" + this.constants.WIDTH/2 + ", 0)")
          .attr("y", this.constants.MARGINBOTTOM - this.constants.CHARTLABELSIZE)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .attr("font-size", this.constants.CHARTLABELSIZE)
          .text(this.params.charts[chart].xLabel);

      chartNew.append("g")
        .attr("class", "y-axis axis")
        .call(yAxis)
        .attr("font-size", this.constants.TICKLABELSIZE)
        .append("text")
          .attr("class", "bar-chart-label")
          .attr("transform", "rotate(-90)")
          .attr("x", -this.constants.HEIGHT/2)
          .attr("y", -1*this.constants.MARGINLEFT)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .attr("font-size", this.constants.CHARTLABELSIZE)
          .text(this.params.charts[chart].yLabel);

      let bars  = chartNew.selectAll(".bar")
        .data(this.params.charts[chart].data);
      bars.enter()
        .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.key); })
          .attr("height", (d) => { return this.constants.HEIGHT - y(d.value); })
          .attr("y", function(d) { return y(d.value); })
          .attr("width", x.bandwidth())
          .attr("fill", function(d, i) {return colorScale(i);});


      chartNew.transition()
        .duration(2000)
        .attr("transform", "translate(" + this.constants.CENTERX + ", " 
          + (this.constants.MARGINTOP*(numberDisplayed+1)+(this.constants.MARGINBOTTOM+this.constants.HEIGHT)*numberDisplayed) + ")");
    },
    showAll: function() {
      let svg = d3.select(this.$refs.svg);
      svg.attr("viewBox", "0 0 "
          + this.constants.CONTAINERWIDTH
          + " " + ((this.constants.HEIGHT + this.constants.MARGINTOP + this.constants.MARGINBOTTOM)*this.params.charts.length));

      this.params.charts.forEach((chart, index) => {
        if(document.getElementById("chart-" + index)!==null) {
          svg.select("#chart-" + index).transition()
            .duration(2000)
            .attr("transform", "translate(" + this.constants.CENTERX + ", " + (this.constants.MARGINTOP*(index+1)+(this.constants.MARGINBOTTOM+this.constants.HEIGHT)*index) + ")");
        } else {
          this.createNewChart(index, index);
        }
      });
    },
    renderChart: function() {
      d3.select(this.$refs.svg)
        .attr("class", "bar-chart-svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 "
          + this.constants.CONTAINERWIDTH
          + " " + (this.constants.HEIGHT + this.constants.MARGINTOP + this.constants.MARGINBOTTOM));

      this.createNewChart(0, 0);
    }
  },
  mounted () {
    this.renderChart();
  }
}
</script>