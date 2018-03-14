import { VIDEOS } from '../config';

import { PLAY_VIDEO, PAUSE_VIDEO } from '../actions';

const INITIAL_STATE = VIDEOS.map((video, index) => ({
  ...video,
  id: index + 1,
  playing: false,
}));

const updateVideoPlayState = (video, id, newState) => {
  if (video.id === id) {
    return {
      ...video,
      playing: newState,
    };
  }

  return video;
};

export const getPlayingVideo = videos => (
  videos.find(video => video.playing)
);

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PLAY_VIDEO:
      return state.map(video => (
        updateVideoPlayState(video, action.id, true)
      ));

    case PAUSE_VIDEO:
      return state.map(video => (
        updateVideoPlayState(video, action.id, false)
      ));

    default:
      return state;
  }
};

export default reducer;
