/**
 * A visualization of NHL hockey players by place of birth and time.
 */

d3.csv('/javascript/2012-04-20/players.json', function (playerData) {

    // Graph dimensions.
    var height = 500;
    var width  = 500;
    var barHeight = 20;

    // Clean up our data.
	playerData.forEach(function (p) {
        p.goals  = +p.goals;
        p.assist = +p.assists;
        p.points = +p.points;
        p.games  = +p.games;
        p.years  = +p.years;
        var range = p.range.split('-');
        p.startYear = +range[0];
        p.endYear   = +range[1];
        p.country  = p.country || 'Unknown';
	});

    var decade = function (year) {




    };

    // Dimensions.
    var players    = crossfilter(playerData);
    var all        = players.groupAll();
    var provinces  = players.dimension(function (p) { return p.province;});
    var countries  = players.dimension(function (p) { return p.country;});
    var goals      = players.dimension(function (p) { return p.goals - p.goals % 50;});
    var decades      = players.dimension(function (p) { return p.startYear - p.startYear % 10;});

    // Filters.
    var byProvince = provinces.group().all();
    var byCountry  = countries.group().all();
    var byDecade     = decades.group().all();


    //
    // Chart
    //

    var Chart = function (title, element, dimension, filter) {
        this.title = title;
        this.element = element;
        this.dimension = dimension;
        this.filter = filter;

        this.x = d3.scale.linear()
                .domain([0, width])
                .range([0, height]);

        this.xAxis = d3.svg.axis()
                      .scale(this.x)
                      .orient('bottom');

        this.brush = d3.svg.brush()
            .on("brushstart", this.onBrushStart.bind(this))
            .on("brush", this.onBrushMove.bind(this))
            .on("brushend", this.onBrushEnd.bind(this));

        this.element.append('text')
            .attr('class', 'graph_title')
            .attr('height', 50)
            .attr('x', 0)
            .attr('y', 20)
            .attr('color', 'black')
            .text(this.title);

        this.draw();

        // Hack, move this into draw.
        var axisY = this.dimension.length * barHeight + 45;
        this.element.append("g")
            .attr("transform", function(d, i) {
                return "translate(40, " + axisY + ")";
            }).attr('class', 'axis').call(this.xAxis);

    };

    Chart.prototype.onBrushStart = function () {
        console.log(this.brush.extent());
    };

    Chart.prototype.onBrushMove = function () {
        console.log(this.brush.extent());
    };

    Chart.prototype.onBrushEnd = function () {
        console.log(this.brush.extent());
    };

    Chart.prototype.draw = function () {

        var bars = this.element.selectAll('rect').data(this.dimension);

        var self = this;
        bars.enter().append('rect')
                .attr("class", function (d) { return d.key;})
                .attr("x", 40)
                .attr("y", function (d, i) { return i * barHeight + 40;})
                .attr("width", function (d) { return self.x(d.value);})
                .attr("height", barHeight - 2);

        bars.transition()
                .duration(800)
                .attr("width", function (d) { return self.x(d.value);});

        chart.selectAll('text.label')
                .data(this.dimension)
           .enter().append("text")
             .attr('class', 'label')
             .attr("x", 40)
             .attr("y", function(d, i) { return i * barHeight + 40;})
             .attr("dx", -3)
             .attr("dy", 13)
             .attr("text-anchor", "end") // text-align: right
             .text(function (d) { return d.key || 'World';});

        chart.call(this.brush.x(this.x));

    };

    // Draw the bar chart.
    var chart = d3.select("#vis").append("svg")
                    .attr("class", "chart")
                    .attr("width", 600)
                    .attr("height", 400);

    new Chart('Players by Province', chart, byProvince, provinces);

    var chart = d3.select("#vis").append("svg")
                    .attr("class", "chart")
                    .attr("width", 600)
                    .attr("height", 1000);

    new Chart('Players by Country', chart, byCountry, countries);

    var chart = d3.select("#vis").append("svg")
                    .attr("class", "chart")
                    .attr("width", 600)
                    .attr("height", 1000);

    new Chart('Players by Decade', chart, byDecade, decades);


});
