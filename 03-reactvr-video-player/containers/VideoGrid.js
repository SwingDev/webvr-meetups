import React from 'react';
import { connect } from 'react-redux';

import { View, Animated } from 'react-vr';

import { VIDEO_WIDTH, GRID_Z } from '../config';
import { playVideo } from '../actions';
import { getPlayingVideo } from '../reducers/videos';

import VideoCard from '../components/VideoCard';
import getColumns from '../utils/columns-helper';

const ROOT_STYLES = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center',
  layoutOrigin: [0.5, 0.5],
};

const COLUMN_STYLES = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 0.05,
  marginRight: 0.05,
  width: VIDEO_WIDTH,
};

const ROW_STYLES = {
  marginTop: 0.05,
  marginBottom: 0.05,
};

class VideoGrid extends React.Component {
  state = {
    opacity: new Animated.Value(1),
    translateZ: new Animated.Value(GRID_Z),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentVideo) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  zoomIn() {
    Animated.parallel([
      Animated.timing(
        this.state.translateZ,
        {
          toValue: -2,
          duration: 300,
        },
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: 300,
        },
      ),
    ]).start();
  }

  zoomOut() {
    this.state.translateZ.setValue(GRID_Z);

    Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        duration: 300,
      },
    ).start();
  }

  render() {
    const { translateZ, opacity } = this.state;
    const { videos, setPlayVideo } = this.props;

    return (
      <Animated.View
        style={{
          ...ROOT_STYLES,
          opacity,
          transform: [{
            translateY: -0.26,
          }, {
            translateZ,
          }, {
            rotateX: -6,
          }],
        }}
      >
        {getColumns(videos).map((rows, columnIndex) => (
          <View
            key={columnIndex}
            style={COLUMN_STYLES}
          >
            {rows.map((item, index) => (
              <VideoCard
                key={index}
                source={item.thumb}
                style={ROW_STYLES}
                title={item.title}
                onPlayClick={() => setPlayVideo(item.id)}
              />
            ))}
          </View>
        ))}
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
  videos: state.videos,
  currentVideo: getPlayingVideo(state.videos),
});

const mapDispatchToProps = dispatch => ({
  setPlayVideo: id => dispatch(playVideo(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoGrid);
