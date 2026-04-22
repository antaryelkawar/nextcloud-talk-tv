import { Component } from '@lightningjs/core';
import { callStore, callActions } from '../stores/callStore';
import { observe } from '../../../bridge/observer';
import TvButton from '../../../components/TvButton';

export default class CallView extends Component {
  private _index: number = 1;

  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xff000000,
      Participants: {
        w: 1920,
        h: 1080,
      },
      Controls: {
        x: 960,
        y: 900,
        mount: 0.5,
        w: 1200,
        h: 150,
        rect: true,
        color: 0x88000000,
        shader: { type: 'RoundedRectangle', radius: 20 } as any,
        Buttons: {
          x: 600,
          y: 75,
          mount: 0.5,
          Mute: {
            type: TvButton,
            x: -300,
            w: 250,
            label: 'Mute',
          },
          Camera: {
            type: TvButton,
            x: 0,
            w: 250,
            label: 'Camera',
          },
          EndCall: {
            type: TvButton,
            x: 300,
            w: 250,
            label: 'End Call',
            // @ts-ignore
            color: 0xfff44336,
          },
        },
      },
    };
  }

  _init() {
    this._index = 1; // Default focus on Camera/Center
    this.setupObservers();
  }

  private setupObservers() {
    observe(() => callStore.participants, (participants) => {
      this.updateVideoLayout(participants);
    });

    observe(() => callStore.status, (status) => {
      if (status === 'ended') {
        this.fireAncestors('showConversationList');
      }
    });
  }

  private updateVideoLayout(participants: any[]) {
    this.println(`Updating layout for ${participants.length} participants`);
  }

  _getFocused() {
    const buttons = this.tag('Buttons').children;
    return buttons[this._index];
  }

  _handleLeft() {
    if (this._index > 0) this._index--;
  }

  _handleRight() {
    if (this._index < 2) this._index++;
  }

  $onButtonClick({ label }: { label: string }) {
    if (label === 'End Call') {
      callActions.setStatus('ended');
    } else if (label === 'Mute') {
      // Toggle mute
    } else if (label === 'Camera') {
      // Toggle camera
    }
  }

  println(msg: string) {
    console.log(`[CallView] ${msg}`);
  }
}
