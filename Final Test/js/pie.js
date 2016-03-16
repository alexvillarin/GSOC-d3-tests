function pieChart(divName, initialChart, interval) {
	d3.tsv('data.tsv', function(error, data) {
		if (error) 
			throw error;
		
		// Parses the input data
		var parsed = [{ group : 'sepalWidth &le; 2.5' },
					  { group : '2.5 &lt; sepalWidth &le; 3' },
					  { group : '3 &lt; sepalWidth &le; 3.5' },
					  { group : '3.5 &lt; sepalWidth &le; 4' },
					  { group : 'sepalWidth &gt; 4' }];
		data.map(parseElement);
		
		// Get the name of the species in the data
		var categories = Object.keys(parsed[0]);
		categories.shift();
		
		// Creates the dimensions and color variables
		var color = d3.scale.category20(),
			radius = 200;
		var legendRectWidth = 30;
		var legendRectHeight = 20;
		var legendPadding = 40;
		var legendLinePadding = 8;
		
		// Creates the header where we are storing the name of the class
		var header = d3.select('#' + divName)
			.append('h1')
			.attr('align', 'center')
			.html(categories[initialChart].toUpperCase());

		// Create the container of the chart
		var svg = d3.select('#' + divName)
			.append('svg')
			.attr('width', 4 * radius)
			.attr('height', 2 * radius)
			.style('margin', 'auto')
			.style('display', 'block')
			.style('padding', '50px')
			.append('g')
			.attr('transform', 'translate(' + (radius) + ',' + (radius) + ')');

		// Creates the function that set the angles size
		var pie = d3.layout.pie()
			.value(function(d) { return d[categories[initialChart]] | 0; })
			.sort(null);
			
		var arc = d3.svg.arc().outerRadius(radius);

		var path = svg.selectAll('path')
				.data(pie(parsed))
				.enter()
				.append('path')
				.attr('d', arc)
				.attr('fill', function(d, i) { 
					return color(d.data.group);
				})
				.each(function(d) { this._current = d; });			

		// Creates the legend container on the right of the chart
		var legend = svg.selectAll('.legend')
		.data(color.domain())
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', function(d, i) {
			var lineHeight = legendRectHeight + legendLinePadding;
			var offset = lineHeight * parsed.length / 2;
			var vert = i * lineHeight - offset;
			return 'translate(' + (radius + legendPadding) + ',' + vert + ')';
		});

		// Append the rectangle icon to the legend container
		legend.append('rect')
			.attr('width', legendRectWidth)
			.attr('height', legendRectHeight)					 
			.style('fill', color)
			.style('stroke', color);							 

		// Append the name of each class of the pie
		legend.append('text')
			.attr('x', legendRectWidth + legendLinePadding)
			.attr('y', legendRectHeight / 2 + legendLinePadding / 2)
			.attr('font-size', 2 * legendLinePadding + 'px')
			.attr('font-family', 'Verdana, Geneva, sans-serif')
			.html(function(d) { return d; });	

		if (interval > 0) {
			// Updates the pie with the next specie values
			function updatePie() {
				initialChart = (initialChart + 1) % categories.length;
				header.html(categories[initialChart].toUpperCase());
				path = path.data(pie(parsed));
				path.transition()							 
				.duration(750)								 
				.attrTween('d', function(d) {	
					var interpolate = d3.interpolate(this._current, d); 
					this._current = interpolate(0);				 
					return function(t) {				 
						return arc(interpolate(t));					 
					};							 
				});
			}
			
			// Function that calls to updatePie every interval miliseconds
			setInterval(updatePie, interval);
		}

		// Parses the parameter and add it to its correct class
		function parseElement(elem) {
			if 	(elem['sepalWidth'] <= 2.5)
				parsed[0][elem.species] = parsed[0][elem.species] + 1 | 1;
			else if (elem['sepalWidth'] > 2.5 && elem['sepalWidth'] <= 3)
				parsed[1][elem.species] = parsed[1][elem.species] + 1 | 1;
			else if (elem['sepalWidth'] > 3 && elem['sepalWidth'] <= 3.5)
				parsed[2][elem.species] = parsed[2][elem.species] + 1 | 1;
			else if (elem['sepalWidth'] > 3.5 && elem['sepalWidth'] <= 4)
				parsed[3][elem.species] = parsed[3][elem.species] + 1 | 1;
			else if (elem['sepalWidth'] > 4)
				parsed[4][elem.species] = parsed[4][elem.species] + 1 | 1;
		}
	});
}