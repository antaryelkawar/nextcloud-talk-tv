import { Component } from '@lightningjs/core';
import { authActions } from '../stores/authStore';
import { LoginApi } from '../api/loginApi';

export default class LoginView extends Component {
  private loginApi = new LoginApi();
  private serverInput: string = '';

  init() {
    this.setupUI();
  }

  setupUI() {
    this.width = 1920;
    this.height = 1080;
    this.println('Login View Initialized');
  }

  async handleServerSubmit(url: string) {
    this.serverInput = url;
    await this.loginApi.selectServer(url);
    this.println(`Server set to: ${url}`);
  }

  async handleGenerateQR() {
    try {
      const qrUrl = await this.loginApi.getQrCodeUrl();
      this.println(`QR Code URL: ${qrUrl}`);
      // In a real implementation, you would trigger QR code rendering here.
    } catch (err) {
      this.println(`Error generating QR: ${err}`);
    }
  }

  async handleStartPolling() {
    try {
      await this.loginApi.pollAuthenticationStatus();
      this.println('Authentication successful!');
    } catch (err) {
      this.println(`Polling error: ${err}`);
    }
  }
}
