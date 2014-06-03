angular.module('starter.directives', [])

.directive('donutChart', function ($parse) {
  var directiveDefinitionObject = {
     restrict: 'E',
     replace: false,
     scope: {data: '=chartData'},
     link: function (scope, element, attrs) {

      var width = 200,
          height = 200,
          radius = Math.min(width, height) / 2;

      var color = d3.scale.ordinal()
          .range(["#4099FF","#ef4e3a"]);

      var arc = d3.svg.arc()
          .outerRadius(radius - 50)
          .innerRadius(radius - 10);

      var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d; });

      var svg = d3.select(element[0]).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
            .data(pie(scope.data))
          .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data; });
     }
  };
  return directiveDefinitionObject;
});