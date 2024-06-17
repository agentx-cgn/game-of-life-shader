import Stats from 'stats.js'
import * as dat from 'dat.gui';
import { Projector } from './projector';

export const Interface = ( function () {

  const DEBUG = true;

  const $$ = document.querySelector.bind(document);

  // @ts-ignore
  let self;

  let
    stats      = new Stats(),
    datgui     = new dat.GUI(),
    $debuginfo = $$('.debuginfo') as HTMLDivElement,
    $btnStart  = $$('.btnStart')  as HTMLButtonElement,
    $btnStep   = $$('.btnStep')   as HTMLButtonElement,
    $btnStop   = $$('.btnStop')   as HTMLButtonElement,
    $canvas    = $$('canvas')     as HTMLCanvasElement
  ;

  return self = {

    stats,
    datgui,
    $canvas,

    initiate: function () {

      stats.showPanel(0);
      document.body.appendChild(stats.dom);

      $btnStart.onclick = () => Projector.animate('start');
      $btnStop.onclick  = () => Projector.animate('stop');
      $btnStep.onclick  = () => Projector.animate('step');

      DEBUG && console.log('I.initiate.out');


    },

    toggleFullscreen: function () {

      const fullscreenElement = document.fullscreenElement || (document as any).webkitFullscreenElement

      if (!fullscreenElement) {
          if ($canvas.requestFullscreen) {
              $canvas.requestFullscreen()
          } else if (($canvas as any).webkitRequestFullscreen) {
            ($canvas as any).webkitRequestFullscreen()
          }
      } else {
          if (document.exitFullscreen) {
              document.exitFullscreen()
          } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen()
          }
      }

    },

    debug: function (info: any) {
      $debuginfo.innerText = JSON.stringify(info);
    }

  }


})();