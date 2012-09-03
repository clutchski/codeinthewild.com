/**
 * A visualization of NHL hockey players by place of birth and time.
 */

d3.csv('/javascript/2012-04-20/players.json', function (playerData) {

    var countriesToShow = [
        'Canada',
        'USA',
        'Sweden',
        'Finland',
        'Russia',
        'Czech Republic',
        'Switzerland',
        'Slovakia',
        'Latvia',
        'Germany',
        'England'
    ];

    // Graph dimensions.
    var height = 500;
    var width  = 300;
    var barHeight = 10;

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

    // Dimensions.
    var players    = crossfilter(playerData);
    var all        = players.groupAll();
    var provinces  = players.dimension(function (p) { return p.province || 'World';});
    var countries  = players.dimension(function (p) {
        if (~countriesToShow.indexOf(p.country)) {
            return p.country;
        } else {
            return 'Other';
        }
    });
    var goals      = players.dimension(function (p) { return p.goals - p.goals % 50;});
    var decades    = players.dimension(function (p) { return p.startYear - p.startYear % 10;});

    // Filters.
    var byProvince = provinces.group().all();
    var byCountry  = countries.group().all();
    var byDecade   = decades.group().all();


    var Chart = function (title, element, dimension, filter) {
        this.title = title;
        this.element = element;
        this.dimension = dimension;
        this.filter = filter;

        // Create the x-axis
        this.x = d3.scale.linear()
                .domain([0, 5000])
                .range([0, 300]);

        this.xAxis = d3.svg.axis()
                      .scale(this.x)
                      .orient('bottom')
                      .ticks(7);

        // Create a scale for out
        this.y = d3.scale.linear()
                .domain([0, 200])
                .range([0, this.dimension.length]);

        this.brush = d3.svg.brush()
            .on("brushstart", this.onBrushStart.bind(this))
            .on("brush", this.onBrushMove.bind(this))
            .on("brushend", this.onBrushEnd.bind(this));

        this.element.append('text')
            .attr('class', 'graph_title')
            .attr('x', 0)
            .attr('y', 20)
            .attr('color', 'black')
            .text(this.title);

        this.element.append("g").attr("class", "brush")
            .attr("transform", function(d, i) {
                return "translate(60, " + 0 + ")";
            })
            .call(this.brush);

        this.draw();

        // Hack, move this into draw.
        var axisY = this.dimension.length * barHeight + 45;
        this.element.append("g")
            .attr("transform", function(d, i) {
                return "translate(60, " + axisY + ")";
            }).attr('class', 'axis').call(this.xAxis);
    };

    Chart.prototype.onBrushStart = function () {
    };

    Chart.prototype.onBrushMove = function () {
    };

    Chart.prototype.onBrushEnd = function () {
    };


    Chart.prototype.onFilter = function () {

    };

    Chart.prototype.draw = function () {

        var bars = this.element.selectAll('rect')
                        .data(this.dimension, function (dim) {
                            return dim.key;
                        });

        var self = this;
        bars.enter().append('rect')
                .attr("class", function (d) { return d.key;})
                .attr("x", 60)
                .attr("y", function (d, i) { return i * barHeight + 40;})
                .attr("width", function (d) { return self.x(d.value);})
                .attr("value", function (d) { return d.value;})
                .attr("height", barHeight - 2);

        bars.transition()
                .duration(800)
                .attr("width", function (d) { return self.x(d.value); })
                .attr("value", function (d) { return d.value;});;

        this.element.selectAll('text.label')
                .data(this.dimension)
           .enter().append("text")
             .attr('class', 'label')
             .attr("x", 60)
             .attr("y", function(d, i) { return i * barHeight + 40;})
             .attr("dx", -3)
             .attr("dy", 8)
             .attr("text-anchor", "end") // text-align: right
             .attr('font-size', barHeight)
             .text(function (d) { return d.key || 'World';});

        this.element.call(this.brush.y(this.y).x(this.x));

    };

    // Draw the bar chart.
    var chart = d3.select("#vis").append("svg")
                    .attr("class", "chart")
                    .attr("width", 600)
                    .attr("height", 200);

    var c1 = new Chart('Players by Province', chart, byProvince, provinces);

    var chart = d3.select("#vis").append("svg")
                    .attr("class", "chart")
                    .attr("width", 600)
                    .attr("height", 200);

    var c2 = new Chart('Players by Country', chart, byCountry, countries);

    var chart = d3.select("#vis").append("svg")
                    .attr("class", "chart")
                    .attr("width", 600)
                    .attr("height",200);

    var c3 = new Chart('Players by Decade', chart, byDecade, decades);

    //var charts = [c1, c2, c3];

    //setTimeout(function () {
    //    decades.filter([1960, 1980]);
    //    countries.filter('Canada');
    //    provinces.filter('ONT');
    //    charts.forEach(function (chart) {
    //        chart.draw();
    //    });
    //}, 2000);
});
