
var APIKey = "fdfd2959b5b88fffc4293758b6e365ff";	// key used when sending requests to url below
var artist = "radiohead";							// initial value for artist


window.onload = function init() {
	
	//
	//	This function first sends a request to the url below, and collects the XML response. The XML response is then
	//	processed to retrieve data values wanted: each tag and it's associated weight/popularity. These values are arranged
	//	so that they are easy to access when calling d3/svg functions. 
	//
	document.getElementById("getData").onclick = function() {
		
		artist = document.getElementById("artistName").value.toLowerCase();
		var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=" + artist + "&api_key=" + APIKey;
		var xmlDoc =loadXMLDoc(url);
		
		if( xmlDoc.getElementsByTagName("lfm")[0].getAttribute("status") == "failed" ) {
			alert('Failed to retrieve artist information.');
			return;
		}
		
		//
		//	initialize arrays to hold data
		//
		var genres = [];
		var tagWeight = [];
		var dictionary = [];
		var newTag;
		
		//
		//	Picks out of the xml object the target data
		//
		for ( var tagIndex = 1; tagIndex < 20; tagIndex += 2 ) {
		
			genres.push(xmlDoc.getElementsByTagName("lfm")[0].childNodes[1].childNodes[tagIndex].childNodes[1].innerHTML);
			tagWeight.push(xmlDoc.getElementsByTagName("lfm")[0].childNodes[1].childNodes[tagIndex].childNodes[3].innerHTML);
		}
		
		//
		//	pushes newTag objects onto dictionary, which is used as the dataset to draw figures below
		//
		for ( var i = 0; i < 10; i++ ) {
		
			newTag = {tag:genres[i].toUpperCase(), weight:tagWeight[i]};
			dictionary.push(newTag);
		}
		
		//
		//	clears previous bars/labels
		//
		clearScreen();
		
		//
		//	draws rectangles according to their tag weight
		//
		var svg = d3.select("svg");
		
					d3.selectAll("rect")
					.data(dictionary)
					.enter()
					
		var bars = svg.selectAll("rect")
					.transition()
					.duration(1000)		
					.attr("fill", function(d) { 
						return "rgba(40,10," + d.weight + ",.8)";
					})
					.attr("x", 0)
					.attr("y", function(d, i) {
						return i * ( h / dictionary.length );
					})
					.attr("width", function(d) {
						return 12 * d.weight;
					})
					.attr("height", h / dictionary.length - barsPadding)
					.attr("name", function(d) {
						return d.tag;
					});

		//
		//	draws labels on bars
		//
		var tagLabels = svg.selectAll("text")
					.data(dictionary)
					.enter()
					.append("text")
					.text( function(d) {
						return d.tag;
					})
					.attr("x", 5)
					.attr("y", function(d, i) {
						return i * ( h / dictionary.length ) + ( h / dictionary.length - barsPadding) / 1.6;
					})
					.attr("fill", "white")
					.attr("font-family", "'Courier New', Serif")
					.on("click", function(d) {
						console.log(d.tag);//return "getInfo("+d.tag+")";
					});
					
	}		
	
}

//
//	This function is used to retrieve genre descriptions when the associated bars are clicked. The process
//	is similar to the function above.
//
function getInfo(tag) {
		
	var searchTag = tag.toLowerCase();
	console.log("PLEASE");
	var url = "http://ws.audioscrobbler.com/2.0/?method=tag.getInfo&tag=" + searchTag + "&api_key=" + APIKey;
	var xmlDoc =loadXMLDoc(url);
	
	if ( xmlDoc.getElementsByTagName("lfm")[0].getAttribute("status") == "failed" ) {
			alert('Failed to retrieve tag description.');
			return;
	}
	
	//var description = [];
	var newDescription = "";
	var newLine = [];
	
	try { 
	//description.push(xmlDoc.getElementsByTagName("lfm")[0].childNodes[1].childNodes[11].childNodes[3].innerHTML);
	//var description = 
	document.getElementById("testDiv").innerHTML = xmlDoc.getElementsByTagName("lfm")[0].childNodes[1].
											childNodes[11].childNodes[3].textContent;
											
	var description = document.getElementById("testDiv").textContent;
	
	}
	catch(err) {
		alert("Failed to load tag description.");
		return;
	}

//description[0] = $('<textarea/>').html(description[0];	

	//
	//	Arranges data, which comes as a long string of characters,
	//	into lines of 100 characters, and removes CDATA characters
	//	on ends.
	//
//	for ( var i = 9; i < description[0].length - 3; i++) {
//		newDescription += description[0][i];
//	}
	
	for ( var i = 0; i < description.length/100; i++) {
		newLine.push( [ ] );
	}
	
	//var omitCharacter;
	
	
	// 100 characters per line, each line stored as element of newLine[]
	for ( var i = 0; i < description.length; i++ ) {
			newLine[Math.floor(i/100)] += description[i]; 
	}
	
	svg.selectAll(".tagDescription")	//removes previous description
			.remove();
	
	//
	//	draws new description in svg window
	//
	var tagDescription = svg.selectAll("svg")
					.data(newLine)
					.enter()
					.append("text")
					.text( function(d) {
						return d;
					})
					.attr("x", w / 4.6)
					.attr("y", function(d, i) {
						return h / 1.5 + 15 * i;
					})
					.attr("fill", "white")
					.attr("opacity", "0")
					.attr("font-family", "'Consolas', Serif")
					.attr("font-size", "14px")
					.attr("class", "tagDescription");
				
		svg.selectAll(".tagDescription")
					.transition()
					.duration(1000)
					.attr("opacity", "1");
	
}

//
//	This function clears all bars and text from the svg window, then redraws initial rectangles
//
function clearScreen() {
		
		d3.selectAll("rect")
			.remove();
		
		d3.selectAll("text")
			.remove();
		
		d3.select("body").selectAll("p")
			.remove();
		
		var bars = svg.selectAll("rect")
					.data(initBars)
					.enter()
					.append("rect")
					.attr("x", 0)
					.attr("y", function(d, i) {
						return i * ( h / initBars.length );
					})
					.attr("width", 0)
					.attr("height", h / initBars.length - barsPadding )
					.on("click", function(d, i) {
						getInfo(d.tag);
					});
}