const ASSETS_PATH = 'https://assets.swingdev.io/reactvr-demo-videos';

export const VIDEO_RATIO = 1920 / 1080;
export const VIDEO_HEIGHT = 1;
export const VIDEO_WIDTH = VIDEO_RATIO * VIDEO_HEIGHT;

export const GRID_COLUMNS = 3;
export const GRID_Z = -4;

export const VIDEOS = [
  {
    title: 'Doi Suthep',
    source: `${ASSETS_PATH}/temple.mp4`,
    thumb: `${ASSETS_PATH}/temple-thumb.mp4`,
  },
  {
    title: 'Bavarian Alps',
    source: `${ASSETS_PATH}/waterfall.mp4`,
    thumb: `${ASSETS_PATH}/waterfall-thumb.mp4`,
  },
  {
    title: 'Crystal Shower Falls',
    source: `${ASSETS_PATH}/cave.mp4`,
    thumb: `${ASSETS_PATH}/cave-thumb.mp4`,
  },
];

