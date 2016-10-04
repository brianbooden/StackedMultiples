define(["jquery","qlik", "./d3.v3.min", "css!./StackedMultiples.css"],function ($, qlik) {

	// Set a variable outside of paint to persist the chart type upon selections
	var checkedValue = "stacked";

	return {
    initialProperties: {
        version: 1.0,
        qHyperCubeDef: {
            qDimensions: [],
            qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 3,
                    qHeight: 3333
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 2,
                    max: 2
                },
                measures: {
                  uses: "measures",
                  min: 1,
                  max: 1
              },
              sorting: {
                  uses: "sorting"
              },

			  	settings : {
					uses : "settings",
					items : {



					
						colors: {
							ref: "ColorSchema",
							type: "string",
							component: "dropdown",
							label: "Color",
							show: true,
							options: 
							[ {
										value: "#fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506",
										label: "Sequential"
									}, {
										value: "#662506, #993404, #cc4c02, #ec7014, #fe9929, #fec44f, #fee391",
										label: "Sequential (Reverse)"
									}, {
										value: "#d73027, #f46d43, #fee090, #abd9e9, #74add1, #4575b4",
										label: "Diverging RdYlBu"
									}, {
										value: "#4575b4, #74add1, #abd9e9, #fee090, #f46d43, #d73027",
										label: "Diverging BuYlRd (Reverse)"
									}, {
										value: "#deebf7, #c6dbef, #9ecae1, #6baed6, #4292c6, #2171b5, #08519c, #08306b",
										label: "Blues"
									}, {
										value: "#fee0d2, #fcbba1, #fc9272, #fb6a4a, #ef3b2c, #cb181d, #a50f15, #67000d",
										label: "Reds"
									}, {
										value: "#edf8b1, #c7e9b4, #7fcdbb, #41b6c4, #1d91c0, #225ea8, #253494, #081d58",
										label: "YlGnBu"
									}, {
										value: "#332288, #6699CC, #88CCEE, #44AA99, #117733, #999933, #DDCC77, #661100, #CC6677, #AA4466, #882255, #AA4499",
										label: "12 colors"
									}
								],
									defaultValue: "#332288, #6699CC, #88CCEE, #44AA99, #117733, #999933, #DDCC77, #661100, #CC6677, #AA4466, #882255, #AA4499"
								}
								
						
					}
				}
          }
      },
      snapshot: {
			canTakeSnapshot: true
		},
	
	
		paint: function ($element, layout) {

		var self = this;
		
		// Create button to animate data
		var html='<div width="10" position="relative" z-index="-10">';
		var i = 0;
		
		// Populate the correct radio button and chart type immediately after paint is triggered
		if (checkedValue == "stacked") 
		{
			html=html+"<label><input type='radio' name='mode' value='multiples' id='checkMultiples' > Multiples   </label>"
			html=html+"<label><input type='radio' name='mode' value='stacked' id='checkStacked' checked > Stacked   </label>"	
		}
		else
		{
			html=html+"<label><input type='radio' name='mode' value='multiples' id='checkMultiples' checked > Multiples   </label>"
			html=html+"<label><input type='radio' name='mode' value='stacked' id='checkStacked' > Stacked   </label>"	
		}
		
		html=html+"</div>";
		
		$element.html(html);
				
		// Set a generic numeric format for the expression
		var formatNumber = d3.format(",.0f");
   
		// Set up the Mulitiples button click event
        $element.find("#checkMultiples").on("click", function() {
			
			d3.selectAll("rect")
				.attr("class", "bar-highlight");
			
			var t = svg.transition().duration(750),
				g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
				g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
				g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); });

				// added this segment
				g.selectAll(".value-label")
				  .attr("y", y0.rangeBand())
				  .style("opacity", 1)
				  .text(function(d) {
					return formatNumber(d.value);
				  });
		
				// Update the checkedValue variable
				checkedValue = "multiples";
							
		  });
		  
		  
		// Set up the Stacked button click event
        $element.find("#checkStacked").on("click", function() {
			
			d3.selectAll("rect")
				.attr("class", "bar-normal");
			
			var t = svg.transition().duration(750),
				g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
				g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
				g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); });

			// added this segment
			g.selectAll(".value-label")
			  .attr("y", y1(0))
			  .style("opacity", function(d,i,j) {
				return j > 0 ? "1" : "0";
			  })
			  .text(function(d,i) {
					return formatNumber(totalLabels[i]);
				  });
    
			// Update the checkedValue variable
			checkedValue = "stacked";
					
		  });
		  

			// Set margins
			var margin = {top: 0, right: 30, bottom: 100, left: 80};
	
			// Chart object width
			var width = $element.width()- margin.right - margin.left;
			// Chart object height
			var height = $element.height() - margin.bottom - margin.top;
			// Chart object id
			var id = "container_" + layout.qInfo.qId;
		    		 
			// Check to see if the chart element has already been created
			if (document.getElementById(id)) {
				// if it has been created, empty it's contents so we can redraw it
				$("#" + id).empty();
			}
			else {
				// if it hasn't been created, create it with the appropriate id and size
				$element.append($('<div />').attr({ "id": id, "class": "qv-object-StackedMultiples" }).css({ height: height, width: width }))
			}
			
			// Create the tooltip
			var tt = d3.select("#"+id)
					.append("div")	
					.attr("class", "tooltip")				
					.style("opacity", 0);
					
			// Create the svg element			   
           var svg = d3.select("#" + id).append("svg")  
                .attr("width", width + margin.right + margin.left)
				.attr("height", height + margin.bottom + margin.top)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				;				

			//create matrix variable
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
		
			// create a new array that contains the measure labels
			var dimLabels = layout.qHyperCube.qDimensionInfo.map(function(d) {
				return d.qFallbackTitle;
			});
			
			// create a new array that contains the dim labels
			var measureLabels = layout.qHyperCube.qMeasureInfo.map(function(d) {
				return d.qFallbackTitle;
			});
			
			
			// Create a new array for our extension with a row for each row in the qMatrix
			// Filter dimesnion Null value 
			var data2 = qMatrix;

			// Get the selected counts for the 2 dimensions, which will be used later for custom selection logic
			var selections = {
				dim1_count: layout.qHyperCube.qDimensionInfo[0].qStateCounts.qSelected,
				dim2_count: layout.qHyperCube.qDimensionInfo[1].qStateCounts.qSelected
			};
	
	
			// get key elements in Qlik Sense order
			var listKey = [],
				dateKey = [],
				dateVal = 0;
			$.each(data2, function( index, row ) {
				if ($.inArray(row[0].qText, listKey) === -1) {
					listKey.push(row[0].qText);
				}
				dateVal = row[1].qNum;
				if ($.inArray(dateVal, dateKey) === -1) {
					dateKey.push(dateVal);
				}
			});

			// Create the base data set
			var nestedData = data2.map(function(row){
							return {
								"date" : row[0].qText,
								"date_key" : row[0].qElemNumber,
								"group" : row[1].qText,
								"group_key" : row[1].qElemNumber,
								"value" : row[2].qNum};
						});
		
			
			// Stacked Multiples code here
			// ----------
			
				// Grab the layout variables
				var colorpalette = layout.ColorSchema.split(", "),
				//chartType = layout.chartType,
				domainLength = d3.max(nestedData, function (d) { return d.length; });
				

				var y0 = d3.scale.ordinal()
					.rangeRoundBands([height, 0], .2);

				var y1 = d3.scale.linear();

				var x = d3.scale.ordinal()
					.rangeRoundBands([0, width], .1, 0);
				
				var y = d3.scale.linear()
				.range([height - margin.top, 0]);
					
				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")

				// Set the colour properties
				var color = d3.scale.ordinal()
								.domain([0, domainLength])
								.range(colorpalette);	
					
				// Nest by the grouped dimension	
				var nest = d3.nest()
					.key(function(d) { return d.group; });
					
				// Create the Stacked layout
				var stack = d3.layout.stack()
					.values(function(d) { return d.values; })
					.x(function(d) { return d.date; })
					.y(function(d) { return d.value; })
					.out(function(d, y0) { d.valueOffset = y0; });

				// Nest by group
				  var dataByGroup = nest.entries(nestedData);

				  stack(dataByGroup);
				  
				  //Set domains for stacked chart
				  x.domain(dataByGroup[0].values.map(function(d) { return d.date; }));
				  y.domain([0, d3.max(nestedData, function(d) { return d.value; })]).range([y0.rangeBand(), 0]).nice()
				  y0.domain(dataByGroup.map(function(d) { return d.key; }));
				  y1.domain([0, d3.max(nestedData, function(d) { return d.value / 1.1; })]).range([y0.rangeBand(), 0]);

				  
				  var group = svg.selectAll(".group")
					  .data(dataByGroup)
					.enter().append("g")
					  .attr("class", "group")
					  .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

					  
				  // added this segment
				  var totalLabels = [];
				  for (var i = 0; i < 100000; i++) {
					totalLabels[i] = 0;
				  }
				  //

				  group.append("text")
					  .attr("class", "group-label")
					  .attr("x", -6)
					  .attr("y", function(d) { return y1(d.values[0].value / 2); })
					  .attr("dy", ".35em")
					  .text(function(d) { return d.key; });

				  group.selectAll("rect")
					  .data(function(d) { return d.values; })
					.enter().append("rect")
					  .style("fill", function(d) { return color(d.group); })
					  .attr("x", function(d) { return x(d.date); })
					  .attr("y", function(d) { return y1(d.value); })
					  .attr("width", x.rangeBand())
					  .attr("height", function(d) { return y0.rangeBand() - y1(d.value); });

					// Create the tooltips using the position of the element being hovered on
				     d3.selectAll("rect")
					 .on("mousemove", function(d) {
						 
						
						tt.html(dimLabels[0] + ": <strong>" + d.date + "</strong><br>" +
						dimLabels[1] + ": <strong>" + d.group + "</strong><br>" 
						+ measureLabels[0] + ": <strong>" + formatNumber(d.value) + "</strong>")
							.style('top', d3.select(this).attr("cy") + 5 + "px")
							.style('right', d3.select(this).attr("cx") + 20 + "px")
							.style("opacity", 0.9);

					})
					.on("mouseout", function(d) {
						tt.style("opacity", 0);
					})
					.on("click", function(d) {
						console.log(d.group);
						
						// Set up an array to store the data points selected by the brush
						var selectarray = [];
						var bubblesLength = nestedData.length;

						
						console.log(nestedData);
						
						
						selectarray.push(d.date_key);
					
						//Make the selections
						self.backendApi.selectValues(0,selectarray,false);
							
					}); 
					
					  
				  // added this segment
				  group.selectAll(".value-label")
					  .data(function(d) { return d.values; })
					.enter().append("text")
					  .attr("class", "value-label")
					  .style("fill", "black")
					  .style("font-size", "11px")
					  .attr("x", function(d) { return x(d.date); })
					  .attr("y", y0.rangeBand())
					  .attr("dx", ".40em")
					  .attr("dy", "-.20em")
					  .text(function(d,i) {
						totalLabels[i] += d.value;
						return formatNumber(d.value);
					  })
					  ;
				  
				  
				  group.filter(function(d, i) { return !i; }).append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + y0.rangeBand() + ")")
					.call(xAxis)
		
		
				// Transform the text along the x axis to read diagonally
				.selectAll("text")
					.attr("transform"," translate(-20,20) rotate(-45)") // To rotate the texts on x axis. Translate y position a little bit to prevent overlapping on axis line.
					.style("font-size","10px")
			  
				// Set the label for the x -axis
				.append("text")
					  .attr("class", "label")
					  .text(dimLabels[1]);
					
		
			// Check to see if the chart element has already been created
			if (checkedValue == "stacked") 
			{

			d3.selectAll("rect")
				.attr("class", "bar-normal");
		
			// Set up the cool initial transition from multiples to stacked
			var t = svg.transition().duration(750),
				g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
				g.selectAll("rect")
					.attr("y", function(d) { return y1((d.value + d.valueOffset) ); })
					//.attr("y", function(d) { return y1(d.value); })
						  .attr("width", x.rangeBand())
						  .attr("height", function(d) { return (y0.rangeBand() - y1(d.value)) ; });
				g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); });

				// added this segment
				g.selectAll(".value-label")
				  .attr("y", y1(0))
				  .style("font-size","10px")
				  .style("opacity", function(d,i,j) {
					return j > 0 ? "1" : "0";
				  })
				  .text(function(d, i) {
					return formatNumber(totalLabels[i]);
				  });
			}
			else
			{
				d3.selectAll("rect")
				.attr("class", "bar-highlight");
			}
		}
	};
});

function dateFromQlikNumber(n) {
	var d = new Date((n - 25569)*86400*1000);
	// since date was created in UTC shift it to the local timezone
	d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
	return d;
}

function convertToUnixTime(_qNum) {
	return dateFromQlikNumber(_qNum).getTime();
}

		


