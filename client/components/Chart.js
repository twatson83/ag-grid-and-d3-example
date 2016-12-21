import React from 'react';
import * as d3 from "d3";
import "../d3-tip-v4";
import moment from 'moment';

export default class Chart extends React.PureComponent {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.requestHistoricalPrices(
      this.props.selectedStock.symbol,
      this.props.start,
      this.props.end);
  }

  componentDidUpdate() {
    if(this.props.historicalPrices.length > 0){
      // format the data
      this.props.historicalPrices.forEach(d => d.Date = new Date(d.Date));

      if(this.chart){
        this.update(this.props.historicalPrices);
      } else {
        this.initChart(this.props.historicalPrices);
        this.initAxis(this.props.historicalPrices);
        this.initTooltop(this.props.historicalPrices);
        this.initCrosshair(this.props.historicalPrices);
        this.update(this.props.historicalPrices);
      }

    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.selectedStock.symbol !== this.props.selectedStock.symbol){
      this.props.requestHistoricalPrices(
        newProps.selectedStock.symbol,
        newProps.start,
        newProps.end);
    }
  }

  initChart(){
    this.margin = {top: 10, right: 20, bottom: 60, left: 30};
    this.width = (this.parentDiv.offsetWidth - 20) - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;

    this.chart = d3.select(".chart")
      .attr("cursor", "none")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  initAxis(data){
    this.mindate = moment(this.props.start);
    this.maxdate = moment(this.props.end);
    this.min = d3.min(data, d => d.Low);
    this.max = d3.max(data, d => d.High);

    let days = this.maxdate.diff(this.mindate, 'days');
    if (days < 30){
      this.ticks = 1;
    } else {
      this.ticks = days / 30
    }

    this.y = d3.scaleLinear().range([this.height, 0]).domain([this.min, this.max]);
    this.x = d3.scaleTime()
               .domain([this.mindate, this.maxdate])
               .range([0, this.width]);

    this.chart.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x)
        .ticks(d3.timeDay.every(this.ticks))
        .tickFormat(d3.timeFormat("%d/%m/%Y")))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    this.chart.append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(this.y))
      .selectAll("text")
      .attr("dx", "-1em");
  }

  initTooltop(){
    this.tooltip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([0, 0])
      .direction(d => {
        let data = d.High > d.Low ? [d.High, d.Low] : [d.Low, d.High];
        let direction = "n";
        if (this.y(data[0]) - 80 < 0){
          direction = "s";
        }
        return direction;
      })
      .html(d => {
        return "<div class='tt-line'><div class='tt-title'>Date:</div><span>" + moment(d.Date.toISOString()).format("DD/MM/YYYY") + "</span></div>" +
          "<div class='tt-line'><div class='tt-title'>Open:</div><span>" + d.Open + "</span></div>" +
          "<div class='tt-line'><div class='tt-title'>Close:</div><span>" + d.Close + "</span></div>" +
          "<div class='tt-line'><div class='tt-title'>High:</div><span>" + d.High + "</span></div>" +
          "<div class='tt-line'><div class='tt-title'>Low:</div><span>" + d.Low + "</span></div>";
      });
    this.chart.call(this.tooltip);
  }

  initCrosshair(){
    let focus = this.chart.append("g").style("display", "none");

    focus.append('line')
      .attr('id', 'focusLineX')
      .attr('class', 'focusLine');
    focus.append('line')
      .attr('id', 'focusLineY')
      .attr('class', 'focusLine');

    let lineY = focus.select('#focusLineY');
    let lineX = focus.select('#focusLineX');

    let minY = this.y(this.min),
      maxY = this.y(this.max),
      maxX = this.x(this.maxdate);

    let applyMouseOverEvents = el => {
      el.on('mouseover', () => { focus.style('display', null); })
        .on('mouseout', () => { focus.style('display', 'none'); })
        .on('mousemove', function() {
          var pos = d3.mouse(this);
          lineY.attr('x1', pos[0]).attr('y1', minY)
            .attr('x2', pos[0]).attr('y2', maxY);
          lineX.attr('x1', 0).attr('y1', pos[1])
            .attr('x2', maxX).attr('y2', pos[1]);
        });
    };

    let overlay = this.chart
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr("cursor", "none");

    applyMouseOverEvents(overlay);
    applyMouseOverEvents(this.chart);
  }

  update(data){

    this.mindate = moment(this.props.start);
    this.maxdate = moment(this.props.end);
    this.min = d3.min(data, d => d.Low);
    this.max = d3.max(data, d => d.High);

    let days = this.maxdate.diff(this.mindate, 'days');
    if (days < 30){
      this.ticks = 1;
    } else {
      this.ticks = days / 30
    }

    this.y = d3.scaleLinear().range([this.height, 0]).domain([this.min, this.max]);
    this.x = d3.scaleTime().domain([this.mindate, this.maxdate]).range([0, this.width]);

    let line = this.chart
      .selectAll(".line")
      .data(data);

    line.enter()
      .append("line")
      .attr("class", d => d.Open > d.Close ? "line red" : "line green")
      .attr("x1", d => this.x(d.Date))
      .attr("y1", d => this.y(d.Low))
      .attr("x2", d => this.x(d.Date))
      .attr("y2", d => this.y(d.High))
      .on('mouseover', this.tooltip.show)
      .on('mouseout', this.tooltip.hide);

    line.attr("class", d => d.Open > d.Close ? "line red" : "line green")
      .attr("x1", d => this.x(d.Date) - (this.width/data.length)/4)
      .attr("y1", d => this.y(d.Low))
      .attr("x2", d => this.x(d.Date) - (this.width/data.length)/4)
      .attr("y2", d => this.y(d.High));

    line.exit().remove();

    let bar = this.chart.selectAll(".bar")
      .data(data);

    bar.enter()
      .append("rect").attr("class", d => d.Open > d.Close ? "bar red" : "bar green")
      .attr("x", d => this.x(d.Date) - ((this.width - 2)/data.length)/4)
      .attr("y", d => d.Close < d.Open  ? this.y(d.Open) : this.y(d.Close))
      .attr("width", 0.5 * (this.width - 2)/data.length)
      .attr("height", d => d.Close < d.Open  ? this.y(d.Close) - this.y(d.Open) :  this.y(d.Open) - this.y(d.Close))
      .on('mouseover', this.tooltip.show)
      .on('mouseout', this.tooltip.hide);

    bar.attr("class", d => d.Open > d.Close ? "bar red" : "bar green")
      .attr("x", d => this.x(d.Date) - ((this.width - 2)/data.length)/4)
      .attr("y", d => d.Close < d.Open  ? this.y(d.Open) : this.y(d.Close))
      .attr("width", 0.5 * (this.width - 2)/data.length)
      .attr("height", d => d.Close < d.Open  ? this.y(d.Close) - this.y(d.Open) :  this.y(d.Open) - this.y(d.Close));

    bar.exit().remove();

    // Update the Axis
    var xAxis = d3.axisBottom(this.x).ticks(d3.timeDay.every(this.ticks)).tickFormat(d3.timeFormat("%d/%m/%Y"));
    var yAxis = d3.axisLeft(this.y);

    this.chart.selectAll(".yaxis")
      .call(yAxis)
      .selectAll("text")
      .attr("dx", "-1em");

    this.chart.selectAll(".xaxis")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");
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
