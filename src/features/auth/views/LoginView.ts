import { Component } from '@lightningjs/core';
import { LoginApi } from '../api/loginApi';
import TvButton from '../../../components/TvButton';
import TvInput from '../../../components/TvInput';
import { COLORS, TYPOGRAPHY } from '../../../core/constants';

export default class LoginView extends Component {
  private loginApi = new LoginApi();
  private _serverUrl: string = 'https://';
  private _index: number = 0;

  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xff121212,
      Logo: {
        x: 960,
        y: 200,
        mount: 0.5,
        w: 400,
        h: 200,
        text: {
          text: 'Nextcloud',
          fontSize: 80,
          fontFace: 'Inter',
          textColor: 0xffffffff,
        },
      },
      Form: {
        x: 960,
        y: 540,
        mount: 0.5,
        ServerInput: {
          type: TvInput,
          placeholder: 'Server URL (e.g. https://cloud.example.com)',
        },
        QRButton: {
          y: 120,
          type: TvButton,
          label: 'Generate Login QR Code',
        },
        PollingStatus: {
          y: 240,
          x: 400,
          mountX: 0.5,
          text: {
            text: '',
            fontSize: TYPOGRAPHY.BODY_SIZE,
            fontFace: 'Inter',
            textColor: COLORS.PRIMARY,
          },
        },
      },
      QRCodeArea: {
        x: 960,
        y: 800,
        mount: 0.5,
        visible: false,
        QRImage: {
          w: 300,
          h: 300,
          rect: true,
          color: 0xffffffff,
        },
      },
    };
  }

  get serverInput() {
    return this.tag('Form').tag('ServerInput') as TvInput;
  }

  get qrButton() {
    return this.tag('Form').tag('QRButton') as TvButton;
  }

  _getFocused() {
    return this._index === 0 ? this.serverInput : this.qrButton;
  }

  _handleDown() {
    this._index = 1;
  }

  _handleUp() {
    this._index = 0;
  }

  async $onButtonClick({ label }: { label: string }) {
    if (label === 'Generate Login QR Code') {
      await this.handleGenerateQR();
    }
  }

  async handleGenerateQR() {
    try {
      const url = this.serverInput.tag('Label').text.text || this._serverUrl;
      await this.loginApi.selectServer(url);
      
      const qrDataUrl = await this.loginApi.getQrCodeUrl();
      this.tag('QRCodeArea').patch({
        visible: true,
        QRImage: { src: qrDataUrl },
      });
      
      this.tag('Form').tag('PollingStatus').text.text = 'Waiting for authentication...';
      this.startPolling();
    } catch (err) {
      this.tag('Form').tag('PollingStatus').text.text = `Error: ${err}`;
    }
  }

  async startPolling() {
    try {
      await this.loginApi.pollAuthenticationStatus();
    } catch (err) {
      this.tag('Form').tag('PollingStatus').text.text = `Polling failed: ${err}`;
    }
  }
}
