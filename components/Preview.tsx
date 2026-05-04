import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationConfig, AnimationType } from '../types';
import { ICONS } from '../constants/assets';

interface PreviewProps {
  config: AnimationConfig;
  triggerKey: number; // Used to force re-render/replay
}

// --- Helper Functions & Components ---

const getVariants = (config: AnimationConfig) => {
  const duration = config.duration;
  const ease = config.easing === 'linear' ? 'linear' : 'easeInOut';

  switch (config.type) {
    case AnimationType.SLIDE_UP:
      return {
        hidden: { y: 100, opacity: 0 },
        visible: { 
          y: 0, 
          opacity: 1, 
          transition: { duration, ease, delay: config.delay } 
        }
      };
    case AnimationType.SCALE:
      return {
        hidden: { scale: 0.5, opacity: 0 },
        visible: { 
          scale: 1, 
          opacity: 1, 
          transition: { duration, ease, delay: config.delay } 
        }
      };
    case AnimationType.ELASTIC_POP:
      return {
        hidden: { scale: 0, opacity: 0 },
        visible: { 
          scale: 1, 
          opacity: 1, 
          transition: { 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: config.delay 
          } 
        }
      };
    case AnimationType.BLUR_REVEAL:
      return {
        hidden: { filter: 'blur(20px)', opacity: 0, scale: 1.1 },
        visible: { 
          filter: 'blur(0px)', 
          opacity: 1, 
          scale: 1,
          transition: { duration, ease, delay: config.delay } 
        }
      };
    case AnimationType.Glitch:
      return {
          hidden: { opacity: 0, x: -10 },
          visible: { 
              opacity: 1, 
              x: [0, -5, 5, -5, 0],
              transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1], delay: config.delay } 
          }
      };
    case AnimationType.FADE:
    default:
      return {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1, 
          transition: { duration, ease, delay: config.delay } 
        }
      };
  }
};

const TypewriterText: React.FC<{ config: AnimationConfig }> = ({ config }) => {
  // Memoize letters to prevent unnecessary re-mapping during style updates
  const letters = useMemo(() => Array.from(config.text), [config.text]);
  
  return (
    <h1 
      style={{ 
        fontSize: `${config.fontSize}px`, 
        letterSpacing: `${config.letterSpacing}px`,
        fontFamily: config.fontFamily || 'inherit'
      }}
      className="font-bold leading-tight"
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: config.delay + i * 0.05,
            ease: "linear"
          }}
        >
          {letter}
        </motion.span>
      ))}
    </h1>
  );
};

const SvgStrokeText: React.FC<{ config: AnimationConfig }> = ({ config }) => {
  return (
    <svg width="100%" height="250px" viewBox="0 0 800 250" className="overflow-visible">
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        initial={{ 
          strokeDasharray: 1000, 
          strokeDashoffset: 1000, 
          fillOpacity: 0,
          stroke: config.textColor,
          strokeWidth: 2
        }}
        animate={{ 
          strokeDashoffset: 0,
          fillOpacity: 1,
          transition: {
            strokeDashoffset: { duration: config.duration * 1.5, ease: "easeInOut", delay: config.delay },
            fillOpacity: { duration: 0.8, ease: "easeOut", delay: config.delay + config.duration }
          }
        }}
        // We apply style changes directly to the element to allow live-editing without restarting animation
        style={{ 
          fontSize: `${config.fontSize}px`, 
          letterSpacing: `${config.letterSpacing}px`,
          fontFamily: config.fontFamily || 'inherit',
          fontWeight: 'bold',
          fill: config.textColor,
          stroke: config.textColor // Ensure stroke color updates live
        }}
      >
        {config.text}
      </motion.text>
    </svg>
  );
};

const MorphAnimation: React.FC<{ config: AnimationConfig }> = ({ config }) => {
  const icon = ICONS.find(i => i.id === config.iconId) || ICONS[0];
  const targetIcon = ICONS.find(i => i.id === config.morphIconId) || ICONS[1];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-8">
        <svg 
          width={config.fontSize * 1.5} 
          height={config.fontSize * 1.5} 
          viewBox={icon.viewBox} 
          className="overflow-visible"
        >
          <motion.path
            d={icon.path}
            initial={{ d: icon.path, fill: config.textColor, opacity: 0 }}
            animate={{ 
              d: [icon.path, targetIcon.path, icon.path],
              fill: [config.textColor, config.accentColor, config.textColor],
              opacity: 1
            }}
            transition={{
              duration: config.duration * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: config.delay
            }}
          />
        </svg>
      </div>
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: config.delay + 0.5, duration: config.duration }}
        style={{ 
          fontSize: `${config.fontSize}px`, 
          letterSpacing: `${config.letterSpacing}px`,
          fontFamily: config.fontFamily || 'inherit',
          color: config.textColor
        }}
        className="font-bold leading-tight text-center"
      >
        {config.text}
      </motion.h1>
    </div>
  );
};

const MainText: React.FC<{ config: AnimationConfig }> = ({ config }) => {
  const variants = getVariants(config);
  
  return (
    <motion.h1
      variants={variants}
      initial="hidden"
      animate="visible"
      style={{ 
        fontSize: `${config.fontSize}px`, 
        letterSpacing: `${config.letterSpacing}px`,
        fontFamily: config.fontFamily || 'inherit'
      }}
      className="font-bold leading-tight text-center"
    >
      {config.text}
    </motion.h1>
  );
};

// --- Main Component ---

const Preview: React.FC<PreviewProps> = ({ config, triggerKey }) => {
  const [animationKey, setAnimationKey] = useState("");

  // Update animationKey only when Replay is clicked or the Animation Type changes.
  // This prevents the whole component from unmounting/remounting when simply changing CSS properties like color/size.
  useEffect(() => {
    setAnimationKey(`${triggerKey}-${config.type}`);
  }, [triggerKey, config.type]);

  const containerStyle: React.CSSProperties = {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
    fontFamily: config.fontFamily || 'inherit'
  };

  const renderContent = () => {
    switch (config.type) {
      case AnimationType.TYPEWRITER:
        return <TypewriterText config={config} />;
      case AnimationType.SVG_STROKE:
        return <SvgStrokeText config={config} />;
      case AnimationType.MORPH:
        return <MorphAnimation config={config} />;
      default:
        return <MainText config={config} />;
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-lg lg:rounded-2xl shadow-2xl relative"
      style={containerStyle}
    >
        <AnimatePresence mode="wait">
          <div key={animationKey} className="flex flex-col items-center justify-center z-10 px-4 md:px-8 w-full">
            {renderContent()}
            
            {config.subText && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: config.delay + (config.duration * 0.8), duration: 0.8 }}
                style={{ 
                  color: config.accentColor,
                  fontSize: 'clamp(0.875rem, 4vw, 1.5rem)' 
                }}
                className="mt-4 font-light text-center tracking-wide"
              >
                {config.subText}
              </motion.p>
            )}
          </div>
        </AnimatePresence>

        {/* Decorative background grid for visual depth */}
        <div className="absolute inset-0 opacity-[0.03] lg:opacity-[0.07] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(${config.accentColor} 1.5px, transparent 1.5px)`, 
               backgroundSize: '40px 40px' 
             }} 
        />
    </div>
  );
};

export default Preview;