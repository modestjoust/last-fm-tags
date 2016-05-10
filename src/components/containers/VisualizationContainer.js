import React, {Component} from 'react';
import Visualization from '../Visualization';

export default class VisualizationContainer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // var test = Object.getOwnPropertyNames(this.props.data).length > 0 ?
    //   'is also ' + this.props.data[1].tag :
    //   'no data';
    return (
      <Visualization data={this.props.data} />
    );
  }
}
