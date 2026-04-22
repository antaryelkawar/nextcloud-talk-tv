import { Component } from '@lightningjs/core';
import { TYPOGRAPHY } from '../core/constants';

export default class TvButton extends Component {
  static _template() {
    return {
      rect: true,
      w: 400,
      h: 80,
      color: 0xff1e1e1e, // Surface color
      shader: { type: 'RoundedRectangle', radius: 8 } as any,
      Label: {
        x: (w: number) => w / 2,
        y: (h: number) => h / 2,
        mount: 0.5,
        text: {
          text: '',
          fontSize: TYPOGRAPHY.BODY_SIZE,
          fontFace: 'Inter',
          textColor: 0xffffffff,
        },
      },
      FocusBorder: {
        rect: true,
        w: (w: number) => w,
        h: (h: number) => h,
        color: 0x00ffffff,
        alpha: 0,
        shader: { type: 'RoundedRectangle', radius: 8, stroke: 4, strokeColor: 0xff0082c9 } as any,
      },
    };
  }

  set label(v: string) {
    this.tag('Label').text.text = v;
  }

  _focus() {
    this.patch({
      smooth: { scale: 1.05 },
      FocusBorder: { smooth: { alpha: 1 } },
    });
  }

  _unfocus() {
    this.patch({
      smooth: { scale: 1.0 },
      FocusBorder: { smooth: { alpha: 0 } },
    });
  }

  _handleEnter() {
    this.fireAncestors('$onButtonClick', { label: this.tag('Label').text.text });
  }
}
