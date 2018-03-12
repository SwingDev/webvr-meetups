import React from 'react';

import { View } from 'react-vr';

import VideoGrid from '../containers/VideoGrid';
import VideoSkybox from '../containers/VideoSkybox';

class App extends React.Component {
  render() {
    return (
      <View>
        <VideoSkybox />
        <VideoGrid />
      </View>
    );
  }
}

export default App;
