import React from 'react';

import {
  asset,
  VrButton,
  Image,
} from 'react-vr';

class PlayButton extends React.Component {
  render() {
    return (
      <VrButton
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <Image
          source={asset('play.png')}
          style={{
            width: 0.3,
            height: 0.3,
          }}
        />
      </VrButton>
    );
  }
}

export default PlayButton;
