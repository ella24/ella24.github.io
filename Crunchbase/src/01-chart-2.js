import * as d3 from 'd3'

let margin = { top: 50, left: 125, right: 20, bottom: 100 }

let height = 600 - margin.top - margin.bottom
let width = 600 - margin.left - margin.right

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var xPositionScale = d3
  .scaleLinear()
  .domain([0, 50])
  .range([0, width])

var yPositionScale = d3
  .scaleBand()
  .domain([-1e6, 2e6])
  .range([height, 0])
  .padding(0.25)

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#845EC2',
    '#D65DB1',
    '#FF6F91',
    '#FF9671',
    '#FFC75F',
    '#F9F871',
    '#9BDE7E',
    '#4BBC8E'
  ])

d3.csv(require('./data/Automative_US_data.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))
function ready(datapoints) {
  var types = datapoints.map(d => d.location_city)
  yPositionScale.domain(types)

  let datapoints2018 = datapoints.filter(d => d.Year === '2018')
  var nested2018 = d3
    .nest()
    .key(d => d.location_city)
    .entries(datapoints2018)

  svg
    .selectAll('.fund-type')
    .data(nested2018)
    .enter()
    .append('rect')
    .attr('class', 'fund-type')
    .attr('y', d => yPositionScale(d.key))
    .attr('x', 0)
    .attr('height', yPositionScale.bandwidth())
    .attr('width', 0)
    .attr('fill', d => colorScale(d.key))
    .attr('opacity', 0.5)

  var yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(0)
    .tickFormat(d => d.money_raised_usd)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg
    .selectAll('.y-axis text')
    .attr('fill', '#999999')
    .attr('dx', -10)

  var xAxis = d3
    .axisTop(xPositionScale)
    .tickFormat(d => d)
    .tickSize(-height)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .call(xAxis)
    .lower()

  svg.selectAll('.axis line').attr('stroke', '#ccc')
  svg.selectAll('.axis path').attr('stroke', 'none')

  svg.selectAll('.axis text').attr('font-size', 15)
  svg.selectAll('.x-axis text').attr('fill', '#999999')

  // SCROLLYTELLING! steps

  d3.select('#blank').on('stepin', () => {
    svg.selectAll('.fund-type').attr('width', 0)
  })

  d3.select('#eleven').on('stepin', () => {
    svg
      .selectAll('.fund-type')
      .data(nested2018)
      .transition()
      .attr('y', d => yPositionScale(d.key))
      .attr('width', d => {
        var raise2018 = d.values.map(function(d) {
          return d.money_raised_usd
        })
        let sumCasualties2018 = d3.sum(raise2018)
        return xPositionScale(sumCasualties2018)
      })
      .attr('fill', d => colorScale(d.key))
  })
}
