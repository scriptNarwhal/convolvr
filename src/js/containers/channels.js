import React, { Component } from 'react';
import Shell from '../components/shell';
import RadialControl from '../components/radial-control';

export default class Channels extends Component {
  render() {
    return (
        <Shell className="channels">
            <RadialControl onClick={
                e => {

                }
            } />
        </Shell>
    )
  }
}

Channels.defaultProps = {

}
