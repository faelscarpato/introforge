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
    <div 
      className="flex flex-col items-center justify-center break-words"
      style={{ 
        fontSize: `clamp(18px, ${config.fontSize}px, 10vw)`, 
        letterSpacing: `${config.letterSpacing}px`,
        fontFamily: config.fontFamily || 'inherit'
      }}
    >
      <div className="flex flex-wrap justify-center">
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
      </div>
    </div>
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
          fillOpacity: 0
        }}
        animate={{ 
          strokeDashoffset: 0,
          fillOpacity: 1
        }}
        transition={{ 
          duration: config.duration, 
          delay: config.delay,
          ease: "easeInOut"
        }}
        style={{ 
          fontSize: `${config.fontSize}px`, 
          letterSpacing: `${config.letterSpacing}px`,
          fontFamily: config.fontFamily || 'inherit',
          fontWeight: 'bold',
          fill: config.textColor,
          stroke: config.textColor,
          strokeWidth: config.strokeWidth || 1
        }}
      >
        {config.text}
      </motion.text>
    </svg>
  );
};

const TextStrokeAnimation: React.FC<{ config: AnimationConfig }> = ({ config }) => {
  return (
    <svg width="100%" height="250px" viewBox="0 0 800 250" className="overflow-visible">
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        initial={{ fill: "transparent", strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ 
          fill: config.textColor,
          strokeDashoffset: 0,
        }}
        transition={{ 
          duration: config.duration, 
          delay: config.delay,
          ease: "easeInOut",
          fill: { delay: config.delay + config.duration * 0.8, duration: 0.5 }
        }}
        style={{ 
          fontSize: `${config.fontSize}px`, 
          letterSpacing: `${config.letterSpacing}px`,
          fontFamily: config.fontFamily || 'inherit',
          fontWeight: 'bold',
          stroke: config.accentColor,
          strokeWidth: config.strokeWidth || 2
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
  
  const iconSize = config.fontSize * 1.5;
  const isHorizontal = config.iconPosition === 'left' || config.iconPosition === 'right';

  const iconElement = (
    <div className="flex items-center justify-center">
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox={icon.viewBox} 
        className="overflow-visible"
      >
        <motion.path
          d={icon.path}
          initial={{ d: icon.path, fill: config.iconColor || config.textColor, opacity: 0 }}
          animate={{ 
            d: [icon.path, targetIcon.path, icon.path],
            fill: [config.iconColor || config.textColor, config.accentColor, config.iconColor || config.textColor],
            opacity: 1
          }}
          transition={{
            duration: config.duration * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: config.delay
          }}
          stroke={config.accentColor}
          strokeWidth={config.strokeWidth ? config.strokeWidth * 0.5 : 0}
        />
      </svg>
    </div>
  );

  return (
    <div 
      className={`flex items-center justify-center ${isHorizontal ? 'flex-row' : 'flex-col'}`}
      style={{ gap: `${config.itemSpacing || 20}px` }}
    >
      {(config.iconPosition === 'top' || config.iconPosition === 'left') && iconElement}
      
      <div className="flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: config.delay + 0.5, duration: config.duration }}
          style={{ 
            fontSize: `clamp(20px, ${config.fontSize}px, 12vw)`, 
            letterSpacing: `${config.letterSpacing}px`,
            fontFamily: config.fontFamily || 'inherit',
            color: config.textColor
          }}
          className="font-bold leading-tight text-center break-words max-w-full"
        >
          {config.text}
        </motion.h1>
      </div>

      {(config.iconPosition === 'bottom' || config.iconPosition === 'right') && iconElement}
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
        fontSize: `clamp(20px, ${config.fontSize}px, 12vw)`, 
        letterSpacing: `${config.letterSpacing}px`,
        fontFamily: config.fontFamily || 'inherit'
      }}
      className="font-bold leading-tight text-center break-words max-w-full"
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
      case AnimationType.TEXT_STROKE:
        return <TextStrokeAnimation config={config} />;
      default:
        return <MainText config={config} />;
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative shadow-inner"
      style={containerStyle}
    >
        <AnimatePresence mode="wait">
          <div key={animationKey} className="flex flex-col items-center justify-center z-10 px-4 md:px-12 w-full max-w-[1200px]">
            {renderContent()}
            
            {config.subText && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: config.delay + (config.duration * 0.8), duration: 0.8 }}
                style={{ 
                  color: config.accentColor,
                  fontSize: 'clamp(1rem, 5vw, 2rem)' 
                }}
                className="mt-6 font-light text-center tracking-wide"
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