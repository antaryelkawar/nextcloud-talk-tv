import { Component } from '@lightningjs/core';
import { TYPOGRAPHY } from '../core/constants';

export default class TvListItem extends Component {
  static _template() {
    return {
      rect: true,
      w: 1800,
      h: 120,
      color: 0xff1e1e1e, // Surface color
      shader: { type: 'RoundedRectangle', radius: 8 } as any,
      Avatar: {
        x: 60,
        y: 60,
        mount: 0.5,
        w: 80,
        h: 80,
        rect: true,
        shader: { type: 'RoundedRectangle', radius: 40 } as any,
        color: 0xff333333,
      },
      Label: {
        x: 160,
        y: 60,
        mountY: 0.5,
        text: {
          text: '',
          fontSize: TYPOGRAPHY.BODY_SIZE,
          fontFace: 'Inter',
          textColor: 0xffffffff,
        },
      },
      SubLabel: {
        x: 160,
        y: 85,
        mountY: 0.5,
        text: {
          text: '',
          fontSize: TYPOGRAPHY.BODY_SIZE - 4,
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

  set label(v: string) {
    this.tag('Label').text.text = v;
  }

  set subLabel(v: string) {
    this.tag('SubLabel').text.text = v;
  }

  _focus() {
    this.patch({
      smooth: { scale: 1.02, x: 20 },
      FocusBorder: { smooth: { alpha: 1 } },
    });
  }

  _unfocus() {
    this.patch({
      smooth: { scale: 1.0, x: 0 },
      FocusBorder: { smooth: { alpha: 0 } },
    });
  }

  _handleEnter() {
    this.fireAncestors('$onItemClick', { label: this.tag('Label').text.text });
  }
}
