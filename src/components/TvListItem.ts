import { Component } from '@lightningjs/core';
import { COLORS } from '../core/constants';

export default class TvListItem extends Component {
  isFocused: boolean = false;
  label: string = '';

  constructor(config: any) {
    super(config);
    this.fill = COLORS.SURFACE;
  }

  onFocus() {
    this.isFocused = true;
    this.scale = 1.05;
  }

  onBlur() {
    this.isFocused = false;
    this.scale = 1.0;
  }

  setLabel(label: string) {
    this.label = label;
    // In a real implementation, you would update a text component here.
    console.log(`ListItem Label: ${label}`);
  }
}
