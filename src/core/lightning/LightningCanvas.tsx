import { onMount } from 'solid-js';
import App from './App';
import { LightningBridge } from '../../bridge/lightningBridge';

interface LightningCanvasProps {
  lightningBridge: LightningBridge;
}

export default function LightningCanvas(props: LightningCanvasProps) {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (canvasRef) {
      const app = new App(props.lightningBridge);
      // @ts-ignore
      app.canvas = canvasRef;
      // @ts-ignore
      app.init();
    }
  });

  return <canvas ref={canvasRef} width={1920} height={1080} style={{ width: '100%', height: '100%' }} />;
}


export default function LightningCanvas(_props: LightningCanvasProps) {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (canvasRef) {
      const app = new App({} as any);
      // @ts-ignore
      app.canvas = canvasRef;
      // @ts-ignore
      app.init();
    }
  });

  return <canvas ref={canvasRef} width={1920} height={1080} style={{ width: '100%', height: '100%' }} />;
}
