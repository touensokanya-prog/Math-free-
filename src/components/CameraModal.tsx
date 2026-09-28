import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhoto(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Cannot access camera. Please allow camera permissions in your browser.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2 font-medium text-sm">
            <Camera className="w-4 h-4 text-sky-400" />
            <span>ថតរូបឯកសារគណិតវិទ្យា (Capture Math Exam / Notebook)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-rose-400 text-xs flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8" />
              <p>{cameraError}</p>
            </div>
          ) : capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Captured Math"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Guide Overlay */}
          {!capturedPhoto && !cameraError && (
            <div className="absolute inset-8 border-2 border-dashed border-sky-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <span className="text-[10px] text-sky-300 bg-sky-950/70 px-2 py-0.5 rounded self-start">
                តម្រង់រូបមន្ត ឬក្រាបក្នុងប្រអប់
              </span>
              <span className="text-[10px] text-sky-300 bg-sky-950/70 px-2 py-0.5 rounded self-end">
                Hold still for sharp OCR
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {!capturedPhoto ? (
            <>
              <button
                onClick={toggleFacingMode}
                title="Switch Camera"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ប្តូរកាមេរ៉ា</span>
              </button>

              <button
                onClick={handleSnap}
                disabled={Boolean(cameraError)}
                className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
              >
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span>ថតរូប (Snap)</span>
              </button>

              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                បោះបង់
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ថតម្តងទៀត (Retake)</span>
              </button>

              <button
                onClick={handleConfirm}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>ប្រើរូបនេះ (Use Photo)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
