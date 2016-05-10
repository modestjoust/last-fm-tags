import React, {Component} from 'react';
import ArtistForm from '../ArtistForm.js'

export default class FormContainer extends Component {
  constructor(props) {
    super(props);
  }
  handleGetData(artist) {
    this.props.handleGetData(artist);
    return;
  }
  render() {
    return (
      <ArtistForm handleGetData={this.handleGetData.bind(this)}/>
    );
  }
}
