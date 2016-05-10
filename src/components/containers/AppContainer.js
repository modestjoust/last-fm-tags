import React, {Component} from 'react';
import ArtistFormContainer from './FormContainer.js';
import VisualizationContainer from './VisualizationContainer.js';
import jquery from 'jquery';
import $ from 'jquery';

export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : {},
      apiKey : '4a602d46d1b07e2de85bbeda6a558e69'
    }
  }
  
  handleGetData(artist) {
    console.log('handling');
    artist = artist.toLowerCase();
    var url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist="
			+ artist + "&api_key=" + this.state.apiKey + "&format=json";

    $.get(url, function(data) {
      var tags = [];
			for (var tagIndex = 0; tagIndex < 10; tagIndex++) {
        tags.push({
          tag : data.toptags.tag[tagIndex].name,
          weight : data.toptags.tag[tagIndex].count
        });
			}
      this.setState({ data : tags,
        artist : artist });
    }.bind(this));
  }

  render() {
    console.log(this.state)
    var test = Object.getOwnPropertyNames(this.state.data).length > 0 ?
      'is ' + this.state.data[0].tag :
      'no data';
    return (
      <div>
        <h1>{this.state.artist} {test}</h1>
        <ArtistFormContainer handleGetData={this.handleGetData.bind(this)}/>
        <VisualizationContainer data={this.state.data}/>
      </div>
    );
  }
}
