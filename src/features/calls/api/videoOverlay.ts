export class VideoOverlayManager {
  private container: HTMLDivElement;
  private videos: Map<string, HTMLVideoElement> = new Map();

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'video-overlay-container';
    this.container.style.position = 'absolute';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.pointerEvents = 'none';
    this.container.style.zIndex = '10';
    document.body.appendChild(this.container);
  }

  addVideo(participantId: string, stream: MediaStream) {
    const video = document.createElement('video');
    video.id = `video-${participantId}`;
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.style.position = 'absolute';
    
    this.container.appendChild(video);
    this.videos.set(participantId, video);
    return video;
  }

  updateVideoPosition(participantId: string, x: number, y: number, width: number, height: number) {
    const video = this.videos.get(participantId);
    if (video) {
      // Convert LightningJS coords (1920x1080) to CSS pixels (relative to window)
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      
      video.style.left = `${x * scaleX}px`;
      video.style.top = `${y * scaleY}px`;
      video.style.width = `${width * scaleX}px`;
      video.style.height = `${height * scaleY}px`;
    }
  }

  removeVideo(participantId: string) {
    const video = this.videos.get(participantId);
    if (video) {
      video.srcObject = null;
      this.container.removeChild(video);
      this.videos.delete(participantId);
    }
  }

  clear() {
    this.videos.forEach((video, id) => this.removeVideo(id));
  }
}

export const videoOverlayManager = new VideoOverlayManager();
