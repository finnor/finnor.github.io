<template>
  <div>
    <svg :id="id"></svg>
    <p class="chart-label" v-if="params.general.chartLabel">{{params.general.chartLabel}}</p>
  </div>
</template>
<style scoped>
.chart-label {
  text-align: center;
  font-weight: bold;
}
</style>
<script>
import * as d3 from "d3";
import {schemeCategory10} from "d3-scale-chromatic";

export default {
  data() {
    return {
      id: this.genId()
    }
  },
  props: {
    /**
     * Params for generating pie chart
     *
     *      {"general": {
     *           "width":,
     *           "height":,
     *           "outerRadius":,
     *           "innerRadius":,
     *           "element":,
     *           "isPercent":,
     *           "chartLabel":,
     *           },
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
  methods: {
    genId: function() {
      return 'chart-'+Math.random().toString(36).substring(7);
    },
    renderChart: function() {
      const ELEMENT = '#'+this.id;
      const WIDTH = this.params.general.width || 300;
      const HEIGHT = this.params.general.height || 150;
      const INNERRADIUS = this.params.general.innerRadius || 15;
      const OUTERRADIUS = this.params.general.outerRadius || 50;
      const LINETOLABELCORNER = OUTERRADIUS * 1.1;
      const LABELSIZE = OUTERRADIUS/4.5;
      const INNERTEXTSIZE = INNERRADIUS/1.5;
      const CENTER = [WIDTH / 2, HEIGHT/2];
      const ISPERCENT = this.params.general.isPercent || false;

      let pieData = this.params.data.sort(function(a, b) {
        return a.value - b.value;
      });
      let total = pieData.reduce((sum, a) => sum+a, 0);
      let isCreationCompleted = false;

      //Check for empty data set
      if (total===0) {
        pieData[pieData.length] = {"label": "No data", "value": 1, "link":null};
        total++;
      }

      //Create chart area
      const svg = d3.select(ELEMENT)
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g")
          .attr("transform", "translate(" + CENTER[0] + "," + CENTER[1] + ")");

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
      let chartLabel = function(d){
        if (d.data.value === 0) {
          return null;
        } else if (d.data.label==='No data') {
          return d.data.label;
        } else if (ISPERCENT) {
          return d.data.label;
        } else {
          return d.data.label + '(' + d.data.value + ')';
        }
      };

      //color scale
      let color = d3.scaleOrdinal(schemeCategory10);

      //Set radius for pie chart
      let arc = d3.arc()
        .outerRadius(OUTERRADIUS)
        .innerRadius(INNERRADIUS);


      //Set radius for labels
      let outerArc = d3.arc()
        .innerRadius(LINETOLABELCORNER)
        .outerRadius(LINETOLABELCORNER);

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
          .on("end", function() {
            isCreationCompleted = true;
          })

      //Elastic animation on hover
      sections.on("mouseover", hoverAction)
        //Return animation on mouseout
        .on('mouseout', mouseoutAction);

      sections.exit().remove();

      //Center Text
      let center_group_data = svg.append("g")
        .attr("transform", "translate(0, 0)");

      let pieCenterValue = center_group_data.append("text")
        .attr("dy", ".35em").attr("class", "chartCenterValue")
        .attr("text-anchor", "middle")
        .attr("font-size", INNERTEXTSIZE);

      //Returns the angle for the middle of a pie section
      function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
      }

      let previous = -1 * LINETOLABELCORNER;
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
          .attr("font-size", LABELSIZE)
          .attr("id", function(d, i) { return "label" + i })
          .transition().duration(2000)
            .attr("transform", function(d) {
              if (d.data.value===0) {
                return null;
              }
              let pos = outerArc.centroid(d);
              pos[0] = LINETOLABELCORNER*1.05 * (midAngle(d) < Math.PI ? 1 : -1);

              //If this and previous label are on the right side of the y-axis
              if (prevSide>0 && pos[0]>0) {
                //If there wasn't enough room between previous label and this label
                if (previous + LABELSIZE > pos[1]) {
                  pos[1] = previous + LABELSIZE;
                }
              //If this and previous label are on the left side of the y-axis
              } else if (prevSide<0 && pos[0]<0){
                //If there wasn't enough room between previous label and this label
                if (previous - LABELSIZE < pos[1]) {
                  pos[1] = previous - LABELSIZE;
                }
              }
              //Record previous side
              prevSide = pos[0];
              previous = pos[1];
              return "translate("+ pos +")";
            });

      //Elastic animation on hover
      text.on("mouseover", hoverAction)
        //Return animation on mouseout
        .on('mouseout', mouseoutAction);

      text.exit().remove();

      //Line from pie to label
      let polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(pieData), key);

      previous = -1 * LINETOLABELCORNER;
      prevSide = 0;
      polyline.enter()
        .append("polyline")
          .attr("stroke", "black")
          .style("opacity", 0.3)
          .style("fill", "none")
          .attr("stroke-width", 2)
          .transition().delay(2000)
          .attr("points", function(d){
            if (d.data.value===0) {
              return null;
            }
            let pos = outerArc.centroid(d);
            pos[0] = LINETOLABELCORNER * (midAngle(d) < Math.PI ? 1 : -1);

            //If this and previous label are on the right side of the y-axis
            if (prevSide>0 && pos[0]>0) {
              //If there wasn't enough room between previous label and this label
              if (previous + LABELSIZE > pos[1]) {
                pos[1] = previous + LABELSIZE;
              }
            //If this and previous label are on the left side of the y-axis
            } else if (prevSide<0 && pos[0]<0){
              //If there wasn't enough room between previous label and this label
              if (previous - LABELSIZE < pos[1]) {
                pos[1] = previous - LABELSIZE;
              }
            }
            //Record previous side
            prevSide = pos[0];
            previous = pos[1];
            return [arc.centroid(d), outerArc.centroid(d), pos];
          });

      //Elastic animation on hover
      function hoverAction(event, data) {
        //No animation unless creation completed
        if (isCreationCompleted) {
          d3.select(ELEMENT + " #path" + data.index)
            .transition()
              .duration(500)
              .ease(d3.easeBackOut)
            .attr('transform', function (d) {
              let dist = 0.05 * OUTERRADIUS;
              d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
              let x = Math.sin(d.midAngle) * dist;
              let y = -Math.cos(d.midAngle) * dist;
              return 'translate(' + x + ',' + y + ')';
            });


          //Bold label text
          d3.select(ELEMENT + ' #label' +  data.index)
            .attr("font-weight", "bold");


          //Set center text to percentage of total
          let percent = ((data.data.value / total)*100);
          if (percent%1 > 0)
            percent = percent.toFixed(1);
          else
            percent = percent.toFixed(0);
          //Set center text
            pieCenterValue.text(percent + "%");
        }
      }


      //Return animation on mouseout
      function mouseoutAction(event, data) {
        //No animation unless creation completed
        if (isCreationCompleted) {
          //Return animation
          d3.select(ELEMENT + ' #path' + data.index)
            .transition()
              .duration(500)
              .ease(d3.easeBackIn)
              .attr('transform', 'translate(0,0)')

          //Unbold label text
          d3.select(ELEMENT + ' #label' + data.index)
            .attr("font-weight", null);

          //Clear text on leave
          pieCenterValue.text(null);
        }
      }
    }
  },
  mounted () {
    this.renderChart();
  }
}
</script>