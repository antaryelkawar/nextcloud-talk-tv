import { Component } from '@lightningjs/core';
import { TYPOGRAPHY } from '../core/constants';

export default class TvInput extends Component {
  static _template() {
    return {
      rect: true,
      w: 800,
      h: 80,
      color: 0xff1e1e1e,
      shader: { type: 'RoundedRectangle', radius: 8 } as any,
      Label: {
        x: 20,
        y: 40,
        mountY: 0.5,
        text: {
          text: '',
          fontSize: TYPOGRAPHY.BODY_SIZE,
          fontFace: 'Inter',
          textColor: 0xffffffff,
        },
      },
      Placeholder: {
        x: 20,
        y: 40,
        mountY: 0.5,
        text: {
          text: '',
          fontSize: TYPOGRAPHY.BODY_SIZE,
          fontFace: 'Inter',
          textColor: 0xffb0b0b0,
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

  set value(v: string) {
    this.tag('Label').text.text = v;
    this.tag('Placeholder').visible = v.length === 0;
  }

  set placeholder(v: string) {
    this.tag('Placeholder').text.text = v;
  }

  _focus() {
    this.patch({
      FocusBorder: { smooth: { alpha: 1 } },
    });
  }

  _unfocus() {
    this.patch({
      FocusBorder: { smooth: { alpha: 0 } },
    });
  }
}
