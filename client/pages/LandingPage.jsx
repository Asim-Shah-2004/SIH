import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Network, Users } from 'lucide-react';

const AlumniConnectLanding = () => {
  const canvasRef = useRef(null);

  // Alumni network data
  const networkData = {
    totalAlumni: 15420,
    activeConnections: 7845,
    industries: [
      { name: 'Tech', value: 35 },
      { name: 'Finance', value: 25 },
      { name: 'Healthcare', value: 15 },
      { name: 'Other', value: 25 }
    ],
    careerProgressData: [
      { year: '2020', connections: 5200 },
      { year: '2021', connections: 6500 },
      { year: '2022', connections: 7200 },
      { year: '2023', connections: 7845 }
    ]
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, 300);

    // Create network-like particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ 
      size: 0.005, 
      color: 0x5271ff,
      transparent: true,
      opacity: 0.7
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 10;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-[300px] z-0 opacity-30"
        />
        <div className="relative z-10 container mx-auto px-4 pt-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Alumni Connect Network
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Bridge the gap between past and present. Connect, grow, and inspire.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Total Alumni</CardTitle>
                <Users className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {networkData.totalAlumni.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active professionals in our network
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Active Connections</CardTitle>
                <Network className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {networkData.activeConnections.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Meaningful professional links
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Career Sectors</CardTitle>
                <GraduationCap className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={networkData.industries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground text-center">
                  Distribution across industries
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Network Growth Over Years
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={networkData.careerProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="connections" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition">
              Join Our Network
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniConnectLanding;