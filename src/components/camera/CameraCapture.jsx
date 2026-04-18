import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, X } from "lucide-react";

export default function CameraCapture({ onCapture, onCancel, label = "Take Photo" }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const startCamera = async () => {
            setIsLoading(true);
            try {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode },
                    audio: false
                });
                streamRef.current = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Camera error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(imageData);
        }
    };

    const confirmPhoto = () => {
        if (capturedImage) {
            onCapture(capturedImage);
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    return (
        <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden">
            {!capturedImage ? (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white/70 text-sm text-center mb-4">{label}</p>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onCancel}
                                className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                            <Button
                                onClick={capturePhoto}
                                className="h-20 w-20 rounded-full bg-white hover:bg-white/90 text-slate-900"
                            >
                                <Camera className="h-8 w-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={switchCamera}
                                className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <RotateCcw className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center justify-center gap-6">
                            <Button
                                onClick={retakePhoto}
                                variant="ghost"
                                className="h-14 px-6 rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <RotateCcw className="h-5 w-5 mr-2" />
                                Retake
                            </Button>
                            <Button
                                onClick={confirmPhoto}
                                className="h-14 px-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                <Check className="h-5 w-5 mr-2" />
                                Use Photo
                            </Button>
                        </div>
                    </div>
                </>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}