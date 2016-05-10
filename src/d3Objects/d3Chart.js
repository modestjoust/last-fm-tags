var d3 = require('d3')
var d3Chart = {};

var w = window.innerWidth;
var h = window.innerHeight * .8;		// height of svg window
var barsPadding = 2;	// used when drawing bars to separate them
var labelLeftMargin = 10;

d3Chart.create = function(el, state) {
  var svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', w)//props.width)
    .attr('height', h)//props.height);
    .attr('style', 'background-color: white');//#ACAEB5');

  // create testChar to get pixel length
  svg.append('text')
    .text('.')
    .attr('class', 'testChar')
    .attr('x', -10).attr('y', -10)
    .attr("font-family", "'Courier New', Serif")
  svg.append('g')
    .attr('class', 'd3-bars');

  // Collects array of circle objects
  //
  // var randCircles = [];
  // for ( var i = 0; i < 100; i++ ) {
  //   var randCircle = { xCoord:Math.random() , yCoord:Math.random() , radius:Math.random() }
  //   randCircles.push(randCircle);
  // }
  //
  // // Useless random circles for now
  //
  // var circles = svg.selectAll("circle")
  //   .data(randCircles)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", function(d) {
  //     return w * d.xCoord;
  //   })
  //   .attr("cy", function(d) {
  //     return h * d.yCoord;
  //   })
  //   .attr("r", function(d) {
  //     return (70 * d.radius + 10);
  //   })
  //   .attr("fill", "yellow")
  //   .attr("opacity", .2)
  //   .attr("stroke-width", function(d) {
  //     return (d.radius * 40);
  //   })
  //   .attr("stroke-dasharray", "1, 1, 1, 1")
  //   .attr("stroke", function(d) {
  //     return "#FFD900";
  //   });

  this.update(el, state);
};

d3Chart.update = function(el, state) {
  this._drawBars(el, state.data);
};

d3Chart.destroy = function(el) {
  this._clearBars(el);
};

d3Chart._drawBars = function(el, /*scales,*/ data) {
  this._clearBars(el);
  var g = d3.select(el).selectAll('.d3-bars');
  var bar = g.selectAll('g')
    .data(data)

  // ENTER
  bar.enter().append('g')
    .attr('class', 'd3-bar')
    .attr('id', function(d, i) {
      return 'bar' + i;
    })
    .attr('barIndex', function(d, i) {
      return i;
    })

  // ENTER & UPDATE
  bar.append('rect')
    .attr("fill", function(d) {
    return "rgb(40,10," + d.weight + ")";
    })
    .attr("fill-opacity", .8)
    .attr("x", 0)
    .attr("y", function(d, i) {
      return i * ( h / data.length );
    })
    .attr("width", function(d) {
      return w * (d.weight / 100);
    })
    .attr("height", h / data.length - barsPadding)
    .attr("name", function(d) {
      return d.tag;
    });

  // append labels
  bar.append('text')
    .attr('class', 'd3-label')
    .attr("fill", "white")
    .attr("fill-opacity", 1)
    .attr("font-family", "'Courier New', Serif")
    .attr("cursor", "default")
    .style("pointer-events", "none")
    .attr("x", labelLeftMargin)
    .attr("y", function(d, i) {
      return i * ( h / data.length ) + ( h / data.length / 1.6);
    })
    .attr("text-anchor", "start")
    .attr("name", function(d) {
      return d.tag;
    })
    .text(function(d, i) {
      return d.tag;
    });

  // get label widths and char width
  var labels = d3.selectAll('.d3-label');
  var labelBBoxes = this.getLabelBoxes(labels);
  var charWidth = this.getCharWidth();

  // determine whether full label or abrv and fill in
  labels.text(function(d, i) {
    var thisBar = bar.select('rect')
    var thisBarWidth = thisBar[0][i].width.animVal.value;
    var thisBarHeight = thisBar[0][i].height.animVal.value;

    var thisLabelWidth = labelBBoxes[i].width;
    var thisLabelHeight = labelBBoxes[i].height;

    if (thisLabelWidth > thisBarWidth) {
      var allowedChars = Math.floor(thisBarWidth / charWidth);
      var newLabel = d.tag.slice(0, allowedChars - 4);
      for (var i = 0; i < 3; i++) {
        newLabel += '.';
      }
      return newLabel;
    } else {
      return d.tag
    }
  });

  var labelTexts = this.getLabelTexts(labels);

  // MOUSEOVER
  bar.on("mouseover", function(d, i) {
    var thisBarWidth = this.firstChild.width.animVal.value;
    // console.log(this)
    // var thisBarText = this.lastChild.innerHTML;

    // console.log(thisBarText)
    // var thisBar = bar.select('rect')
    // var thisBarWidth = thisBar[0][i].width.animVal.value;
    // console.log(this.firstChild)
    // console.log(this.lastChild)
    // console.log(charWidth)

    d3.select(this.firstChild)  // rect
      .transition()
      .duration(100)
      .attr("width", function() {
        return thisBarWidth < labelBBoxes[i].width ?
          (labelBBoxes[i].width + (2 * labelLeftMargin)) :
          thisBarWidth;
      })
      .attr("fill", function() {
        return "rgb(60,30," + (d.weight + 20) + ")";
      })

    d3.select(this.lastChild) // text
      .text(function(d, i) {
        return d.tag;
      })
  })

  // MOUSEOUT
  .on('mouseout', function() {
    console.log()
    var thisBarIndex = this.getAttribute('barIndex');
    d3.select(this.firstChild)
      .transition()
      .duration(100)
      .attr("width", function(d) {
        console.log('mouseout' + d.weight)
        return w * (d.weight / 100);
      })
      .attr("fill", function(d) {
        return "rgb(40,10," + d.weight + ")";
      })

    d3.select(this.lastChild)
      .transition()
      .duration(100)
      .text(function() {
        return labelTexts[thisBarIndex];
      })
  })

  // EXIT
  bar.exit()
    .remove();
}

//get height/width of text labels
d3Chart.getLabelBoxes = function(labels) {
  console.log(labels)
  var labelBBoxes = []
  labels.each(function(d, i) {
    labelBBoxes.push(this.getBBox())
  })
  return labelBBoxes;
}

//get innerHTML of text labels
d3Chart.getLabelTexts = function(labels) {
  var labelTexts = []
  labels.each(function(d, i) {
    labelTexts.push(this.innerHTML)
  })
  console.log(labelTexts)
  return labelTexts;
}

//get width of testChar
d3Chart.getCharWidth = function() {
  var testChar = d3.select('.testChar');
  var charWidth = testChar.node().getBBox().width;
  console.log(charWidth);
  return charWidth;
}


d3Chart._clearBars = function(el) {
  console.log('clearing bars')
  d3.selectAll(".d3-bar")
    .remove();
}

d3Chart._clearLabels = function(el) {
    console.log('clearing labels')
    var labels = d3.selectAll("text.d3-label")
    labels.remove();
}

export default d3Chart;
