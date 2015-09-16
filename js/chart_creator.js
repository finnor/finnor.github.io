/**
 * Generate a D3 pie chart with labels
 *
 * @param data = 
 *               {"general": {
 *                    "width":,
 *                    "height":,
 *                    "outerRadius":,
 *                    "innerRadius":,
 *                    "element":,
 *                    "isPercent":,
 *                    "chartLabel":,
 *                    },
 *                "data": {
 *                    "label":,
 *                    "value":,
 *                    "link":,
 *                    "linkParam1":,
 *                    "linkParam2":
 *                    } 
 *                }                     
 *     
 *  
 * @return void
 */
function generatePieChart(params) {
    var WIDTH = params.general.width || 300;
    var HEIGHT = params.general.height || WIDTH/2;
    var INNERRADIUS = params.general.innerRadius || WIDTH/20;
    var OUTERRADIUS = params.general.outerRadius || WIDTH/6;
    var ELEMENT = params.general.element || null;
    var LINETOLABELCORNER = OUTERRADIUS * 1.1;
    var LABELSIZE = OUTERRADIUS/4.5;
    var INNERTEXTSIZE = INNERRADIUS/1.5; 
    var CENTER = [WIDTH / 2, HEIGHT/2];
    var ISPERCENT = params.general.isPercent;
    var CHARTLABEL = params.general.chartLabel;

    var pieData = params.data.sort(function(a, b) {
    	return a.value - b.value;
    });
    var isCreationCompleted = false;

    var total = 0;
    for(var i=0; i<pieData.length; i++) {
        total+= pieData[i].value;
    }

    //Check for empty data set
    if (total===0) {
        pieData[pieData.length] = {"label": "No data", "value": 1, "link":null};
        total++;
    }

    var headerDiv = d3.select(ELEMENT)
    	.append('div')
    	.attr('class', 'chart-header')
    	.style('width', WIDTH + 'px')
    	.text(CHARTLABEL);

    //Create chart area
    var svg = d3.select(ELEMENT)
    	.append('div')
    	.append("svg")
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
    var key = function(d){ 
        if (d.data.value === 0)
            return null;
        else
            return d.data.label; 
    };

    //Function that will return the label for a given section
    var chartLabel = function(d){
        if (d.data.value === 0)
            return null;
        else {
            if (d.data.label==='No data')
                return d.data.label;
            else {
            	if (ISPERCENT)
            		return d.data.label;
            	else
            		return d.data.label + '(' + d.data.value + ')';
            }
        }
    };

    //color scale
    var color = d3.scale.category20();

    //Set radius for pie chart
    var arc = d3.svg.arc()
        .outerRadius(OUTERRADIUS)
        .innerRadius(INNERRADIUS);


    //Set radius for labels
    var outerArc = d3.svg.arc()
	.innerRadius(LINETOLABELCORNER)
	.outerRadius(LINETOLABELCORNER);

    //Create pie chart
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    //create sections
    var g = svg.selectAll(".arc")
        .data(pie(pieData))
        .enter().append("g")
            .attr("class", "arc");

    g.append("path")  
        .attr("d", arc)
        .attr("id", function(d, i) {return "path" + i;})
        .attr("fill", function(d, i) {return color(i);})
        //Fill animation when loading pie chart
        .transition() 
            .ease("exp")
            .duration(2000)
            //Performs the interpolation for the pie chart as it transitions to fill the entire pie
            .attrTween("d", function (b) {
                var i = d3.interpolate({startAngle: 1*Math.PI, endAngle: 1*Math.PI}, b);
                return function(t) {
                    return arc(i(t));
                };
            })
            //On end of transition set creation completed flag
            //So other transitions can be used
            .each("end", function() {
                isCreationCompleted = true;
            });

    //Elastic animation on hover
    g.on("mouseover", hoverAction)
        //Return animation on mouseout
        .on('mouseout', mouseoutAction)
        //Do something on click
        .on('click', clickAction);

    //Center Text 
    var center_group_data = svg.append("g")
        .attr("transform", "translate(0, 0)");

    var pieCenterValue = center_group_data.append("text")
        .attr("dy", ".35em").attr("class", "chartCenterValue")
        .attr("text-anchor", "middle")
        .attr("font-size", INNERTEXTSIZE);


    //Create labels
    var text = svg.select(".labels").selectAll("text")
        .data(pie(pieData), key);

    text.enter()
        .append("text")
            .attr("dy", ".35em")
            .text(chartLabel);

    //Returns the angle for the middle of a pie section	
    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    var previous = -1 * LINETOLABELCORNER;
    var prevSide = 0;

    text.transition().duration(2000)
        .attr("transform", function(d) {
            if (d.data.value===0) {
                return null;
            }
            var pos = outerArc.centroid(d);
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
        })
        .style("text-anchor", function(d){
            return midAngle(d) < Math.PI ? "start":"end";
        })
        .style("cursor", "default")
        .attr("font-size", LABELSIZE)
        .attr("id", function(d, i) { return "label" + i; });
   //Elastic animation on hover
   text.on("mouseover", hoverAction)
        //Return animation on mouseout
        .on('mouseout', mouseoutAction)
        //Do something on click
        .on('click', clickAction);

    //Line from pie to label
    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(pieData), key);
	
    polyline.enter()
        .append("polyline");


    var previous = -1 * LINETOLABELCORNER;
    var prevSide = 0;
    polyline.transition().delay(2000)
        .attr("points", function(d){
            if (d.data.value===0) {
                return null;
            }
            var pos = outerArc.centroid(d);
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
    function hoverAction(d, i) {
        //No animation unless creation completed
        if (isCreationCompleted) {
            d3.select(ELEMENT + " #path" + i)
                .transition()
                    .duration(500)
                    .ease('elastic')
                .attr('transform', function (d) {
                    var dist = 0.05 * OUTERRADIUS;
                    d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                    var x = Math.sin(d.midAngle) * dist;
                    var y = -Math.cos(d.midAngle) * dist;
                    return 'translate(' + x + ',' + y + ')';
        });


            //Bold label text
            d3.select(ELEMENT + " #label" +  i)
                .attr("font-weight", "bold");


            //Set center text to percentage of total
            percent = ((d.data.value / total)*100);
            if (percent%1 > 0)
                percent = percent.toFixed(1);
            else
                percent = percent.toFixed(0);
            //Set center text
            pieCenterValue.text(percent + "%");
        }
    }


    //Return animation on mouseout
    function mouseoutAction(d, i) {
        //No animation unless creation completed
            if (isCreationCompleted) {
                //Return animation
                d3.select(ELEMENT + " #path" + i)
                    .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('transform', 'translate(0,0)');

                //Unbold label text
                d3.select(ELEMENT + " #label" + i)
                    .attr("font-weight", null);

                //Clear text on leave
                pieCenterValue.text(null);
            }
        }

    
    //On click, gets action and forwards to that function
    function clickAction(d, i) {
        var action = d.data.link || null;
        var param1 = d.data.linkParam1;
        var param2 = d.data.linkParam2; 
        if (action!==null)
            window[action](param1, param2);
    }
}


/**
 * Generate a D3 gauge
 * 
 * adapted from http://jsfiddle.net/sangil/KAgZq/7/ 
 * which was adpated from http://bl.ocks.org/msqr/3202712
 * 
 *
 * @param data = 
 *               {
 *                "general": {
 *                    "size":,
 *                    
 *                    "pointerWidth":,
 *                    "pointerTailLength":,
 *                    "pointerTailLengthPercent":,
 *                    
 *                    "clipWidth":
 *                    "clipHeight":
 *                    
 *                    "ringInset":
 *                    "ringWidth":
 *                    "labelInset":
 *                    
 *                    "minAngle":
 *                    "maxAngle":
 *                    
 *                    "minValue": 
 *                    "maxValue":
 *                    "majorTicks":
 *                    
 *                    "lowThreshold":
 *                    "highThreshold":
 *                    "lowThresholdColor":
 *                    "mediumThresholdColor":
 *                    "highThresholdColor":
 *                    
 *                    "transitionTime":
 *                    
 *                    "labelFormat":
 *                    "rotateLabels":
 *                    
 *                    "element":
 *                    },
 *                "updateFunction":
 *                }                     
 *     
 *  
 * @return void
 */
function generateGauge(params) {
	var SIZE = params.general.size || 400;
	var RADIUS = SIZE/2;
	
	var POINTERWIDTH = params.general.pointerWidth || SIZE/60;
	var POINTERTAILLENGTH = params.general.pointerTailLength || SIZE/80;
	var POINTERHEADLENGTPERCENT = params.general.pointerHeadLengthPercent || 0.8;
	var POINTERHEADLENGTH = Math.round(RADIUS * POINTERHEADLENGTPERCENT);
	
	var CLIPWIDTH = params.general.clipWidth || SIZE;
	var CLIPHEIGHT = params.general.clipHeight || SIZE/2 + 2*POINTERTAILLENGTH;
	
	var RINGINSET = params.general.ringInset || RADIUS/10;
	var RINGWIDTH = params.general.ringWidth || RADIUS/20;
	var LABELINSET = params.general.labelInset || RADIUS/10;
	
	var MINANGLE = -70;
	var MAXANGLE = 70;
	var RANGE = MAXANGLE - MINANGLE;
	
	var MINVALUE = params.general.minValue || 0;
	var MAXVALUE = params.general.maxValue || 100;
	var MAJORTICKS = params.general.majorTicks || ((MAXVALUE-MINVALUE)/10);

	var LOWTHRESHOLD = params.general.lowThreshold || 33;
	var HIGHTHRESHOLD = params.general.highThreshold || 67;
	var LOWTHRESHOLDCOLOR = params.general.lowThresholdColor || '#B22222';
	var MEDIUMTHRESHOLDCOLOR = params.general.mediumThresholdColor || 'steelblue';
	var HIGHTHRESHOLDCOLOR = params.general.highThreshold || '#008000';
	
	var TRANSITIONTIME = params.general.transitionTime || 2000;
			
	var LABELFORMAT = params.general.labelFormat || d3.format('g');
	var ROTATELABELS = params.general.rotateLabels || true;
	    
	var ELEMENT = params.general.element;
	var CHARTTITLE = params.general.chartTitle || "";
	
    var arcColorFn;
    var container;
    var numberDiv;
	var svg;
	var arc;
	var scale;
	var ticks;
	var tickData;
	var pointer;

	    
	function deg2rad(deg) {
		return deg * Math.PI / 180;
	}
	
	function newAngle(d) {
		var ratio = scale(d);
		var newAngle = MINANGLE + (ratio * RANGE);
		return newAngle;
	}
	

	// a linear scale that maps domain values to a percent from 0..1
	scale = d3.scale.linear()
		.range([0,1])
		.domain([MINVALUE, MAXVALUE]);
		
    var colorDomain = [LOWTHRESHOLD, HIGHTHRESHOLD].map(scale),
        colorRange  = [LOWTHRESHOLDCOLOR, MEDIUMTHRESHOLDCOLOR, HIGHTHRESHOLDCOLOR];
    
    arcColorFn = d3.scale.threshold().domain(colorDomain).range(colorRange);
	ticks = scale.ticks(MAXVALUE/MAJORTICKS);
    tickData = [LOWTHRESHOLD, HIGHTHRESHOLD, MAXVALUE]
            .map(function(d) {return scale(d); });
    
	arc = d3.svg.arc()
		.innerRadius(RADIUS - RINGWIDTH - RINGINSET)
		.outerRadius(RADIUS - RINGINSET)
		.startAngle(function(d, i) {
            var ratio = i > 0 ? tickData[i-1] : MINVALUE;//d * i;
			return deg2rad(MINANGLE + (ratio * RANGE));
		})
		.endAngle(function(d, i) {
			var ratio = tickData[i];//d * (i+1);
			return deg2rad(MINANGLE + (ratio * RANGE));
		});
	
	function centerTranslation() {
		return 'translate('+ RADIUS +','+ RADIUS +')';
	}
	
	function isRendered() {
		return (svg !== undefined);
	}
	
	function render(newValue, newStatus) {
        container = d3.select(ELEMENT);
        
        headerDiv = container.append('div')
        	.attr('class', 'chart-header')
        	.style('width', CLIPWIDTH + 'px')
        	.text(CHARTTITLE);
        
		svg = container.append('div')
			.append('svg')
				.attr('class', 'gauge')
				.attr('width', CLIPWIDTH)
				.attr('height', CLIPHEIGHT);
		
		var centerTx = centerTranslation();
		
		var arcs = svg.append('g')
				.attr('class', 'arc')
				.attr('transform', centerTx);
		
		arcs.selectAll('path')
				.data(tickData)
			.enter().append('path')
				.attr('fill', function(d, i) {
					return arcColorFn(d - 0.001);
				})
				.attr('d', arc);
        
		var lg = svg.append('g')
				.attr('class', 'label')
				.attr('transform', centerTx);
        
        
        
		lg.selectAll('text')
				.data(ticks)
			.enter().append('text')
				.attr('transform', function(d) {
                    if (ROTATELABELS) {
                    	var ratio = scale(d);
                        var newAngle = MINANGLE + (RANGE*ratio);
                        
                        return 'rotate(' +newAngle +') translate(0,' +(LABELINSET + RINGINSET + RINGWIDTH - RADIUS) +')';
                    }
                    else {
                    	var ratio = scale(d);
                        var newAngle = deg2rad(MINANGLE + (ratio * RANGE)),
                            y = (LABELINSET + RINGINSET + RINGWIDTH - RADIUS) * Math.cos(newAngle),
                            x =  -1 * (LABELINSET + RINGINSET + RINGWIDTH - RADIUS) * Math.sin(newAngle);
                        console.log(newAngle);
                        console.log(x + "|" + y);    
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
                	var ratio = scale(d);
                    var newAngle = MINANGLE + (RANGE * ratio);
                    
                    return 'rotate(' +newAngle +') translate(0,' + (RINGINSET + RINGWIDTH - RADIUS) +')';
                })
                .style('stroke', '#666')
                .style('stroke-width', '1px');
        
		var lineData = [ [POINTERWIDTH / 2, 0], 
						[0, -POINTERHEADLENGTH],
						[-(POINTERWIDTH / 2), 0],
						[0, POINTERTAILLENGTH],
						[POINTERWIDTH / 2, 0] ];
        
		var pointerLine = d3.svg.line().interpolate('monotone');
        
		var pg = svg.append('g').data([lineData])
				.attr('class', 'pointer')
				.attr('transform', centerTx);
				
		pointer = pg.append('path')
			.attr('d', pointerLine )
			.attr('transform', 'rotate(' + MINANGLE +')');
			
        numberDiv = container.append('div')
            .attr('class', 'gauge-footer')
            .style('width', CLIPWIDTH + 'px')
            .style('height', '140px')
        	.data([newValue]);

        gaugeValue = numberDiv.append('div')
            .data([newValue])
            .attr('class', 'gauge-value');
        
        gaugeStatus = numberDiv.append('div')
        	.text([newStatus])
        	.attr('class', 'gauge-status');
        
		update(newValue === undefined ? 0 : newValue, newStatus === undefined ? "" : newStatus);
	}
    
	function update(newValue, newStatus) {
        
        var value = [newValue];
        
		var ratio = scale(newValue);
		var newAngle = MINANGLE + (ratio * RANGE);
        
		pointer.transition()
			.duration(TRANSITIONTIME)
			//.ease('elastic')
            .ease('cubic-in-out')
			.attr('transform', 'rotate(' +newAngle +')');
        
		gaugeValue
            .data(value)
          .transition()
			.duration(TRANSITIONTIME)
            .ease('quad')
            .style('color', arcColorFn( scale(newValue) ))
            .tween("text", function(d) {
                var i = d3.interpolate((this.textContent).replace("%", ""), d);
                
                return function(t) {
                    this.textContent = Math.floor(i(t)) + "%";
                };
            });
        
		gaugeStatus
        	.text(newStatus);
	}

	render();


	function updateReadings() {
	    // just pump in random data here...
		var currentdate = new Date();
		var hour = currentdate.getHours();
		if (hour>=8 && hour<17)
			if (hour===11)
				update(0, "At lunch");
			else {
				var outcome = getAWorkReading();
				update(outcome.efficiency, outcome.status);
			}
		else
			update(0, "At home");
	}
	
	function getAWorkReading() {
		var typeOfOutcome = Math.random();
		var outcome = {
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
	
	var goodStatus = [
        "Things are going swell!",
    ];
	var hiccupStatus = [
        "I didn't even change anything?!?",
        "Someone's birthday",
        "It seemed superfluous at the time.",
        "Compiling.",
        "Running regression tests.",
    ];
	var disasterStatus = [
        "Uh oh, cat got in the server!",
        "Fondue day was a big mistake!",
        "Cosmic ray?",
    ];
	function getStatus(type) {
		var statusIndexRand = Math.random();
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
	}, 5 * 1000);
}