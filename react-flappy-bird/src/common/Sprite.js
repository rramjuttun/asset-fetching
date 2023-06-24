//Adapted from react-spritesheet
import React from 'react';

//import sheetURL from '../res/sheet2.png'; // Local import
import {sheetURL} from './asset-list.js'  // URL import 

export const Sprite = ({ filename, x, y, width, height }) => {
  if (!filename) {
    return null;
  }

  const style = {
    backgroundImage: `url(${filename})`,
    backgroundPosition: `${x * (-1)}px ${y * (-1)}px`,
    width,
    height,
  };

  //added new x,y,w,h so that the store can use this compute value
  return <div style={style} data-x={x} data-y={y} data-w={width} data-h={height} />;
};

export const bg = Sprite({
  filename: sheetURL,
  x: 0,
  y: 0,
  width: 276,
  height: 228
});

export const fg = Sprite({
  filename: sheetURL,
  x: 276,
  y: 0,
  width: 222,
  height: 112
});

export const bird0 = Sprite({
  filename: sheetURL,
  x: 312,
  y: 230,
  width: 34,
  height: 24
});

export const bird1 = Sprite({
  filename: sheetURL,
  x: 312,
  y: 256,
  width: 34,
  height: 24
});

export const bird2 = Sprite({
  filename: sheetURL,
  x: 312,
  y: 282,
  width: 34,
  height: 24
});

export const pipeN = Sprite({
  filename: sheetURL,
  x: 502,
  y: 0,
  width: 52,
  height: 400
});

export const pipeS = Sprite({
  filename: sheetURL,
  x: 554,
  y: 0,
  width: 52,
  height: 400
});

export const gameover = Sprite({
  filename: sheetURL,
  x: 118,
  y: 272,
  width: 188,
  height: 38
});

export const _ok_ = Sprite({
  filename: sheetURL,
  x: 238,
  y: 382,
  width: 80,
  height: 28
});

export const splash = Sprite({
  filename: sheetURL,
  x: 0,
  y: 228,
  width: 117,
  height: 100
});

export const ready = Sprite({
  filename: sheetURL,
  x: 118,
  y: 310,
  width: 174,
  height: 44
});


export const bg_h = bg.props['data-h']
export const bg_w = bg.props['data-w']
export const fg_h = fg.props['data-h']
export const fg_w = fg.props['data-w']
export const bird_h = bird0.props['data-h'] //all the bird maintain same height
export const bird_w = bird0.props['data-w'] //all the bird maintain same width
export const pipe_h = pipeN.props['data-h'] //both pipe north and south are same height
export const pipe_w = pipeN.props['data-w'] //both pipe north and south are same width
