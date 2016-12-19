import React from 'react';
import * as d3 from "d3";
import "../d3-tip-v4";
import { getHistoricalPrices } from "../apis/finance";
import moment from "moment";

export default class Table extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    var margin = {top: 10, right: 20, bottom: 60, left: 30},
      width = (this.parentDiv.offsetWidth - 20) - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    var y = d3.scaleLinear()
      .range([height, 0]);

    var mindate = new Date(2016,0,1),
        maxdate = new Date(2016,3,1);

    var x = d3.scaleTime()
      .domain([mindate, maxdate])
      .range([0, width]);

    var chart = d3.select(".chart")
      .attr("cursor", "none")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.line()
      .x(function(d) {
        return x(d.Date);
      })
      .y(function(d) {
        return y(d.High);
      });

    getHistoricalPrices("YHOO", moment().subtract("years", 1), moment()).then((data)  => {

      // format the data
      data.forEach(function(d) {
        d.Date = new Date(d.Date);
      });

      data = data.filter(d => d.Date >= mindate && d.Date <= maxdate);

      var min = d3.min(data, d => d.Low);
      var max = d3.max(data, d => d.High);

      y.domain([min, max]);

      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .direction(d => {
          var data = d.High > d.Low ? [d.High, d.Low] : [d.Low, d.High];
          var direction = "n";
          if (y(data[0]) - 80 < 0){
            direction = "s";
          }

          return direction;
        })
        .html(function(d) {
          return "<div class='tt-line'><div class='tt-title'>Open:</div><span>" + d.Open + "</span></div>" +
            "<div class='tt-line'><div class='tt-title'>Close:</div><span>" + d.Close + "</span></div>" +
            "<div class='tt-line'><div class='tt-title'>High:</div><span>" + d.High + "</span></div>" +
            "<div class='tt-line'><div class='tt-title'>Low:</div><span>" + d.Low + "</span></div>";
        });

      chart.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
          .ticks(30)
          .tickFormat(d3.timeFormat("%d/%m/%Y")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      chart.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("dx", "-1em");

      chart.call(tip);

      var focus = chart.append("g").style("displgetHistoricalPricesay", "none");

      focus.append('line')
        .attr('id', 'focusLineX')
        .attr('class', 'focusLine');
      focus.append('line')
        .attr('id', 'focusLineY')
        .attr('class', 'focusLine');

      var lineY = focus.select('#focusLineY');
      var lineX = focus.select('#focusLineX');

      var minY = y(min),
        maxY = y(max),
        maxX = x(maxdate);

      var applyMouseOverEvents = el => {
        el.on('mouseover', function() { focus.style('display', null); })
          .on('mouseout', function() { focus.style('display', 'none'); })
          .on('mousemove', function() {
            lineY
              .attr('x1', d3.event.pageX-margin.left-10).attr('y1', minY)
              .attr('x2', d3.event.pageX-margin.left-10).attr('y2', maxY);

            lineX
              .attr('x1', 0).attr('y1', d3.event.pageY-margin.top-10)
              .attr('x2', maxX).attr('y2', d3.event.pageY-margin.top-10);
          });
      };

      var overlay = chart.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .attr("cursor", "none");

      applyMouseOverEvents(overlay);
      applyMouseOverEvents(chart);

      chart.selectAll(".line")
        .data(data)
        .enter().append("line")
        .attr("class", d => {
          return d.Open > d.Close ? "line red" : "line green"
        })
        .attr("x1", function(d) {
          return x(d.Date) - (width/data.length)/4;
        })
        .attr("y1", function(d) {
          return y(d.Low);
        })
        .attr("x2", function(d) {
          return x(d.Date) - (width/data.length)/4;
        })
        .attr("y2", function(d) {
          return y(d.High);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

      chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", d => {
          return d.Open > d.Close ? "bar red" : "bar green"
        })
        .attr("x", function(d) {
          return x(d.Date) - (width/data.length)/2;
        })
        .attr("y", function(d) {
          return d.Close < d.Open  ? y(d.Open) : y(d.Close);
        })
        .attr("width", 0.5 * (width - 2)/data.length)
        .attr("height", function(d) {
          return d.Close < d.Open  ? y(d.Close) - y(d.Open) :  y(d.Open) - y(d.Close);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    });
  }

  render() {
    return (
      <div ref={p => this.parentDiv = p}>
        <div style={{padding: "10px"}}>
          <svg className="chart" ref="svg">
          </svg>
        </div>
      </div>
    )
  }
}
