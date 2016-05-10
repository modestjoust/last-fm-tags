import React, {Component} from 'react';
import d3Chart from '../d3Objects/d3Chart.js'

export default class Visualization extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div />
    );
  }
  componentDidMount() {
    console.log('component Did Mount');
    d3Chart.create(this.getDOMNode(), this.getChartState());
  }
  componentDidUpdate() {
    console.log('component Did Update');
    console.log(this.getChartState());
    d3Chart.update(this.getDOMNode(), this.getChartState());
  }
  getChartState() {
    return {
      data: this.props.data
    }
  }
  componentWillUnmount() {
    console.log('component Will Unmount')
    d3Chart.destroy(this.getDOMNode());
  }
  getDOMNode() {
    return React.findDOMNode(this);
  }
}
