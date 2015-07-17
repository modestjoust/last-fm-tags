/*
//	Code snippet taken from w3schools.com
//
//	This function sends a request to a server and 
//	returns the xml object.
*/

function loadXMLDoc(filename) {
			if (window.XMLHttpRequest)
				{
				xhttp=new XMLHttpRequest();
				}
			else // code for IE5 and IE6
				{
				xhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
			xhttp.open("GET",filename,false);
			xhttp.send();
			return xhttp.responseXML;
		}