export class VideoOverlayManager {
  private container: HTMLDivElement | null = null;
  private videos: Map<string, HTMLVideoElement> = new Map();

  constructor() {
    this.ensureContainer();
  }

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'video-overlay-container';
      document.body.appendChild(this.container);
    }
  }

  addVideo(participantId: string, stream: MediaStream) {
    this.ensureContainer();
    const video = document.createElement('video');
    video.id = `video-${participantId}`;
    video.className = 'remote-video';
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    
    this.container!.appendChild(video);
    this.videos.set(participantId, video);
    return video;
  }

  updateVideoPosition(participantId: string, x: number, y: number, width: number, height: number) {
    const video = this.videos.get(participantId);
    if (video) {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      
      video.style.left = `${Math.floor(x * scaleX)}px`;
      video.style.top = `${Math.floor(y * scaleY)}px`;
      video.style.width = `${Math.floor(width * scaleX)}px`;
      video.style.height = `${Math.floor(height * scaleY)}px`;
    }
  }

  removeVideo(participantId: string) {
    const video = this.videos.get(participantId);
    if (video && this.container) {
      video.srcObject = null;
      this.container.removeChild(video);
      this.videos.delete(participantId);
    }
  }

  clear() {
    this.videos.forEach((_, id) => this.removeVideo(id));
  }

  destroy() {
    this.clear();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }
}

export const videoOverlayManager = new VideoOverlayManager();
