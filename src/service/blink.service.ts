import { ElementRef, EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlinkService {
  private fixedEyeHeight!: number;
  private blinkRegistered = false;

  public blinkDetected = new EventEmitter<void>();
  private faceMesh: any;
  private camera: any;

  constructor() {}

  public registerEyeHeight(currentEyeHeight: number): void {
    if (!this.fixedEyeHeight) {
      this.fixedEyeHeight = currentEyeHeight / 4;
      console.log('Altura registrada do olho:', this.fixedEyeHeight);
    }
  }

  public detectBlink(currentEyeHeight: number): boolean {
    if (currentEyeHeight < this.fixedEyeHeight && !this.blinkRegistered) {
      this.blinkRegistered = true;
      this.blinkDetected.emit();
      return true;
    }

    if (currentEyeHeight >= this.fixedEyeHeight && this.blinkRegistered) {
      this.blinkRegistered = false;
    }

    return false;
  }

  public async initializeFaceMesh(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    const FaceMesh = (window as any).FaceMesh;

    if (!FaceMesh) {
      console.error("FaceMesh não está disponível. Verifique o carregamento do script.");
      return;
    }

    this.faceMesh = new FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.faceMesh.onResults((results: any) => this.onResults(results, canvasElement));

    await this.setupCamera(videoElement, canvasElement);
    this.camera.start();
  }

  private async setupCamera(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;

    console.log("Câmera configurada e iniciada.");

    canvasElement.style.width = '80%';
    canvasElement.style.height = '90%';
    canvasElement.style.objectFit = 'cover';

    this.camera = new (window as any).Camera(videoElement, {
      onFrame: async () => {
        await this.faceMesh.send({ image: videoElement });
      }
    });
  }

  private onResults(results: any, canvasElement: HTMLCanvasElement): void {
    if (!canvasElement) {
      return;
    }

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) {
      console.error("Não foi possível obter o contexto 2D do canvas.");
      return; // Saia se não for possível obter o contexto
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Inverte a imagem horizontalmente
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);
    
    // Desenha a imagem invertida
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        this.processEye(landmarks, canvasElement.height);

        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];

        canvasCtx.beginPath();
        canvasCtx.moveTo(leftEyeTop.x * canvasElement.width, leftEyeTop.y * canvasElement.height);
        canvasCtx.lineTo(leftEyeBottom.x * canvasElement.width, leftEyeBottom.y * canvasElement.height);
        canvasCtx.strokeStyle = 'red';
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
      }
    }

    canvasCtx.restore();
  }

  public stopCamera(videoElement: HTMLVideoElement): void {
    if (this.camera) {
        this.camera.stop();
        console.log("Câmera desligada.");
    }

    if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const tracks = stream.getTracks();

        tracks.forEach(track => track.stop()); // Para cada faixa de mídia
        videoElement.srcObject = null; // Limpa o objeto do vídeo
        console.log("Fluxo de vídeo interrompido e elemento de vídeo limpo.");
    }
  }


  public processEye(landmarks: any[], canvasHeight: number): void {
    const leftEyeTop = landmarks[159];
    const leftEyeBottom = landmarks[145];

    const leftEyeTopY = leftEyeTop.y * canvasHeight;
    const leftEyeBottomY = leftEyeBottom.y * canvasHeight;
    const currentEyeHeight = leftEyeBottomY - leftEyeTopY;

    this.registerEyeHeight(currentEyeHeight);
    this.detectBlink(currentEyeHeight);
  }
}
