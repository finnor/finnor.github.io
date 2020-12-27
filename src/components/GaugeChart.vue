<template>
  <div class="text-center">
    <h3 v-if="this.params.general.chartLabel">{{this.params.general.chartLabel}}</h3>
    <svg :id="id"></svg>
    <div class="gauge-footer"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: 'GaugeChart',
  data() {
    return {
      id: this.genId()
    }
  },
  props: {
    /**
     * Params for generating gauge chart
     *
     *      {"general": {
     *        "size":,
     *        
     *        "pointerWidth":,
     *        "pointerTailLength":,
     *        "pointerTailLengthPercent":,
     *        
     *        "clipWidth":
     *        "clipHeight":
     *        
     *        "ringInset":
     *        "ringWidth":
     *        "labelInset":
     *        
     *        "minAngle":
     *        "maxAngle":
     *                    
     *        "minValue": 
     *        "maxValue":
     *        "majorTicks":
     *        
     *        "lowThreshold":
     *        "highThreshold":
     *        "lowThresholdColor":
     *        "mediumThresholdColor":
     *        "highThresholdColor":
     *        
     *        "transitionTime":
     *        
     *        "labelFormat":
     *        "rotateLabels":
     *        
     *        "chartLabel":
     *        },
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
      const SIZE = this.params.general.size || 400;
      const RADIUS = SIZE/2;
      const POINTERWIDTH = this.params.general.pointerWidth || SIZE/60;
      const POINTERTAILLENGTH = this.params.general.pointerTailLength || SIZE/80;
      const POINTERHEADLENGTPERCENT = this.params.general.pointerHeadLengthPercent || 0.8;
      const POINTERHEADLENGTH = Math.round(RADIUS * POINTERHEADLENGTPERCENT);
      const CLIPWIDTH = this.params.general.clipWidth || SIZE;
      const CLIPHEIGHT = this.params.general.clipHeight || SIZE/2 + 2*POINTERTAILLENGTH;
      const RINGINSET = this.params.general.ringInset || RADIUS/10;
      const RINGWIDTH = this.params.general.ringWidth || RADIUS/20;
      const LABELINSET = this.params.general.labelInset || RADIUS/10;
      const MINANGLE = -70;
      const MAXANGLE = 70;
      const RANGE = MAXANGLE - MINANGLE;
      const MINVALUE = this.params.general.minValue || 0;
      const MAXVALUE = this.params.general.maxValue || 100;
      const MAJORTICKS = this.params.general.majorTicks || ((MAXVALUE-MINVALUE)/10);
      const LOWTHRESHOLD = this.params.general.lowThreshold || 33;
      const HIGHTHRESHOLD = this.params.general.highThreshold || 67;
      const LOWTHRESHOLDCOLOR = this.params.general.lowThresholdColor || '#B22222';
      const MEDIUMTHRESHOLDCOLOR = this.params.general.mediumThresholdColor || 'steelblue';
      const HIGHTHRESHOLDCOLOR = this.params.general.highThreshold || '#008000';
      const TRANSITIONTIME = this.params.general.transitionTime || 2000;
      const LABELFORMAT = this.params.general.labelFormat || d3.format('d');
      const ROTATELABELS = this.params.general.rotateLabels || true;

      let arcColorFn;
      let numberDiv;
      let svg;
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
        .domain([MINVALUE, MAXVALUE]);

      let colorDomain = [LOWTHRESHOLD, HIGHTHRESHOLD, MAXVALUE].map(scale),
          colorRange  = [LOWTHRESHOLDCOLOR, MEDIUMTHRESHOLDCOLOR, HIGHTHRESHOLDCOLOR];

      arcColorFn = d3.scaleLinear().domain(colorDomain).range(colorRange);
      ticks = scale.ticks(MAXVALUE/MAJORTICKS);
      tickData = [LOWTHRESHOLD, HIGHTHRESHOLD, MAXVALUE]
        .map(function(d) {return scale(d); });

      arc = d3.arc()
        .innerRadius(RADIUS - RINGWIDTH - RINGINSET)
        .outerRadius(RADIUS - RINGINSET)
        .startAngle(function(d, i) {
          let ratio = i > 0 ? tickData[i-1] : MINVALUE;
          return deg2rad(MINANGLE + (ratio * RANGE));
        })
        .endAngle(function(d, i) {
          let ratio = tickData[i];
          return deg2rad(MINANGLE + (ratio * RANGE));
        });

      let centerTranslation = function() {
        return 'translate('+ RADIUS +','+ RADIUS +')';
      }

      let render = function(newValue, newStatus) {
        svg = d3.select(ELEMENT)
          .attr('class', 'gauge')
          .attr('width', CLIPWIDTH)
          .attr('height', CLIPHEIGHT);

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
            .attr('transform', function(d) {
              if (ROTATELABELS) {
                let ratio = scale(d);
                let newAngle = MINANGLE + (RANGE*ratio);
                  return 'rotate(' +newAngle +') translate(0,' +(LABELINSET + RINGINSET + RINGWIDTH - RADIUS) +')';
              } else {
                let ratio = scale(d);
                let newAngle = deg2rad(MINANGLE + (ratio * RANGE)),
                y = (LABELINSET + RINGINSET + RINGWIDTH - RADIUS) * Math.cos(newAngle),
                x =  -1 * (LABELINSET + RINGINSET + RINGWIDTH - RADIUS) * Math.sin(newAngle);
                return 'translate(' + x + ',' + y +')';
              }
            })
            .text(LABELFORMAT);

        lg.selectAll('line')
          .data(ticks)
          .enter().append('line')
            .attr('class', 'tickline')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', RINGWIDTH * 2 - RINGINSET / 1.5)
            .attr('transform', function(d) {
              let ratio = scale(d);
              let newAngle = MINANGLE + (RANGE * ratio);
              return 'rotate(' +newAngle +') translate(0,' + (RINGINSET + RINGWIDTH - RADIUS) +')';
            })
            .style('stroke', '#666')
            .style('stroke-width', '1px');

        let lineData = [
          [POINTERWIDTH / 2, 0],
          [0, -POINTERHEADLENGTH],
          [-(POINTERWIDTH / 2), 0],
          [0, POINTERTAILLENGTH],
          [POINTERWIDTH / 2, 0]
        ];

        let pointerLine = d3.line().curve(d3.curveMonotoneX);

        let pg = svg.append('g').data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg.append('path')
          .attr('d', pointerLine )
          .attr('transform', 'rotate(' + MINANGLE +')');

        numberDiv = d3.select('.gauge-footer');

        numberDiv.append('div')
          .data([newValue])
          .attr('class', 'gauge-value');

        numberDiv.append('div')
          .text([newStatus])
          .attr('class', 'gauge-status');

        update(newValue === undefined ? 0 : newValue, newStatus === undefined ? "" : newStatus);
      }

      let update = function(newValue, newStatus) {
        let value = [newValue];

        let ratio = scale(newValue);
        let newAngle = MINANGLE + (ratio * RANGE);

        pointer.transition()
          .duration(TRANSITIONTIME)
            .ease(d3.easeCubicInOut)
            .attr('transform', 'rotate(' +newAngle +')');

        d3.select('.gauge-value')
          .data(value)
          .transition()
            .duration(TRANSITIONTIME)
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

      let getAWorkReading = function() {
        let typeOfOutcome = Math.random();
        let outcome = {
            "efficiency" : 0,
            "status" : "",
        };

        //If Normal operation
        if (typeOfOutcome>.3) {
          outcome.efficiency = (Math.random()*11)+90;
          outcome.status = getStatus(0);
        //Else if an small hiccup
        } else if (typeOfOutcome >.1){
          outcome.efficiency = (Math.random()*(HIGHTHRESHOLD-LOWTHRESHOLD)) + LOWTHRESHOLD;
          outcome.status = getStatus(1);
        //Else a disaster
        } else {
          outcome.efficiency = (Math.random()*LOWTHRESHOLD);
          outcome.status = getStatus(2);
        }
        return outcome;
      }

      let goodStatus = [
        "Things are going swell!",
      ];
      let hiccupStatus = [
        "I didn't even change anything?!?",
        "Someone's birthday",
        "It seemed superfluous at the time.",
        "Compiling.",
        "Running regression tests.",
      ];
      let disasterStatus = [
        "Uh oh, cat got in the server!",
        "Fondue day was a big mistake!",
        "Cosmic ray?",
      ];
      let getStatus = function(type) {
        let statusIndexRand = Math.random();
        let temp;
        switch (type) {
          case 0:
            temp = Math.floor(statusIndexRand*goodStatus.length);
            return (goodStatus[temp]);
          case 1:
            temp = Math.floor(statusIndexRand*hiccupStatus.length);
            return (hiccupStatus[temp]);
          case 2:
            temp = Math.floor(statusIndexRand*disasterStatus.length);
            return (disasterStatus[temp]);
          default:
            return null;
        }
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