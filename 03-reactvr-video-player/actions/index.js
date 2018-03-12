export const PLAY_VIDEO = 'PLAY_VIDEO';
export const PAUSE_VIDEO = 'PAUSE_VIDEO';

export const playVideo = id => ({
  type: PLAY_VIDEO,
  id,
});

export const pauseVideo = id => ({
  type: PAUSE_VIDEO,
  id,
});
