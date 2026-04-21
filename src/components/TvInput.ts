import { Element } from '@lightningjs/core';
import { COLORS } from '../core/constants';

export default class TvInput extends Element {
  isActive: boolean = false;

  constructor(config: any) {
    super(config);
  }

  onFocus() {
    this.isActive = true;
    this.stroke = COLORS.PRIMARY;
    this.strokeWidth = 2;
  }

  onBlur() {
    this.isActive = false;
    this.stroke = 0;
  }

  setInput(value: string) {
    console.log(`Input Value: ${value}`);
  }
}
