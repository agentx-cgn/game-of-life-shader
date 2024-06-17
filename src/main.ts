
// Adapted from https://codepen.io/jasonandrewth/pen/poKjXgQ

import { Projector } from './projector';
import { Interface } from './interface';

import './styles.css';

window.addEventListener('load', () => {

  Interface.initiate();
  Projector.initiate( Interface.$canvas );
  Projector.resize();
  Projector.animate('start');

  window.addEventListener('resize', Projector.resize);
  window.addEventListener('dblclick', Interface.toggleFullscreen);

});
