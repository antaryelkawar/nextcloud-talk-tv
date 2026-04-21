# Video Rendering Strategy Decision

## Introduction
This document evaluates two strategies for rendering WebRTC video streams within a LightningJS-based TV application: **DOM Overlay** and **Canvas `drawImage`**. The goal is to select the most performant and reliable method for low-power TV environments (e.g., Tizen, WebOS) where hardware resources are limited and latency is critical.

## Comparison Table

| Metric | DOM Overlay (`<video>`) | Canvas `drawImage` |
| :--- | :--- | :--- |
| **CPU/GPU Usage** | Low (Hardware Accelerated) | High (CPU/GPU intensive) |
| **Latency** | Minimal (Native) | Higher (JS/Main thread overhead) |
| **Integration** | Moderate (Requires CSS/Z-index) | Seamless (Part of Canvas) |
| **TV Compatibility** | High (Native support) | Variable (Performance issues common) |
| **Complexity** | Low | Moderate |

## Pros and Cons

### DOM Overlay
**Pros:**
- **Hardware Acceleration:** Leverages the browser's compositor and native hardware decoders, minimizing impact on the main thread.
- **Low Latency:** Provides the lowest possible latency by bypassing the JavaScript execution loop for frame rendering.
- **Resource Efficiency:** Significantly lower CPU and GPU overhead, which is critical for low-power TV hardware.
- **Reliability:** Uses standard web video implementation, which is highly optimized in Tizen and WebOS browsers.

**Cons:**
- **Integration Complexity:** Requires managing the video element's position and z-index relative to the LightningJS canvas.
- **Visual Effects:** It is difficult to apply complex canvas-based shaders or pixel-level manipulations to the video content.

### Canvas `drawImage`
**Pros:**
- **Seamless Integration:** The video stream is treated as just another texture within the LightningJS canvas, making it easy to layer UI elements.
- **Visual Flexibility:** Allows for easy application of custom shaders, filters, and post-processing effects directly on the video frames.

**Cons:**
- **Performance Bottleneck:** Copying video frames into the canvas context every frame is extremely expensive for low-power CPUs/GPUs.
- **Increased Latency:** Each frame must pass through the JavaScript main thread, introducing potential lag and jitter.
- **Risk of Frame Drops:** High probability of dropping frames and causing UI stuttering on lower-end TV models.

## Final Recommendation

**DOM Overlay is the recommended strategy.**

In a TV application, especially one using WebRTC for real-time communication, minimizing latency and maximizing performance on constrained hardware is the highest priority. The DOM Overlay approach utilizes the system's optimized video pipeline, ensuring smooth video playback with minimal impact on the application's responsiveness. While integration with LightningJS requires slightly more effort in terms of DOM management, the performance gains are indispensable for a stable user experience on Tizen and WebOS.

## Implementation Plan

1.  **Video Element Setup:** Create a single, persistent `<video>` element in the application's root DOM structure.
2.  **WebRTC Stream Attachment:** Assign the WebRTC `MediaStream` directly to the `srcObject` of the `<video>` element.
3.  **LightningJS Synchronization:**
    - Create a "Video Placeholder" in LightningJS to define the layout area.
    - Use the placeholder's `x`, `y`, `width`, and `height` properties to update the `<video>` element's CSS (`position: absolute`, `top`, `left`, `width`, `height`) via a specialized LightningJS plugin or utility.
4.  **Layering Logic:** Implement a system to manage the `z-index` of the `<video>` element so that UI overlays (e.g., menus, controls) can be rendered on top of the video when necessary.
5.  **Performance Validation:** Test the implementation on actual Tizen and WebOS hardware, measuring:
    - Video frame rate (FPS).
    - End-to-end latency (input to video display).
    - CPU/Memory utilization during active video sessions.
