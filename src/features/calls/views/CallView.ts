import { Component } from '@lightningjs/core';
import { callStore, callActions } from '../stores/callStore';
import { videoOverlayManager } from '../api/videoOverlay';
import TvButton from '../../../components/TvButton';

export default class CallView extends Component {
  private buttons: any[] = [];
  private focusedButtonIndex: number = 0;

  init() {
    this.setupUI();
    this.setupControls();
    this.updateVideoPlaceholders();
    
    // Periodically sync video positions (or do it on resize)
    setInterval(() => this.updateVideoPlaceholders(), 1000);
  }

  setupUI() {
    this.width = 1920;
    this.height = 1080;
    this.backgroundColor = 0x000000;
  }

  setupControls() {
    const btnConfig = [
      { label: 'Mute', x: 800, y: 900, color: 0x333333 },
      { label: 'Camera', x: 1000, y: 900, color: 0x333333 },
      { label: 'End Call', x: 1200, y: 900, color: 0xff0000 },
    ];

    this.buttons = btnConfig.map(cfg => {
      return new TvButton({
        x: cfg.x,
        y: cfg.y,
        width: 200,
        height: 100,
        color: cfg.color,
        text: cfg.label
      });
    });
  }

  updateVideoPlaceholders() {
    const participants = callStore.participants;
    const cols = 2;
    const w = 1920 / cols;
    const h = 1080 / 2;

    participants.forEach((p, index) => {
      const x = (index % cols) * w;
      const y = Math.floor(index / cols) * h;
      
      videoOverlayManager.updateVideoPosition(p.id, x, y, w, h);
    });
  }

  handleKeyDown(key: string) {
    if (key === 'Left') {
      this.focusedButtonIndex = Math.max(0, this.focusedButtonIndex - 1);
    } else if (key === 'Right') {
      this.focusedButtonIndex = Math.min(this.buttons.length - 1, this.focusedButtonIndex + 1);
    } else if (key === 'Enter') {
      this.handleButtonClick(this.focusedButtonIndex);
    } else if (key === 'Escape') {
      this.endCall();
    }
    this.updateButtonFocus();
  }

  handleButtonClick(index: number) {
    switch (index) {
      case 0: // Mute
        console.log('Mute toggled');
        break;
      case 1: // Camera
        console.log('Camera toggled');
        break;
      case 2: // End Call
        this.endCall();
        break;
    }
  }

  endCall() {
    callActions.setStatus('ended');
    videoOverlayManager.clear();
    this.println('Call ended');
  }

  updateButtonFocus() {
    this.buttons.forEach((btn, index) => {
      if (index === this.focusedButtonIndex) {
        btn.onFocus();
      } else {
        btn.onBlur();
      }
    });
  }
}
