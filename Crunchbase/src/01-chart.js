import * as d3 from 'd3'

// Create your margins and height/width
let margin = { top: 60, left: 50, right: 50, bottom: 60 }

let height = 300 - margin.top - margin.bottom

let width = 300 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-1')

// Create your scales
let xPositionScale = d3
  .scaleLinear()
  .domain([0, 12])
  .range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 14000000000000])
  .range([height, 0])

// Create your line generator
let lineworld = d3
  .line()
  .x(function(d) {
    return xPositionScale(+d.Month)
  })
  .y(function(d) {
    return yPositionScale(+d.money_raised_usd)
  })

let lineusa = d3
  .line()
  .x(function(d) {
    return xPositionScale(+d.Month)
  })
  .y(function(d) {
    return yPositionScale(+d.money_raised_usd)
  })

// Read in your data
Promise.all([
  d3.csv(require('./Data/Automative_US_data.csv')),
  d3.csv(require('./Data/Automative_World_data.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function
function ready([datapointsinvestment, datapointsinvestmentUSA]) {
  console.log(datapointsinvestmentUSA)
  let nestedworld = d3
    .nest()
    .key(d => {
      return d.location_country_code
    })
    .entries(datapointsinvestment)

  container
    .selectAll('.income-graph')
    .data(nestedworld)
    .enter()
    .append('svg')
    .attr('class', '.income-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)
      let datapoints = d.values

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', lineworld)
        .attr('stroke-width', 2)
        .attr('stroke', '#dd1c77')
        .attr('fill', 'none')
        .lower()

      svg
        .append('path')
        .datum(datapointsinvestmentUSA)
        .attr('d', lineusa)
        .attr('stroke-width', 2)
        .attr('stroke', '#f0f0f0')
        .attr('fill', 'none')

      svg
        .append('text')
        .text(d.key)
        .attr('font-size', 12)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)
        .attr('font-weight', 'bold')
        .attr('fill', '#bdbdbd')

      svg
        .append('text')
        .text('USA')
        .attr('x', (width * 1) / 6)
        .attr('y', 0)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', '#636363')
        .attr('dy', 20)
        .attr('text-anchor', 'start')

      /* Add in your axes */

      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickSize(-height)
        .tickFormat(d3.format('%B'))

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      svg
        .selectAll('.x-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')
        .attr('fill', '#bdbdbd')

      var yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickSize(-width)
        .tickFormat(d => '$' + d)

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      svg
        .selectAll('.y-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')
        .attr('fill', '#bdbdbd')
      svg.select('.axis').lower()
      svg.selectAll('.domain').remove()
    })
}

// d3.select('#blank-graph').on('stepin', () => {
//   svg
//     .selectAll('.countries')
//     .transition()
//     .attr('width', 0)

//   d3.select('#first-graph').on('stepin', () => {
//     svg
//       .selectAll('.countries')
//       .transition()
//       .attr('width', function(d) {
//         return widthScale(d.money_raised_used)
//       })

//     d3.select('#second-graph').on('stepin', () => {
//       svg
//         .selectAll('.countries')
//         .transition()
//         .attr('width', function(d) {
//           return widthScale(d.fundedorg_category_groups)
//         })

//       d3.select('#third-graph').on('stepin', () => {
//         svg
//           .selectAll('.countries')
//           .transition()
//           .attr('width', function(d) {
//             return widthScale(d.n_investors)
//           })

//         d3.select('#fourth-graph').on('stepin', () => {
//           svg
//             .selectAll('.countries')
//             .transition()
//             .attr('width', function(d) {
//               return widthScale(d.fundedorg_name)
//             })
//         })
//       })
//     })
//   })
// })
