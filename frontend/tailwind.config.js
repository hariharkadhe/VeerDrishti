export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: 'rgba(24, 24, 27, 0.6)',
        'surface-highlight': 'rgba(255, 255, 255, 0.05)',
        primary: '#3b82f6',
        'primary-glow': 'rgba(59, 130, 246, 0.5)',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        '3d': '0 10px 30px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        '3d-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        'neon-primary': '0 0 15px rgba(59, 130, 246, 0.5)',
        'neon-danger': '0 0 15px rgba(239, 68, 68, 0.5)',
        'neon-success': '0 0 15px rgba(16, 185, 129, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh': 'radial-gradient(at 40% 20%, hsla(220,100%,74%,0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0px, transparent 50%)'
      }
    },
  },
  plugins: [],
}
