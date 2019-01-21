var svgWidth = 750;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var chartGroup = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('data/data.csv').then(function(behaviorData) {
  // Step 1: Parse Data/Cast as numbers
  // ==============================
  behaviorData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.noHealthInsurance = +data.noHealthInsurance;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  console.log(behaviorData);

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(behaviorData, d => d.poverty) - 0.5,
      d3.max(behaviorData, d => d.poverty) + 2
    ])
    .range([0, width]);

  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(behaviorData, d => d.noHealthInsurance) - 0.5,
      d3.max(behaviorData, d => d.noHealthInsurance) + 2
    ])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append('g').call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup
    .selectAll('circle')
    .data(behaviorData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d.poverty))
    .attr('cy', d => yLinearScale(d.noHealthInsurance))
    .attr('r', '10')
    .attr('fill', 'SteelBlue')
    .attr('opacity', '.7');

  // Create axes labels
  chartGroup
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 20)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .attr('font-weight', 'bold')
    .text('Lacks Healthcare (%)');

  chartGroup
    .append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr('class', 'axisText')
    .attr('font-weight', 'bold')
    .text('In Poverty (%)');

  var circlesText = chartGroup
    .selectAll('.label')
    .data(behaviorData)
    .enter()
    .append('text')
    .text(d => d.abbr)
    .attr('x', d => xLinearScale(d.poverty))
    .attr('y', d => yLinearScale(d.noHealthInsurance - 0.2))
    .attr('class', 'label')
    .style('font-size', '10px')
    .style('fill', 'white')
    .style('text-anchor', 'middle')
    .classed('fill-text', false);
});
