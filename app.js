//create the seleciton matrix
var selected = [
    ["x", "poverty", false],
    ["x", "age", false],
    ["x", "income", false],
    ["y", "checkup", false],
    ["y", "stroke", false],
    ["y", "obese", false]
];

var prevXSelected="";
var prevYSelected="";
var myXTip="";
var myYTip="";

var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .attr("font-size", "8px")
      .offset([-8, 0])
      .html(function(d) {
          if(selected[0][2]){
             var myX = "<div>Poverty %: " + d.pctInPoverty + "</div>";
             }
          if(selected[1][2]){
             var myX = "<div>Age: " + d.medAge + "</div>";
          }
          if(selected[2][2]){
              var myX = "<div>Income: " + d.medFamilyInc + "</div>";
          }
          if(selected[3][2]){
              var myY = "<div>No Checkup %: " + d.pctNeverHadCheckup +"</div>";
          }
          if(selected[4][2]){
              var myY = "<div>Stroke %: " + d.pctStroke +"</div>";
          }
          if(selected[5][2]){
              var myY = "<div>Obese %: " + d.pctObese +"</div>";
          }
          var myState = "<div>State: " + d.state + "</div>";
          var myTip = myState+myX+myY;          
          return myTip; });

// Rounding function
function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}


//Function which updates plot when axes are clicked
function updatePlot(selection, mydata, currentaxis) {
    
    // reset existing plot
    svg.selectAll("circle").remove();
    svg.selectAll(".node").remove();
    var xaxis = "";
    var yaxis = "";
    
    
    // set data set based on selected dimensions
    if (selected[0][2]) {
        xaxis = function(d) { return x(d.pctInPoverty); }
        x.domain([d3.min(mydata, function(d) { return d.pctInPoverty; }) - 1, d3.max(mydata, function(d) { return d.pctInPoverty; }) + 1]);
    }
    if (selected[1][2]) {
        xaxis = function(d) { return x(d.medAge); }
        x.domain([d3.min(mydata, function(d) { return d.medAge; }) -1, d3.max(mydata, function(d) { return d.medAge; }) + 1]);
    }
    if (selected[2][2]) {
        xaxis = function(d) { return x(d.medFamilyInc); }
        x.domain([d3.min(mydata, function(d) { return d.medFamilyInc; }) - 5000, d3.max(mydata, function(d) { return d.medFamilyInc; }) + 5000]);
    }
    if (selected[3][2]) {
        yaxis = function(d) { return y(d.pctNeverHadCheckup); }
        y.domain([d3.min(mydata, function(d) { return d.pctNeverHadCheckup; }) - .1, d3.max(mydata, function(d) { return d.pctNeverHadCheckup; }) + .1]);
    }
    if (selected[4][2]) {
        yaxis = function(d) { return y(d.pctStroke); }
        y.domain([d3.min(mydata, function(d) { return d.pctStroke; }) -1, d3.max(mydata, function(d) { return d.pctStroke; }) +1]);
        myYTip = "<div>Stroke %: " + (function(d) { return d.pctStroke; }) + "</div>";
    }
    if (selected[5][2]) {
        yaxis = function(d) { return y(d.pctObese); }
        y.domain([d3.min(mydata, function(d) { return d.pctObese; }) -1, d3.max(mydata, function(d) { return d.pctObese; }) +1]);
    }
    
    svg.call(tool_tip);
    
    //Refomat the x axis if clicked
    if (currentaxis == "x") {
        svg.select(selection)
            .style("fill", "purple")
            .style("font-weight", "bold")
            .attr('fill-opacity', 1)
            .transition();
    
        svg.select(prevXSelected)
            .style("fill", "black")
            .attr('fill-opacity', 0.5)
            .style("font-weight", "normal")
            .transition();
    
        prevXSelected = selection;
    }
    
    //Reformat the y axis if clicked
    if (currentaxis == "y") {
        svg.select(selection)
            .style("fill", "purple")
            .style("font-weight", "bold")
            .attr('fill-opacity', 1)
            .transition();
    
        svg.select(prevYSelected)
            .style("fill", "black")
            .style("font-weight", "normal")
            .attr('fill-opacity', 0.5)
            .transition();
    
        prevYSelected = selection;
    }

    // Add the scatterplot
    svg.selectAll("dot")
      .data(mydata)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", "purple")
      .attr('fill-opacity', 0.5)
      .attr("text", mydata.state)
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide)
      .attr("cx", xaxis)
      .attr("cy", yaxis); 
    
    // Add the state labels
    var myg = svg.selectAll("g.node")
      .data(mydata)
      .enter().append("svg:g")
      .attr("class", "node");
    
    myg.append("svg:text")
      .attr("x", xaxis)
      .attr("y", yaxis)
      .attr("dy", ".31em")
      .style("font", "8px sans-serif")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .attr("class", "labels")
      .text(function(d) { return d.state; });
    
    // Update the X Axis
    svg.select(".xaxis")
      .attr("transform", "translate(0," + height + ")")
      .transition()
      .call(d3.axisBottom(x));
    
    // Update the Y Axis
    svg.select(".yaxis")
      .transition()
      .call(d3.axisLeft(y));

}

