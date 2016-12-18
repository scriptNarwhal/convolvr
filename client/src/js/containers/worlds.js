import React, { Component } from 'react';
import Shell from '../components/shell';
import RadialControl from '../components/radial-control';

export default class Worlds extends Component {
  render() {
    return (
        <Shell className="worlds">
            <RadialControl onClick={
                e => {

                }
            } />
        </Shell>
    )
  }
}

Worlds.defaultProps = {

}
