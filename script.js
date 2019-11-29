let margin = {top: 30, right: 80, bottom: 80, left:80}
let width = 1300 - margin.left - margin.right;
let height = 570 - margin.top - margin.bottom;
let dataset=[]


fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then( blob => blob.json())
    .then( datos => {
        dataset = datos.data;
        const barWidth = width / dataset.length;
        const maxValue = d3.max(dataset)[1];

        const minValue = d3.min(dataset)[1];
        const maxDate = new Date(dataset[dataset.length - 1][0]);
        const minDate = new Date(dataset[0][0]);
        let chart = d3.select(".chartD3").append('svg')
                .attr('width', width + margin.left+margin.right )
                .attr('height', height + margin.top + margin.bottom )
                .append('g')
                .attr('transform', 'translate(' + margin.left +',' + margin.top + ')');

        let y = d3.scaleLinear()
                .domain([0, maxValue])
                .range([ height, 0])

        let x = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, width])
        
        let xAxis = d3.axisBottom(x);
        let yAxis = d3.axisLeft(y);
        
        chart
            .append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0,' + height + ')' )
            .call(xAxis)
        
        chart
            .append('g')
            .attr('id', 'y-axis')
            .call(yAxis)

        

        const tooltipDiv = d3.select('body')
                            .append('div')
                            .attr('class', 'tooltip')
                            .attr('id', 'tooltip')
                            .style('opacity', '0');
        

        /* let bar = chart.selectAll('g')
            .data(dataset)
            .enter()
            .append('g');
            
            bar.append('rect')
            .attr("class", "bar")
            .attr('data-date', (d) => d[0])
            .attr('data-gdp', (d) => d[1])
            .attr("x", (d,i) => x(new Date(d[0])) )
            .attr('y', d => {y(d[1])})
            .attr('width', barWidth)
            .attr("height", function(d) { return height - y(d[1]); }) */
            
            let bar = d3
                .select('svg')
                .selectAll('rect')
                .data(dataset)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('data-date', (d) => d[0])
                .attr('data-gdp', (d) => d[1])
                .attr('width', barWidth - 1)
                .attr('x', d => margin.left)
                .attr('y', d => y(d[1] + margin.top))
                .attr('height', d => height - y(d[1]))
                .attr('transform', (d,i) => 'translate(' + i*barWidth + ',' + (margin.top + 1 )+ ')')
                .on('mouseover', d => {
                    console.log('date:' + d[0])
                    tooltipDiv
                        .style('font-size', '14px')
                        .style('font-family', 'sans')
                        .attr('data-date', d[0])
                        .html('Date:<br/>' + d[0])
                        

                    tooltipDiv
                        .transition()
                        .duration(75)
                        .style('opacity', 1)
                })
                .on('mouseout', d=> {
                    tooltipDiv
                        .transition()
                        .duration(150)
                        .style('opacity', 0)
                })


        } );

