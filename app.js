var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data.csv", function(err, healthData) {
  if (err) throw err;

  healthData.forEach(function(data) {
    data.bachelor_degree = +data.bachelor_degree;
    data.poor_health = +data.poor_health;
  });


  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([10, d3.max(healthData, function(data) {
    return +data.bachelor_degree;
  })]);
  yLinearScale.domain([2, d3.max(healthData, function(data) {
    return +data.poor_health * 1.2; 
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, 0])
    .html(function(data) {
      var stateAbbr = data.abbr;
      var bachDegree = +data.bachelor_degree;
      var poorHealth = +data.poor_health;
      return (stateAbbr + "<br> % Bach Degree: " + bachDegree + "<br> % Poor Health: " + poorHealth);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(healthData)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.bachelor_degree);
        return xLinearScale(data.bachelor_degree);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.poor_health);
      })
      .attr("r", "15")
      .attr("fill", "red")
      .on("click", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage of Population Stating Poor Health");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Percentage of Population over 25 yrs or older with a Bachelors Degree");
});


