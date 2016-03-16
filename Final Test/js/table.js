function tableChart(divName) {
	
	// Creates the table, the header and the body
	var svg = d3.select('#' + divName).append('table').attr('align', 'center'),
		header = svg.append('thead'),
		body = svg.append('tbody');
	
	d3.tsv('data.tsv', function(error, data) {
		if (error) 
			throw error;
		
		// Get the number of columns and its names
		var nameColumns = Object.keys(data[0]),
			totalColumns = nameColumns.length;
		
		// Write the name of each column
		header.append('tr')
			.style('border', '3px solid black')
			.selectAll('td')
			.data(nameColumns).enter()
			.append('td')
			.attr('align', 'center')
			.style('font-size', '20px')
			.style('font-weight', 'bold')
			.html(function(d) { return d; });
		
		// Create the rows. This rows will contain the data
		var row = body.selectAll('tr')
			.data(data).enter()
			.append('tr');
		
		// Fills all columns for each row
		for (var i in nameColumns)
			row.append('td')
			.attr('align', 'center')
			.html(function(d) { return d[nameColumns[i]]; });
			
		// Alerts that table has been created correctly
		document.dispatchEvent(new Event('table data loaded'));
	})
	
	return { 'header': header, 'body': body };
}

function sortableTableChart(divName) {
	var ascendent = {};
	
	// Creates the initial table
	var table = tableChart(divName);
	
	// Waits until the table has been created
	document.addEventListener('table data loaded', function () {
		// When click on header sort the table by its values
		table.header.select('tr').selectAll('td')
			.on("click", function(column) {
				table.body.selectAll('tr').sort(function(a, b) { if (ascendent[column]) return a[column] < b[column]; else return a[column] > b[column]; });
				var newOrder = !ascendent[column];
				ascendent = {}
				ascendent[column] = newOrder;
			})
			.style('cursor', 'pointer');
	}, false);

	return table;
}