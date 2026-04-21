import { createEffect } from 'solid-js';
import { appStore } from '../stores/appStore';
import type App from '../lightning/App';

export function setupBridge(lightningApp: App) {
  createEffect(() => {
    // When isCallActive changes, call a method on the lightning app
    if (appStore.isCallActive) {
      lightningApp.onCallStarted();
    } else {
      lightningApp.onCallEnded();
    }
  });

  createEffect(() => {
    // When participantCount changes
    lightningApp.updateParticipantCount(appStore.participantCount);
  });
}

// We'll extend the App class to include these methods
// but for now, let's just define them in a way that TypeScript doesn't complain
// Or better, I'll update the App.ts file.
