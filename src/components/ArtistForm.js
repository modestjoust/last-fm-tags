import React, {Component} from 'react';

export default class ArtistForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist : ''
    }
  }
  handleArtistChange(e) {
    this.setState({ artist : e.target.value })
  }
  handleGetData(e) {
    e.preventDefault();
    this.props.handleGetData(this.state.artist)
  }
  render() {
    return (
      <form className="artistForm" onSubmit={this.handleGetData.bind(this)}>
          <label id="artistName">Artist</label>
          <input type="text"
            id="artistName"
            placeholder="e.g. Radiohead"
            value={this.state.artist}
            onChange={this.handleArtistChange.bind(this)}
             />
          <input type="submit" value="Get tags!" />
      </form>
    )
  }
}
