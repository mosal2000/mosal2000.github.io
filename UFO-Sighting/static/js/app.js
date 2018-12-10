// from data.js
var tableData = data;

var tableBody = d3.select("tbody");

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function builtTablePage(sightingData) {

	tableBody.html("");

	sightingData.forEach(function(row) {
		var rowData = Object.values(row)
		// console.log(rowData);

		var insertRow = tableBody.append("tr");
		var colNum = 0;

		rowData.forEach(function(rowColData){
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

var filterBtn = d3.select("#filter-btn");


filterBtn.on("click", function() {
	d3.event.preventDefault();

	var inputElement = d3.select("#datetime");
	var inputValue = inputElement.property("value");

	console.log(inputValue);

	if (inputValue == "") {
		console.log("inputValue is Empty");
		builtTablePage(tableData);

	} else {
		console.log("inputValue has value");

		var filteredData = tableData.filter(rowData => rowData.datetime === inputValue);

		builtTablePage(filteredData);
	}
});

builtTablePage(tableData);