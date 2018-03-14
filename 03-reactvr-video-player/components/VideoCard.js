import React from 'react';

import {
  Video,
  MediaPlayerState,
  Animated,
  Text,
  VrButton,
} from 'react-vr';

import { VIDEO_WIDTH, VIDEO_HEIGHT } from '../config';

import PlayButton from '../components/PlayButton';

const ROOT_STYLE = {
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
};

const VIDEO_STYLE = {
  position: 'absolute',
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
  borderRadius: 0.05,
};

const BUTTON_STYLE = {
  position: 'absolute',
  layoutOrigin: [0.5, 0.5],
  top: '50%',
  left: '50%',
};

const TEXT_STYLE = {
  position: 'absolute',
  top: '100%',
  textAlign: 'center',
  fontSize: 0.12,
  fontWeight: '700',
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT * 0.25,
};

const AnimatedVrButton = Animated.createAnimatedComponent(VrButton);
const AnimatedPlayButton = Animated.createAnimatedComponent(PlayButton);

class VideoCard extends React.Component {
  state = {
    playerState: new MediaPlayerState({
      autoPlay: false,
      muted: true,
    }),
    buttonOpacity: new Animated.Value(0),
    translateZ: new Animated.Value(0),
  };

  handleEnter = () => {
    this.state.playerState.play();

    Animated.parallel([
      Animated.timing(
        this.state.buttonOpacity,
        {
          toValue: 1,
          duration: 300,
        },
      ),
      Animated.spring(
        this.state.translateZ,
        {
          toValue: 0.2,
          friction: 5,
        },
      ),
    ]).start();
  };

  handleExit = () => {
    this.state.playerState.pause();
    this.state.playerState.seekTo(0);

    Animated.parallel([
      Animated.timing(
        this.state.buttonOpacity,
        {
          toValue: 0,
          duration: 300,
        },
      ),
      Animated.spring(
        this.state.translateZ,
        {
          toValue: 0,
          friction: 5,
        },
      ),
    ]).start();
  };

  render() {
    const {
      playerState,
      buttonOpacity,
      translateZ,
    } = this.state;

    const {
      style,
      source,
      title,
      onPlayClick,
    } = this.props;

    return (
      <AnimatedVrButton
        style={{
          ...ROOT_STYLE,
          ...style,
          transform: [{
            translateZ,
          }],
        }}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
        onClick={onPlayClick}
      >
        <Video
          style={VIDEO_STYLE}
          source={{
            uri: source,
          }}
          playerState={playerState}
          loop
        />
        <AnimatedPlayButton
          style={{
            ...BUTTON_STYLE,
            opacity: buttonOpacity,
          }}
        />
        <Text
          style={TEXT_STYLE}
        >
          {title}
        </Text>
      </AnimatedVrButton>
    );
  }
}

export default VideoCard;
