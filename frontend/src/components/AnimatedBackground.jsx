import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="reactbits-bg" style={{ overflow: 'hidden' }}>
      {/* Aurora Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, var(--color-primary-dark) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.4,
        }}
      />
      
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--color-accent-rose) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.3,
        }}
      />
      
      {/* Premium Grain Overlay for texture */}
      <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          background: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
      }}></div>
    </div>
  );
};

export default AnimatedBackground;
