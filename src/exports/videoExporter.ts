/**
 * Video Exporter
 * 
 * Records the WebGL canvas output as a WebM video using
 * the MediaRecorder API and Canvas Capture Stream.
 */

export class VideoExporter {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private isRecording = false;

  /** Start recording the canvas */
  start(canvas: HTMLCanvasElement, fps: number = 30): void {
    if (this.isRecording) return;

    const stream = canvas.captureStream(fps);

    // Find a supported mime type
    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    let mimeType = '';
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }

    if (!mimeType) {
      console.error('[VideoExporter] No supported video format found');
      return;
    }

    this.chunks = [];
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5_000_000, // 5 Mbps
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shader-pattern-${Date.now()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.chunks = [];
    };

    this.mediaRecorder.start(100); // Capture in 100ms chunks
    this.isRecording = true;
  }

  /** Stop recording and trigger download */
  stop(): void {
    if (!this.isRecording || !this.mediaRecorder) return;
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

  /** Check if currently recording */
  getIsRecording(): boolean {
    return this.isRecording;
  }
}

/** Singleton instance */
export const videoExporter = new VideoExporter();
