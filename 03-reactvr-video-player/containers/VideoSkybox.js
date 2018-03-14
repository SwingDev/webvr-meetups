import React from 'react';
import { connect } from 'react-redux';

import {
  asset,
  Pano,
  View,
  VideoPano,
  Animated,
} from 'react-vr';

import { pauseVideo } from '../actions';
import { getPlayingVideo } from '../reducers/videos';
import BackButton from '../components/BackButton';

const AnimatedBackButton = Animated.createAnimatedComponent(BackButton);
const AnimatedPano = Animated.createAnimatedComponent(Pano);
const AnimatedVideoPano = Animated.createAnimatedComponent(VideoPano);

class VideoSkybox extends React.Component {
  static defaultProps = {
    currentVideo: {},
  };

  state = {
    buttonOpacity: new Animated.Value(0),
    panoOpacity: new Animated.Value(1),
    videoPanoOpacity: new Animated.Value(0),
    videoPanoVisible: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentVideo !== this.props.currentVideo) {
      if (nextProps.currentVideo.source) {
        this.hidePano();
      }
    }
  }

  hidePano() {
    Animated.timing(
      this.state.panoOpacity,
      {
        toValue: 0,
      },
    ).start();

    this.setState({
      videoPanoVisible: true,
    });
  }

  showPano() {
    Animated.parallel([
      Animated.timing(
        this.state.videoPanoOpacity,
        {
          toValue: 0,
        },
      ),
      Animated.timing(
        this.state.buttonOpacity,
        {
          toValue: 0,
        },
      ),
      Animated.timing(
        this.state.panoOpacity,
        {
          toValue: 1,
        },
      ),
    ]).start(this.handleShowPanoEnd);
  }

  showVideoPano() {
    Animated.sequence([
      Animated.timing(
        this.state.videoPanoOpacity,
        {
          toValue: 1,
        },
      ),
      Animated.timing(
        this.state.buttonOpacity,
        {
          toValue: 1,
        },
      ),
    ]).start();
  }

  handleShowPanoEnd = () => {
    const { currentVideo, setPauseVideo } = this.props;

    this.setState({
      videoPanoVisible: false,
    }, () => setPauseVideo(currentVideo.id));
  };

  handlePlayStatusChange = (event) => {
    const { playStatus } = event.nativeEvent;

    if (playStatus === 'ready') {
      this.showVideoPano();
    }
  };

  handleBackClick = () => {
    this.showPano();
  };

  render() {
    const {
      buttonOpacity,
      panoOpacity,
      videoPanoOpacity,
      videoPanoVisible,
    } = this.state;

    const { currentVideo } = this.props;

    return (
      <View>
        <AnimatedPano
          source={asset('background.jpg')}
          style={{
            opacity: panoOpacity,
            transform: [{
              scale: [2, 2, 2],
            }, {
              rotateY: 180,
            }],
          }}
        />

        {(videoPanoVisible) ? (
          <AnimatedVideoPano
            style={{
              opacity: videoPanoOpacity,
            }}
            source={(currentVideo.source) ? {
              uri: currentVideo.source,
            } : null}
            onPlayStatusChange={this.handlePlayStatusChange}
            loop
            muted
          />
        ) : null}

        <AnimatedBackButton
          style={{
            transform: [{
              translate: [-0.15, -1, -3.75],
            }],
            opacity: buttonOpacity,
          }}
          onClick={this.handleBackClick}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currentVideo: getPlayingVideo(state.videos),
});

const mapDispatchToProps = dispatch => ({
  setPauseVideo: id => dispatch(pauseVideo(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoSkybox);