// Main function

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 75, left: 75},
    width = 563 - margin.left - margin.right,
    height = 375 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.pctInPoverty = precisionRound((d.pctInPoverty * 100), 2);
      d.pctNeverHadCheckup = precisionRound(d.pctNeverHadCheckup, 2);
      d.medAge = precisionRound(d.medAge, 2);
      d.medFamilyInc = precisionRound(d.medFamilyInc, 2);
      d.pctObese = precisionRound(d.pctObese, 2);
      d.pctStroke = precisionRound(d.pctStroke, 2);
  });

  // Scale the range of the data
  x.domain([d3.min(data, function(d) { return d.pctInPoverty; }) - 1, d3.max(data, function(d) { return d.pctInPoverty; }) + 1]);
  y.domain([d3.min(data, function(d) { return d.pctNeverHadCheckup; }) - .1, d3.max(data, function(d) { return d.pctNeverHadCheckup; }) + .1]);
    
  selected[0][2]=true;
  selected[3][2]=true;

  // Add tool tips    
  svg.call(tool_tip);
    
  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", "purple")
      .attr('fill-opacity', 0.5)
      .attr("font-size", 8)
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide)
      .attr("cx", function(d) { return x(d.pctInPoverty); })
      .attr("cy", function(d) { return y(d.pctNeverHadCheckup); });


  // Add state labels to circles
  var g = svg.selectAll("g.node")
      .data(data)
      .enter().append("svg:g")
      .attr("class", "node");
    
  g.append("svg:text")
      .attr("x", (function(d) { return x(d.pctInPoverty); }))
      .attr("y", function(d) { return y(d.pctNeverHadCheckup); })
      .attr("dy", ".31em")
      .style("font", "8px sans-serif")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .attr("class", "labels")
      .text(function(d) { return d.state; });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "xaxis")
      .call(d3.axisBottom(x));
    
  // text label for the x axis
  svg.append("text")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font", "12px sans-serif")
      .style("fill", "purple")
      .style("font-weight", "bold")
      .attr("class", "poverty")
      .on("click", function() {
        selected[0][2]=true;
        selected[1][2]=false;
        selected[2][2]=false;
        updatePlot(".poverty", data, "x");
        })
      .text("% in Poverty");
    
  prevXSelected=".poverty";
    
    
  // Add x axis labels and click functions    
  svg.append("text")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 35) + ")")
      .style("text-anchor", "middle")
      .style("font", "12px sans-serif")
      .attr('fill-opacity', 0.5)
      .attr("class", "age")
      .on("click", function() {
        selected[0][2]=false;
        selected[1][2]=true;
        selected[2][2]=false;
        updatePlot(".age", data, "x");
        })
      .text("Age (Median)");

    svg.append("text")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .style("font", "12px sans-serif")
      .attr('fill-opacity', 0.5)
      .attr("class", "income")
      .on("click", function() {
        selected[0][2]=false;
        selected[1][2]=false;
        selected[2][2]=true;
        updatePlot(".income", data, "x");
        })
      .text("Income (Median)");
    
  // Add the Y Axis
  svg.append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(y));

  // text labels for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font", "12px sans-serif")
      .style('fill', 'purple')
      .style("font-weight", "bold")
      .attr("class", "checkup")
      .on("click", function() {
        selected[3][2]=true;
        selected[4][2]=false;
        selected[5][2]=false;
        updatePlot(".checkup", data, "y");   
        })
      .text("% Never Had a Health Checkuup");
    
    prevYSelected=".checkup";
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font", "12px sans-serif")
      .attr('fill-opacity', 0.5)
      .attr("class", "stroke")
      .on("click", function() {
        selected[3][2]=false;
        selected[4][2]=true;
        selected[5][2]=false;
        updatePlot(".stroke", data, "y");   
        })
      .text("% Stroke");
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font", "12px sans-serif")
      .attr('fill-opacity', 0.5)
      .attr("class", "obese")
      .on("click", function() {
        selected[3][2]=false;
        selected[4][2]=false;
        selected[5][2]=true;
        updatePlot(".obese", data, "y");   
        })
      .text("% Obese");

});