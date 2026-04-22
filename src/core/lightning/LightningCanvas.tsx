import { onMount, onCleanup } from 'solid-js';
import App from './App';
import type { LightningBridge } from '../../bridge/lightningBridge';

interface LightningCanvasProps {
  lightningBridge: LightningBridge;
}

export default function LightningCanvas(props: LightningCanvasProps) {
  let canvasRef: HTMLCanvasElement | undefined;
  let app: App | undefined;

  onMount(() => {
    if (canvasRef) {
      const options = {
        canvas: canvasRef,
        width: 1920,
        height: 1080,
        lightningBridge: props.lightningBridge,
      };

      // @ts-ignore
      app = new App(options);
    }
  });

  onCleanup(() => {
    if (app) {
      // Lightning handles cleanup internally when the stage is destroyed
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#000'
      }}
    />
  );
}
