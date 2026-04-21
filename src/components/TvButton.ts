import { Component } from '@lightningjs/core';
import { COLORS } from '../core/constants';

export default class TvButton extends Component {
  isFocused: boolean = false;

  constructor(config: any) {
    super(config);
  }

  onFocus() {
    this.isFocused = true;
    this.scale = 1.05;
    this.stroke = COLORS.PRIMARY;
    this.strokeWidth = 2;
  }

  onBlur() {
    this.isFocused = false;
    this.scale = 1.0;
    this.stroke = 0;
  }

  setLabel(label: string) {
    console.log(`Button Label: ${label}`);
  }
}
