//Adrian Flannery

function getJSONOlympicData(dataJSON)
{
    //sort data by sport
    dataJSON.sort(function (a, b) {
        if (a.sport > b.sport) 
            return 1;
        if (a.sport < b.sport)
            return -1;
        return 0;
        });
        
    
    //x-axis data
    var sports = [];
    //y-axis data
    var bronzeMedals = [];   
    
    //color scale
    var color = d3.scale.category20();
    
    var numberOfSports = 0; 
    var athlete;
    var sport;
    
    //processes the data to determine sports and their bronze medals
    for(var i=0;i<dataJSON.length;i++)
    {
        athlete = dataJSON[i];
        sport = athlete.sport;
        
        //if not initial case
        if (numberOfSports>0)
        {
            //if sport has already been seen, add it to sum
            if (sports[numberOfSports-1]===sport)
                bronzeMedals[numberOfSports-1] += athlete.bronzemedals;
            // else create new sport and new sum
            else
            {
                sports[numberOfSports] = sport;
                bronzeMedals[numberOfSports] = athlete.bronzemedals;
                numberOfSports++;
            }
        }
        //else initial case, create initial entry
        else
        {
            sports[numberOfSports] = sport;
            bronzeMedals[numberOfSports] = athlete.bronzemedals;
            numberOfSports++;
        }
    }
      

            


            
    //create graph
    var svg = d3.select(".chart").append("svg").attr("width", "900").attr("height", "650");
   
   //constants
    var GRAPHHEIGHT = 400;
    var PADDINGLEFT = 50; 
    var PADDINGTOP = 30;
    var BARWIDTH = 20;
    var BARMARGIN = 3;
    var MAXVALUEY = 70;    
    var DRAWXDISTANCE = BARWIDTH + BARMARGIN;
    var BARYMULT = GRAPHHEIGHT / MAXVALUEY;
    var ENDOFGRAPH = BARMARGIN*33 + BARWIDTH*32 + PADDINGLEFT;
    var MARGINFROMTOP = GRAPHHEIGHT + PADDINGTOP;
   
    var chartArea = svg.selectAll("rect").data(bronzeMedals).enter();
  
    //create tooltip
    var div = d3.select(".chart").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);
   
   
    //Draw the bars.
    chartArea.append("rect").attr("x", function(d, i){
        	return i * DRAWXDISTANCE + PADDINGLEFT + BARMARGIN;
        })
        .attr("y", function(d) {   
                return GRAPHHEIGHT + PADDINGTOP - (d * BARYMULT);
        })
        .attr("width", function(d) {
                return BARWIDTH;
        })
        .attr("height", function(d){
                return d * BARYMULT;
        })
        .attr("fill", function(d, i) {return color(i);})
    //tooltip on hover        
        .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html("<p>Bronze Medals: "  + d + "</p>")  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
        })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);
        }) 
    //builds list on click
        .on("click", function(d, i) {
        	//Fade out table
        	$(".list table")
        		.fadeOut("slow", function () { 
	            var listOfAthletes = [];
	            d3.selectAll(".list tr").remove();
	            for(var j=0;j<dataJSON.length;j++){
	                if (dataJSON[j].sport===sports[i])
	                {
	                    if (dataJSON[j].bronzemedals>0)
	                        listOfAthletes[listOfAthletes.length] = dataJSON[j]; 
	                }
	            }
	            
	            d3.select('.list thead').selectAll("th")
		        	.data(["Name", "Age", "Country", "Year", "Sport", "Gold Medals", "Silver Medals", "Bronze Medals"])
		        	.enter().append("th")
		        		.text(function (d) {
		        			return d;
		        		});
		 
		        
			    var row = d3.select('.list tbody').selectAll("tr").data(listOfAthletes)
		        	.enter().append("tr");
		        
		        row.selectAll("td")
			        .data(function(d){return d3.values(d);})
			        .enter().append("td")
				        .text(function(d) {
					        	return d;
			        	});
		        
		      //Fade in table
    	    	$(".list table")
    	    		.fadeIn("slow");
    		});
        });
            
   
   //build x-axis ticks and labels
    var x = d3.scale.ordinal()
        .domain(sports)
        .rangeBands([PADDINGLEFT, ENDOFGRAPH], .1);

    var xAxis = d3.svg.axis()
        .scale(x);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + MARGINFROMTOP + ")")
        .call(xAxis)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 20)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start")
            .attr("font-size", "15px");
   
   
   
   //build y axis line and labels
    var y = d3.scale.linear()
        .domain([MAXVALUEY, 0])
        .range([PADDINGTOP, GRAPHHEIGHT + PADDINGTOP]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + PADDINGLEFT + ", 0)")
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90 0,50)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-size", "20px")
            .text("Number of Bronze Medals");
    }