import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext';

// Animated Background Component
const AnimatedBackground = () => {
  // Create particles for the background
  const particles = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.1,
    duration: 20 + Math.random() * 40,
    delay: Math.random() * 10,
    color: `hsl(${Math.floor(Math.random() * 60) + 200}, 80%, 60%)`
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, #0f172a, #1e293b, #334155)',
            'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
            'linear-gradient(225deg, #0f172a, #1e293b, #334155)',
            'linear-gradient(315deg, #0f172a, #1e293b, #334155)'
          ]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px ${particle.color}`
          }}
          animate={{
            x: [
              `${particle.x}%`,
              `${particle.x + (Math.random() * 20 - 10)}%`,
              `${particle.x + (Math.random() * 20 - 10)}%`,
              `${particle.x}%`
            ],
            y: [
              `${particle.y}%`,
              `${particle.y + (Math.random() * 20 - 10)}%`,
              `${particle.y + (Math.random() * 20 - 10)}%`,
              `${particle.y}%`
            ],
            scale: [1, 1.5, 1.2, 1],
            opacity: [
              particle.opacity,
              particle.opacity * 1.5,
              particle.opacity * 1.2,
              particle.opacity
            ]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
            times: [0, 0.3, 0.7, 1]
          }}
        />
      ))}

      {/* Animated Grid */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 70%)'
        }}
      />

      {/* Pulsing Light */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(56, 189, 248, 0.2) 0%, transparent 70%)'
        }}
      />

      {/* Moving Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          background: 'linear-gradient(45deg, rgba(56, 189, 248, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
          backgroundSize: '200% 200%'
        }}
      />
    </div>
  );
};

function Login() {
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === null ? true : saved === 'true';
  });
  
  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect to the intended page or dashboard
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="h-screen w-full fixed inset-0 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white/20 transition-colors duration-200 shadow-lg"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Login Form */}
      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 space-y-6 mx-auto overflow-hidden">
          {/* 3D Animated Logo */}
          <motion.div 
            className="relative w-32 h-32 mx-auto mb-4"
            animate={{
              y: [0, -10, 0],
              rotateY: [0, 360],
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotateY: {
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg" />
            <div className="absolute inset-1 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <div className="text-white text-4xl font-bold">AMC</div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-70 blur-md" />
          </motion.div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Sign in to your account</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
              </div>
              
              <div>
                <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <span className="sr-only">Sign in with GitHub</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.193 20 14.44 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Light Orbs */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute w-[300px] h-[300px] rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-[100px]"
          style={{
            left: '20%',
            top: '30%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 dark:bg-purple-400/10 blur-[120px]"
          style={{
            right: '15%',
            bottom: '20%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>
    </div>
  );
}

export default Login;
