/**
 * A visualization of NHL hockey players by place of birth and time.
 */


d3.csv('/javascript/2012-04-20/players.json', function (playerData) {

	playerData.forEach(function (p) {
        p.goals  = +p.goals;
        p.assist = +p.assists;
        p.points = +p.points;
        p.games  = +p.games;
        p.years  = +p.years;
        var range = p.range.split('-');
        p.startYear = +range[0];
        p.endYear   = +range[1];
	});

    // Create our dimensions.
    var players    = crossfilter(playerData);
    var all        = players.groupAll();
    var provinces  = players.dimension(function (p) { return p.province;});
    var byProvince = provinces.group().all();
    var countries  = players.dimension(function (p) { return p.country;});
    var byCountry  = countries.group().all();
    var goals      = players.dimension(function (p) { return p.goals - p.goals % 50;});
    var years      = players.dimension(function (p) { return p.startYear;});

    countries.filter("Canada");


    var brushstart = function () {
        console.log("start");
    };
    var brushstart = function () {
        console.log("move");
    };
    var brushend = function () {
        console.log("end");
    };

    var brush = d3.svg.brush()
         .on("brushstart", brushstart)
         .on("brush", brush)
         .on("brushend", brushend);


    // Draw the bar chart.
    var chart = d3.select("#vis").append("svg")
                    .attr("class", "chart")
                    .attr("width", 600)
                    .attr("height", 1000);

    var x = d3.scale.linear()
                .domain([0, 500])
                .range([0, 500]);

    var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom');

    var draw = function (year) {
        d3.selectAll('#total_player_count').text(players.size());
        d3.selectAll('#active_player_count').text(all.value());
        d3.selectAll('#current_decade').text(year);

        var bars = chart.selectAll('rect')
                .data(byProvince);

        bars.enter().append('rect')
                .attr("class", function (d) { return d.key;})
                .attr("value", function (d) { return d.value;})
                .attr("domain", function (d) { return x(d.value);})
                .attr("x", 40)
                .attr("y", function (d, i) { return i * 10;})
                .attr("width", function (d) { return x(d.value);})
                .attr("height", 10);

        bars.transition()
                .duration(1200)
                .attr("domain", function (d) { return x(d.value);})
                .attr("width", function (d) { return x(d.value);});

        chart.selectAll('text')
                .data(byProvince)
           .enter().append("text")
             .attr("x", 34)
             .attr("y", function(d, i) { return i * 10;})
             .attr("dx", -3)
             .attr("dy", 7)
             .attr("text-anchor", "end") // text-align: right
             .text(function (d) { return d.key;});
    };

    draw();

    chart.append("g")
            .attr("transform", function(d, i) { return "translate(30, 140)"})
            .attr('class', 'axis')
            .call(xAxis);

    var year = 1890;
    var drawDecades = function () {
        year = year + 10;
        if (year > 2020) {
            return null;
        }
        years.filter([year, year + 10]);
        draw(year);
        setTimeout(function () {
            drawDecades();
        }, 3000);
    };

    drawDecades();

});
