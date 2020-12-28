<template>
  <div ref="container" class="text-center">
    <h3 v-if="params.chartLabel">{{params.chartLabel}}</h3>
    <svg ref="svg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import {schemeCategory10} from "d3-scale-chromatic";

export default {
  name: 'DonutChart',
  data() {
    return {
      isCreated: false,
    }
  },
  props: {
    /**
     * Params for generating pie chart
     *
     *       "width":,
     *       "height":,
     *       "outerRadius":,
     *       "innerRadius":,
     *       "isPercent":,
     *       "chartLabel":,
     *       "data": {
     *           "label":,
     *           "value":,
     *           "link":,
     *           "linkParam1":,
     *           "linkParam2":
     *           }
     *       }
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
      const WIDTH = this.params.width ?? this.$refs.container.clientWidth;
      const HEIGHT = this.params.height ?? WIDTH/2;
      const INNERRADIUS = this.params.innerRadius ?? WIDTH/18;
      const OUTERRADIUS = this.params.outerRadius ?? WIDTH/6;
      const LINETOLABELCORNER = OUTERRADIUS * 1.1;
      const LABELSIZE = OUTERRADIUS/4.5;
      const INNERTEXTSIZE = INNERRADIUS/1.5;
      const CENTER = [WIDTH / 2, HEIGHT/2];
      const ISPERCENT = this.params.isPercent || false;
      const CHARTTOTAL = this.params.data.reduce((sum, a) => sum+a.value, 0);
      return {
        WIDTH: WIDTH,
        HEIGHT: HEIGHT,
        INNERRADIUS: INNERRADIUS,
        OUTERRADIUS: OUTERRADIUS,
        LINETOLABELCORNER: LINETOLABELCORNER,
        LABELSIZE: LABELSIZE,
        INNERTEXTSIZE: INNERTEXTSIZE,
        CENTER: CENTER,
        ISPERCENT: ISPERCENT,
        CHARTTOTAL: CHARTTOTAL
      }
    }
  },
  methods: {
    hoverAction: function(event, data) {
      //No animation unless creation completed
      if (this.isCreated) {
        const svg = d3.select(this.$refs.svg);
        svg.select("#path" + data.index)
          .transition()
            .duration(500)
            .ease(d3.easeBackOut)
          .attr('transform', (d) => {
            let dist = 0.05 * this.constants.OUTERRADIUS;
            d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
            let x = Math.sin(d.midAngle) * dist;
            let y = -Math.cos(d.midAngle) * dist;
            return 'translate(' + x + ',' + y + ')';
          });


        //Bold label text
        svg.select("#label" +  data.index)
          .attr("font-weight", "bold");


        //Set center text to percentage of total
        let percent = ((data.data.value / ((this.constants.CHARTTOTAL>0) ? this.constants.CHARTTOTAL : 1))*100);
        if (percent%1 > 0)
          percent = percent.toFixed(1);
        else
          percent = percent.toFixed(0);
        //Set center text
        d3.select(".chartCenterValue").text(percent + "%");
      }
    },
    mouseoutAction: function(event, data) {
      //No animation unless creation completed
      if (this.isCreated) {
        const svg = d3.select(this.$refs.svg);
        //Return animation
        svg.select("#path" + data.index)
          .transition()
            .duration(500)
            .ease(d3.easeBackIn)
            .attr('transform', 'translate(0,0)')

        //Unbold label text
        svg.select("#label" + data.index)
          .attr("font-weight", null);

        //Clear text on leave
        d3.select(".chartCenterValue").text(null);
      }
    },
    renderChart: function() {
      let pieData = this.params.data.sort(function(a, b) {
        return a.value - b.value;
      });

      //Check for empty data set
      if (this.constants.CHARTTOTAL===0) {
        pieData[pieData.length] = {"label": "No data", "value": 1};
      }

      //Create chart area
      const svg = d3.select(this.$refs.svg)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 "
          + this.constants.WIDTH
          + " " + this.constants.HEIGHT)
        .append("g")
          .attr("transform", "translate(" + this.constants.CENTER[0] + "," + this.constants.CENTER[1] + ")");

      //Create section for labels and lines to them
      svg.append("g")
        .attr("class", "labels");
      svg.append("g")
        .attr("class", "lines");

      //Function that will return the label for a given section
      let key = function(d){
        if (d.data.value === 0)
          return null;
        else
          return d.data.label;
      };

      //Function that will return the label for a given section
      let chartLabel = (d) => {
        if (d.data.value === 0) {
          return null;
        } else if (d.data.label==='No data') {
          return d.data.label;
        } else if (this.constants.ISPERCENT) {
          return d.data.label;
        } else {
          return d.data.label + '(' + d.data.value + ')';
        }
      };

      //color scale
      let color = d3.scaleOrdinal(schemeCategory10);

      //Set radius for pie chart
      let arc = d3.arc()
        .outerRadius(this.constants.OUTERRADIUS)
        .innerRadius(this.constants.INNERRADIUS);


      //Set radius for labels
      let outerArc = d3.arc()
        .innerRadius(this.constants.LINETOLABELCORNER)
        .outerRadius(this.constants.LINETOLABELCORNER);

      //Create pie chart
      let pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.value; });

      //create sections
      let sections = svg.selectAll(".arc")
        .data(pie(pieData))
        .enter().append("g")
          .attr("class", "arc");

      sections.append("path")
        .attr("d", arc)
        .attr("id", function(d, i) {return "path" + i;})
        .attr("fill", function(d, i) {return color(i);})
        //Fill animation when loading pie chart
        .transition()
          .ease(d3.easeSin)
          .duration(2000)
          //Performs the interpolation for the pie chart as it transitions to fill the entire pie
          .attrTween("d", function (b) {
            let i = d3.interpolate({startAngle: 1*Math.PI, endAngle: 1*Math.PI}, b);
            return function(t) {
              return arc(i(t));
            };
          })
          //On end of transition set creation completed flag
          //So other transitions can be used
          .on("end", () => {
            this.isCreated = true;
          })

      //Elastic animation on hover
      sections.on("mouseover", this.hoverAction)
        //Return animation on mouseout
        .on('mouseout', this.mouseoutAction);

      sections.exit().remove();

      //Center Text
      svg.append("g")
        .attr("transform", "translate(0, 0)")
        .append("text")
          .attr("dy", ".35em").attr("class", "chartCenterValue")
          .attr("text-anchor", "middle")
          .attr("font-size", this.constants.INNERTEXTSIZE);

      //Returns the angle for the middle of a pie section
      function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
      }

      let previous = -1 * this.constants.LINETOLABELCORNER;
      let prevSide = 0;
      //Create labels
      let text = svg.select(".labels").selectAll("text")
        .data(pie(pieData), key);

      text.enter()
        .append("text")
          .attr("dy", ".35em")
          .text(chartLabel)
          .style("text-anchor", function(d){
            return midAngle(d) < Math.PI ? "start":"end";
          })
          .style("cursor", "default")
          .attr("font-size", this.constants.LABELSIZE)
          .attr("id", function(d, i) { return "label" + i })
          //Elastic animation on hover
          .on("mouseover", this.hoverAction)
          //Return animation on mouseout
          .on('mouseout', this.mouseoutAction)
          .transition().duration(2000)
            .attr("transform", (d) => {
              if (d.data.value===0) {
                return null;
              }
              let pos = outerArc.centroid(d);
              pos[0] = this.constants.LINETOLABELCORNER*1.05 * (midAngle(d) < Math.PI ? 1 : -1);

              //If this and previous label are on the right side of the y-axis
              if (prevSide>0 && pos[0]>0) {
                //If there wasn't enough room between previous label and this label
                if (previous + this.constants.LABELSIZE > pos[1]) {
                  pos[1] = previous + this.constants.LABELSIZE;
                }
              //If this and previous label are on the left side of the y-axis
              } else if (prevSide<0 && pos[0]<0){
                //If there wasn't enough room between previous label and this label
                if (previous - this.constants.LABELSIZE < pos[1]) {
                  pos[1] = previous - this.constants.LABELSIZE;
                }
              }
              //Record previous side
              prevSide = pos[0];
              previous = pos[1];
              return "translate("+ pos +")";
            });

      text.exit().remove();

      //Line from pie to label
      let polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(pieData), key);

      previous = -1 * this.constants.LINETOLABELCORNER;
      prevSide = 0;
      polyline.enter()
        .append("polyline")
          .attr("stroke", "black")
          .style("opacity", 0.3)
          .style("fill", "none")
          .attr("stroke-width", 2)
          .transition().delay(2000)
          .attr("points", (d) => {
            if (d.data.value===0) {
              return null;
            }
            let pos = outerArc.centroid(d);
            pos[0] = this.constants.LINETOLABELCORNER * (midAngle(d) < Math.PI ? 1 : -1);

            //If this and previous label are on the right side of the y-axis
            if (prevSide>0 && pos[0]>0) {
              //If there wasn't enough room between previous label and this label
              if (previous + this.constants.LABELSIZE > pos[1]) {
                pos[1] = previous + this.constants.LABELSIZE;
              }
            //If this and previous label are on the left side of the y-axis
            } else if (prevSide<0 && pos[0]<0){
              //If there wasn't enough room between previous label and this label
              if (previous - this.constants.LABELSIZE < pos[1]) {
                pos[1] = previous - this.constants.LABELSIZE;
              }
            }
            //Record previous side
            prevSide = pos[0];
            previous = pos[1];
            return [arc.centroid(d), outerArc.centroid(d), pos];
          });
    }
  },
  mounted () {
    this.renderChart();
  }
}
</script>