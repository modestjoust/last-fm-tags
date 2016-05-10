
var apiKey = "4a602d46d1b07e2de85bbeda6a558e69";	// key used when sending requests to url below
var artist = "radiohead";							// initial value for artist

window.onload = function init() {

	//
	//	This function first sends a request to the url below, and collects the XML response. The XML response is then
	//	processed to retrieve data values wanted: each tag and it's associated weight/popularity. These values are arranged
	//	so that they are easy to access when calling d3/svg functions.
	//
	document.getElementById("getData").onclick = function() {

		artist = document.getElementById("artistName").value.toLowerCase();
		var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist="
			+ artist + "&api_key=" + apiKey + "&format=json";
		$.get(url, function(data) {
			var genres = [];
			var tagWeight = [];
			var dictionary = [];
			var newTag;

			for (var tagIndex = 0; tagIndex < 10; tagIndex++) {
				genres.push(data.toptags.tag[tagIndex].name)
				tagWeight.push(data.toptags.tag[tagIndex].count)
			}

			for ( var i = 0; i < 10; i++ ) {
				newTag = {tag:genres[i].toUpperCase(), weight:tagWeight[i]};
				dictionary.push(newTag);
			}

/////////////////////////////////

			clearScreen();

			var svg = d3.select("svg");

						d3.selectAll("rect")
						.data(dictionary)
						.enter()

			var bars = svg.selectAll("rect")
																						// skipping for now//
						.transition()
						.duration(1000)
																						/////////////////
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

			console.log(dictionary);
		})

		// if( xmlDoc.getElementsByTagName("lfm")[0].getAttribute("status") == "failed" ) {
		// 	alert('Failed to retrieve artist information.');
		// 	return;
		// }
	}

}

//
//	This function is used to retrieve genre descriptions when the associated bars are clicked. The process
//	is similar to the function above.
//
function getInfo(tag) {

	var searchTag = tag.toLowerCase();
	console.log("PLEASE");
	var url = "http://ws.audioscrobbler.com/2.0/?method=tag.getInfo&tag="
		+ searchTag + "&api_key=" + apiKey + '&format=json';

	$.get(url, function(data) {

		// if ( xmlDoc.getElementsByTagName("lfm")[0].getAttribute("status") == "failed" ) {
		// 		alert('Failed to retrieve tag description.');
		// 		return;
		// }

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
	})
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
