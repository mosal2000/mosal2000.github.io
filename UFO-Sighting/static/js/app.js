// from data.js
var tableData = data;

var tableBody = d3.select("tbody");

String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

function builtTablePage(sightingData) {

	tableBody.html("");

	sightingData.forEach(function (row) {
		var rowData = Object.values(row)
		// console.log(rowData);

		var insertRow = tableBody.append("tr");
		var colNum = 0;

		rowData.forEach(function (rowColData) {
			// console.log(rowColData);
			colNum++;

			var insertCellData = insertRow.append("td");

			if (colNum == 3 || colNum == 4) {
				rowColData = rowColData.toUpperCase();
			} else if (colNum == 2 || colNum == 5) {
				rowColData = rowColData.toProperCase();
			}

			insertCellData.text(rowColData);
		});
	});
}

var filters = {};

function updateFilters() {

	// Save the element, value, and id of the filter that was changed
	var changedElement = d3.select(this).select("input");
	var elementValue = changedElement.property("value");
	var filterId = changedElement.attr("id");

	// If a filter value was entered then add that filterId and value
	// to the filters list. Otherwise, clear that filter from the filters object
	if (elementValue) {
		filters[filterId] = elementValue;
	} else {
		delete filters[filterId];
	}

	// Call function to apply all filters and rebuild the table
	filterTable();

}

var filterBtn = d3.select("#filter-btn");


filterBtn.on("click", function () {
	d3.event.preventDefault();

	let filteredData = tableData

	// Loop through all of the filters and keep any data that
	// matches the filter values
	Object.entries(filters).forEach(([key, value]) => {
		filteredData = filteredData.filter(row => row[key].toUpperCase() === value.toUpperCase());
	});

	builtTablePage(filteredData);
});

// Attach an event to listen for changes to each filter
d3.selectAll(".filter").on("change", updateFilters);

builtTablePage(tableData);