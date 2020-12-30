<template>
  <div ref="container" class="text-center">
    <h3 v-if="this.params.chartLabel">{{this.params.chartLabel}}</h3>
    <svg ref="svg"></svg>
    <div class="gauge-footer font-weight-bold"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import gaugeStatuses from "@/config/gaugeStatuses.json";

export default {
  name: 'GaugeChart',
  props: {
    /**
     * Params for generating gauge chart
     *
     *      "size":,
     *      
     *      "pointerWidth":,
     *      "pointerTailLength":,
     *      "pointerTailLengthPercent":,
     *      
     *      "clipWidth":
     *      "clipHeight":
     *      
     *      "ringInset":
     *      "ringWidth":
     *      "labelInset":
     *      
     *      "minAngle":
     *      "maxAngle":
     *                  
     *      "minValue": 
     *      "maxValue":
     *      "majorTicks":
     *      
     *      "lowThreshold":
     *      "highThreshold":
     *      "lowThresholdColor":
     *      "mediumThresholdColor":
     *      "highThresholdColor":
     *      
     *      "transitionTime":
     *      
     *      "labelFormat":
     *      "rotateLabels":
     *      
     *      "chartLabel":
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
      const SIZE = this.params.size ?? this.$refs.container.clientWidth;
      const RADIUS = SIZE/2;
      const POINTERWIDTH = this.params.pointerWidth ?? SIZE/60;
      const POINTERTAILLENGTH = this.params.pointerTailLength ?? SIZE/80;
      const POINTERHEADLENGTPERCENT = this.params.pointerHeadLengthPercent ?? 0.8;
      const POINTERHEADLENGTH = Math.round(RADIUS * POINTERHEADLENGTPERCENT);
      const CLIPWIDTH = this.params.clipWidth ?? SIZE;
      const CLIPHEIGHT = this.params.clipHeight ?? SIZE/2 + 2*POINTERTAILLENGTH;
      const RINGINSET = this.params.ringInset ?? RADIUS/10;
      const RINGWIDTH = this.params.ringWidth ?? RADIUS/20;
      const LABELINSET = this.params.labelInset ?? RADIUS/10;
      const MINANGLE = -70;
      const MAXANGLE = 70;
      const RANGE = MAXANGLE - MINANGLE;
      const MINVALUE = this.params.minValue ?? 0;
      const MAXVALUE = this.params.maxValue ?? 100;
      const MAJORTICKS = this.params.majorTicks ?? ((MAXVALUE-MINVALUE)/10);
      const LOWTHRESHOLD = this.params.lowThreshold ?? 33;
      const HIGHTHRESHOLD = this.params.highThreshold ?? 67;
      const LOWTHRESHOLDCOLOR = this.params.lowThresholdColor ?? '#B22222';
      const MEDIUMTHRESHOLDCOLOR = this.params.mediumThresholdColor ?? '#4682b4';
      const HIGHTHRESHOLDCOLOR = this.params.highThreshold ?? '#008000';
      const TRANSITIONTIME = this.params.transitionTime ?? 2000;
      const LABELFORMAT = this.params.labelFormat ?? d3.format('d');
      const ROTATELABELS = this.params.rotateLabels ?? true;
      return {
        SIZE: SIZE,
        RADIUS: RADIUS,
        POINTERWIDTH: POINTERWIDTH,
        POINTERTAILLENGTH: POINTERTAILLENGTH,
        POINTERHEADLENGTPERCENT: POINTERHEADLENGTPERCENT,
        POINTERHEADLENGTH: POINTERHEADLENGTH,
        CLIPWIDTH: CLIPWIDTH,
        CLIPHEIGHT: CLIPHEIGHT,
        RINGINSET: RINGINSET,
        RINGWIDTH: RINGWIDTH,
        LABELINSET: LABELINSET,
        MINANGLE: MINANGLE,
        MAXANGLE: MAXANGLE,
        RANGE: RANGE,
        MINVALUE: MINVALUE,
        MAXVALUE: MAXVALUE,
        MAJORTICKS: MAJORTICKS,
        LOWTHRESHOLD: LOWTHRESHOLD,
        HIGHTHRESHOLD: HIGHTHRESHOLD,
        LOWTHRESHOLDCOLOR: LOWTHRESHOLDCOLOR,
        MEDIUMTHRESHOLDCOLOR: MEDIUMTHRESHOLDCOLOR,
        HIGHTHRESHOLDCOLOR: HIGHTHRESHOLDCOLOR,
        TRANSITIONTIME: TRANSITIONTIME,
        LABELFORMAT: LABELFORMAT,
        ROTATELABELS: ROTATELABELS
      }
    }
  },
  methods: {
    renderChart: function() {
      let arcColorFn;
      let numberDiv;
      let arc;
      let scale;
      let ticks;
      let tickData;
      let pointer;


      let deg2rad = function(deg) {
        return deg * Math.PI / 180;
      };

      // a linear scale that maps domain values to a percent from 0..1
      scale = d3.scaleLinear()
        .range([0,1])
        .domain([this.constants.MINVALUE, this.constants.MAXVALUE]);

      let colorDomain = [this.constants.LOWTHRESHOLD, this.constants.HIGHTHRESHOLD, this.constants.MAXVALUE].map(scale),
          colorRange  = [this.constants.LOWTHRESHOLDCOLOR, this.constants.MEDIUMTHRESHOLDCOLOR, this.constants.HIGHTHRESHOLDCOLOR];

      arcColorFn = d3.scaleLinear().domain(colorDomain).range(colorRange);
      ticks = scale.ticks(this.constants.MAXVALUE/this.constants.MAJORTICKS);
      tickData = [this.constants.LOWTHRESHOLD, this.constants.HIGHTHRESHOLD, this.constants.MAXVALUE]
        .map(function(d) {return scale(d); });

      arc = d3.arc()
        .innerRadius(this.constants.RADIUS - this.constants.RINGWIDTH - this.constants.RINGINSET)
        .outerRadius(this.constants.RADIUS - this.constants.RINGINSET)
        .startAngle((d, i) => {
          let ratio = i > 0 ? tickData[i-1] : this.constants.MINVALUE;
          return deg2rad(this.constants.MINANGLE + (ratio * this.constants.RANGE));
        })
        .endAngle((d, i) => {
          let ratio = tickData[i];
          return deg2rad(this.constants.MINANGLE + (ratio * this.constants.RANGE));
        });

      let centerTranslation = () => {
        return 'translate('+ this.constants.RADIUS +','+ this.constants.RADIUS +')';
      }

      let render = (newValue, newStatus) => {
        const svg = d3.select(this.$refs.svg)
          .attr('class', 'gauge')
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "0 0 "
            + this.constants.CLIPWIDTH
            + " " + this.constants.CLIPHEIGHT);

        let centerTx = centerTranslation();

        let arcs = svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);

        arcs.selectAll('path')
          .data(tickData)
          .enter().append('path')
            .attr('fill', function(d) {
              return arcColorFn(d - 0.001);
            })
            .attr('d', arc);

        let lg = svg.append('g')
          .attr('class', 'label')
          .attr('transform', centerTx);



        lg.selectAll('text')
          .data(ticks)
          .enter().append('text')
            .attr('transform', (d) => {
              if (this.constants.ROTATELABELS) {
                let ratio = scale(d);
                let newAngle = this.constants.MINANGLE + (this.constants.RANGE*ratio);
                  return 'rotate(' +newAngle +') translate(0,' +(this.constants.LABELINSET + this.constants.RINGINSET + this.constants.RINGWIDTH - this.constants.RADIUS) +')';
              } else {
                let ratio = scale(d);
                let newAngle = deg2rad(this.constants.MINANGLE + (ratio * this.constants.RANGE)),
                y = (this.constants.LABELINSET + this.constants.RINGINSET + this.constants.RINGWIDTH - this.constants.RADIUS) * Math.cos(newAngle),
                x =  -1 * (this.constants.LABELINSET + this.constants.RINGINSET + this.constants.RINGWIDTH - this.constants.RADIUS) * Math.sin(newAngle);
                return 'translate(' + x + ',' + y +')';
              }
            })
            .text(this.constants.LABELFORMAT);

        lg.selectAll('line')
          .data(ticks)
          .enter().append('line')
            .attr('class', 'tickline')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', this.constants.RINGWIDTH * 2 - this.constants.RINGINSET / 1.5)
            .attr('transform', (d) => {
              let ratio = scale(d);
              let newAngle = this.constants.MINANGLE + (this.constants.RANGE * ratio);
              return 'rotate(' +newAngle +') translate(0,' + (this.constants.RINGINSET + this.constants.RINGWIDTH - this.constants.RADIUS) +')';
            })
            .style('stroke', '#666')
            .style('stroke-width', '1px');

        let lineData = [
          [this.constants.POINTERWIDTH / 2, 0],
          [0, -this.constants.POINTERHEADLENGTH],
          [-(this.constants.POINTERWIDTH / 2), 0],
          [0, this.constants.POINTERTAILLENGTH],
          [this.constants.POINTERWIDTH / 2, 0]
        ];

        let pointerLine = d3.line().curve(d3.curveMonotoneX);

        let pg = svg.append('g').data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg.append('path')
          .attr('d', pointerLine )
          .attr('transform', 'rotate(' + this.constants.MINANGLE +')');

        numberDiv = d3.select('.gauge-footer');

        numberDiv.append('div')
          .data([newValue])
          .attr('class', 'gauge-value');

        numberDiv.append('div')
          .text([newStatus])
          .attr('class', 'gauge-status');

        update(newValue === undefined ? 0 : newValue, newStatus === undefined ? "" : newStatus);
      }

      let update = (newValue, newStatus) => {
        let value = [newValue];

        let ratio = scale(newValue);
        let newAngle = this.constants.MINANGLE + (ratio * this.constants.RANGE);

        pointer.transition()
          .duration(this.constants.TRANSITIONTIME)
            .ease(d3.easeCubicInOut)
            .attr('transform', 'rotate(' +newAngle +')');

        d3.select('.gauge-value')
          .data(value)
          .transition()
            .duration(this.constants.TRANSITIONTIME)
            .ease(d3.easeQuad)
            .style('color', arcColorFn( scale(newValue) ))
            .tween("text", function(d) {
              let i = d3.interpolate((this.textContent).replace("%", ""), d);

              return function(t) {
                this.textContent = Math.floor(i(t)) + "%";
              };
            });

        d3.select('.gauge-status')
          .text(newStatus);
      }

      render();


      let updateReadings = function() {
        let currentdate = new Date();
        let hour = currentdate.getHours();
        if(hour>=8 && hour<17) {
          if(hour===11) {
            update(0, "At lunch");
          } else {
            let outcome = getAWorkReading();
            update(outcome.efficiency, outcome.status);
          }
        } else {
          update(0, "At home");
        }
      }

      let getAWorkReading = () => {
        let typeOfOutcome = Math.random();
        let outcome = {
            "efficiency" : 0,
            "status" : "",
        };

        //If Normal operation
        if (typeOfOutcome>.3) {
          outcome.efficiency = (Math.random()*11)+90;
          outcome.status = getStatus("good");
        //Else if an small hiccup
        } else if (typeOfOutcome >.1){
          outcome.efficiency = (Math.random()*(this.constants.HIGHTHRESHOLD-this.constants.LOWTHRESHOLD)) + this.constants.LOWTHRESHOLD;
          outcome.status = getStatus("hiccup");
        //Else a disaster
        } else {
          outcome.efficiency = (Math.random()*this.constants.LOWTHRESHOLD);
          outcome.status = getStatus("disaster");
        }
        return outcome;
      }

      let getStatus = function(type) {
        let randomIndex = Math.floor(Math.random()*gaugeStatuses[type].length);
        return (gaugeStatuses[type][randomIndex]);
      }

      // every few seconds update reading values
      updateReadings();
      setInterval(function() {
        updateReadings();
      }, 5000)
    }
  },
  mounted () {
    this.renderChart();
  }
}
</script>