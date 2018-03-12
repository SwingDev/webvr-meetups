import React from 'react';

import {
  asset,
  VrButton,
  Image,
} from 'react-vr';

class BackButton extends React.Component {
  render() {
    return (
      <VrButton
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <Image
          source={asset('back.png')}
          style={{
            width: 0.3,
            height: 0.3,
            transform: [{
              rotateX: -27,
            }],
          }}
        />
      </VrButton>
    );
  }
}

export default BackButton;
