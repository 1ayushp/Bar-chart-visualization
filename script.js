let url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let req=new XMLHttpRequest()
let data
let values

let heightScale
let xScale
let xAxisScale
let yScale
let yAxisScale

let width=800
let height=600
let padding=40

let svg=d3.select('svg')
let drawCanvas=()=>{
    svg.attr('width',width)
    svg.attr('height',height)
}
let generateScales=()=>{
    heightScale=d3.scaleLinear()
                    .domain([0,d3.max(values,(item)=>{  /// Lowest and highest value of input
                        return item[1]
                    })])
                    .range([0,height-2*padding]) /// range of height it can translate into

    xScale=d3.scaleLinear()  /// positoning our bars horizontally with indexing
                    .domain([0,values.length -1 ])
                    .range([padding,width-padding])

    let datesArray =values.map((item)=>{
        return new Date(item[0])
    })

    xAxisScale=d3.scaleTime()
                    .domain([d3.min(datesArray),d3.max(datesArray)])
                    .range([padding,width-padding])

    yAxisScale=d3.scaleLinear()
                    .domain([0,d3.max(values,(item)=>{
                        return item[1]
                    })])
                    .range([height-padding,padding])
}
let drawBars=()=>{

    

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class','bar')
        .attr('width',(width-(2*padding))/values.length)
        .attr('data-date',(item)=>{
            return item[0]
        })
        .attr('data-gdp',(item)=>{
            return item[1]
        })
        .attr('height',(item)=>{
            return heightScale(item[1])
        })
        .attr('x',(item,index)=>{
            return xScale(index)
        })
        .attr('y',(item)=>{
            return (height-padding-heightScale(item[1]))
        })
        .on("mouseover", function(d) {
            const tooltip = document.getElementById("tooltip");
            tooltip.style.display = "block";
            tooltip.style.left = (d3.event.pageX + 10) + "px";
            tooltip.style.top = (d3.event.pageY - 40) + "px";
            tooltip.setAttribute("data-date", d[0]);
            tooltip.textContent = "Date: " + d[0] + ", GDP: $" + d[1] + " billion";
        })
        .on("mouseout", function() {
            document.getElementById("tooltip").style.display = "none";
        });
}
let generateAxis=()=>{
    let xAxis=d3.axisBottom(xAxisScale)
    let yAxis=d3.axisLeft(yAxisScale)


    svg.append('g')
        .call(xAxis)
        .attr('id','x-axis')
        .attr('transform','translate(0,'+(height-padding)+')')
        
        


    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        .attr('transform','translate( '+padding+',0)')
        .append("text")
        .attr("transform", "rotate(-90)")
        
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (-height/2) + 180 )
        .attr("y", 20 + padding)
        .style("text-anchor", "middle")
        .text("Gross Domestic Product");
    svg.append("text")
        .attr("x", width - 30)
        .attr("y", height )
        .style("text-anchor", "middle")
        .text("Year");

        
}
req.open('GET',url,true)
req.onload=()=>{
    data=JSON.parse(req.responseText)
    values=data.data
    ////console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxis()

}
req.send()
