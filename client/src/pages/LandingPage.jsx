import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 200 : 500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * (window.innerWidth < 768 ? 15 : 30);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x5271ff,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/90 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <div className={`text-3xl font-bold text-${color}-600 mb-2`}>
        {value}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <canvas ref={canvasRef} className="fixed inset-0" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Alumni Connect Network
          </h1>
          <p className="text-xl text-gray-600">
            Bridge the gap between past and present. Connect, grow, and inspire.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Alumni"
            value={networkData.totalAlumni.toLocaleString()}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active Connections"
            value={networkData.activeConnections.toLocaleString()}
            icon={Network}
            color="green"
          />
          <div className="bg-white/90 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Career Sectors</h3>
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={networkData.industries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/90 rounded-xl p-6 shadow-md mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            Network Growth Over Years
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={networkData.careerProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="connections" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <button className="block mx-auto px-8 py-3 bg-blue-600 text-white rounded-full 
          text-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all">
          Join Our Network
        </button>
      </div>
    </main>
  );
};

export default AlumniConnectLanding;