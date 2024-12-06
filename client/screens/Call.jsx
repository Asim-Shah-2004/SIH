import { SERVER_URL } from '@env';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import io from 'socket.io-client';

const VideoCallScreen = ({ route, navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [remoteFrame, setRemoteFrame] = useState(null);
  const socket = useRef(null);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameInterval = useRef(null);
  const [facing] = useState('front');

  const { chatData, roomId } = route.params;

  useEffect(() => {
    socket.current = io(SERVER_URL);
    socket.current.on('videoFrame', (data) => setRemoteFrame(data.frame));
    socket.current.emit('joinRoom', roomId);

    if (Platform.OS === 'web') {
      initWebCamera();
    }

    startCapturingFrames();

    return () => {
      stopCapturingFrames();
      socket.current?.disconnect();
    };
  }, []);

  const initWebCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const captureAndSendFrame = async () => {
    if (!isCameraOn) return;

    try {
      if (Platform.OS === 'web') {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
        socket.current?.emit('videoFrame', { roomId, frame });
      } else {
        if (!cameraRef.current) return;

        try {
          const photo = await cameraRef.current.takePictureAsync({
            base64: true,
            skipProcessing: true,
            shutterSound: false,
          });

          if (!photo?.base64) {
            console.warn('Camera capture returned empty data');
            return;
          }

          socket.current?.emit('videoFrame', { roomId, frame: photo.base64 });
        } catch (captureError) {
          console.warn('Frame capture failed, retrying...', captureError);
          // Wait briefly before next capture attempt
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Frame capture error:', error);
    }
  };

  const startCapturingFrames = () => {
    stopCapturingFrames(); // Clear any existing interval
    frameInterval.current = setInterval(captureAndSendFrame, 500); // Increased interval for stability
  };

  const stopCapturingFrames = () => {
    if (frameInterval.current) {
      clearInterval(frameInterval.current);
      frameInterval.current = null;
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center">Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission} className="rounded-full bg-primary px-6 py-3">
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      {/* Remote Video */}
      <View className="flex-1 items-center justify-center">
        {remoteFrame ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${remoteFrame}` }}
            className="h-full w-full"
          />
        ) : (
          <View className="items-center justify-center">
            <MaterialIcons name="person-outline" size={64} color="#666" />
            <Text className="text-gray-500">Waiting for other user...</Text>
          </View>
        )}
      </View>

      {/* Local Video */}
      <View className="w-30 absolute right-5 top-24 h-44 overflow-hidden rounded-xl border-2 border-white">
        {Platform.OS === 'web' ? (
          <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
        ) : (
          <CameraView
            ref={cameraRef}
            className="h-full w-full"
            facing={facing}
            active={isCameraOn}
          />
        )}
      </View>

      {Platform.OS === 'web' && <canvas ref={canvasRef} style={{ display: 'none' }} />}

      {/* Controls */}
      <View className="absolute bottom-10 w-full flex-row justify-center space-x-5">
        <TouchableOpacity
          className={`w-15 h-15 items-center justify-center rounded-full ${
            isCameraOn ? 'bg-green-500' : 'bg-red-500'
          }`}
          onPress={toggleCamera}>
          <Ionicons name={isCameraOn ? 'videocam' : 'videocam-off'} size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-15 h-15 items-center justify-center rounded-full bg-red-500"
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="call-end" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoCallScreen;
