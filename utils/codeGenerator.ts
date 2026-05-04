import { AnimationConfig, AnimationType, ExportFormat } from '../types';

export const generateCode = (config: AnimationConfig, format: ExportFormat): string => {
  
  if (format === ExportFormat.REACT_FRAMER) {
    const commonImports = `import React from 'react';
import { motion } from 'framer-motion';`;
    
    const containerStyle = `const containerStyle = {
    backgroundColor: '${config.backgroundColor}',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    color: '${config.textColor}',
    fontFamily: '${config.fontFamily || 'sans-serif'}',
    overflow: 'hidden'
  };`;

    // SVG STROKE GENERATOR (REACT)
    if (config.type === AnimationType.SVG_STROKE) {
      return `${commonImports}

export default function Intro() {
  ${containerStyle}

  return (
    <div style={containerStyle}>
      <svg width="100%" height="250" viewBox="0 0 800 250" style={{ overflow: 'visible' }}>
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
            duration: ${config.duration}, 
            delay: ${config.delay},
            ease: "easeInOut"
          }}
          style={{ 
            fontSize: '${config.fontSize}px', 
            letterSpacing: '${config.letterSpacing}px',
            fontFamily: '${config.fontFamily || 'inherit'}',
            fontWeight: 'bold',
            fill: '${config.textColor}',
            stroke: '${config.textColor}',
            strokeWidth: ${config.strokeWidth || 1}
          }}
        >
          ${config.text}
        </motion.text>
      </svg>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ${config.delay + config.duration}, duration: 0.8 }}
        style={{ color: '${config.accentColor}', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 300 }}
      >
        ${config.subText}
      </motion.p>
    </div>
  );
}
`;
    }

    // TEXT STROKE GENERATOR (REACT)
    if (config.type === AnimationType.TEXT_STROKE) {
      return `${commonImports}

export default function Intro() {
  ${containerStyle}
  
  return (
    <div style={containerStyle}>
      <svg width="100%" height="250" viewBox="0 0 800 250" style={{ overflow: 'visible' }}>
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          initial={{ fill: "transparent", strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={{ 
            fill: '${config.textColor}',
            strokeDashoffset: 0,
          }}
          transition={{ 
            duration: ${config.duration}, 
            delay: ${config.delay},
            ease: "easeInOut",
            fill: { delay: ${config.delay + config.duration * 0.8}, duration: 0.5 }
          }}
          style={{ 
            fontSize: '${config.fontSize}px', 
            letterSpacing: '${config.letterSpacing}px',
            fontFamily: '${config.fontFamily || 'inherit'}',
            fontWeight: 'bold',
            stroke: '${config.accentColor}',
            strokeWidth: ${config.strokeWidth || 2}
          }}
        >
          ${config.text}
        </motion.text>
      </svg>
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ${config.delay + config.duration}, duration: 0.8 }}
        style={{ color: '${config.accentColor}', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 300, textAlign: 'center' }}
      >
        ${config.subText}
      </motion.p>
    </div>
  );
}`;
    }

    // MORPH GENERATOR (REACT)
    if (config.type === AnimationType.MORPH) {
      const isHorizontal = config.iconPosition === 'left' || config.iconPosition === 'right';
      return `${commonImports}

const ICONS = {
  circle: { path: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0", viewBox: "0 0 200 200" },
  square: { path: "M 25,25 L 175,25 L 175,175 L 25,175 Z", viewBox: "0 0 200 200" },
  triangle: { path: "M 100,25 L 175,175 L 25,175 Z", viewBox: "0 0 200 200" },
  star: { path: "M 100,10 L 123,80 L 198,80 L 138,125 L 160,195 L 100,150 L 40,195 L 62,125 L 2,80 L 77,80 Z", viewBox: "0 0 200 200" },
  heart: { path: "M 100,50 C 100,20 150,20 150,50 C 150,110 100,150 100,180 C 100,150 50,110 50,50 C 50,20 100,20 100,50 Z", viewBox: "0 0 200 200" },
  rocket: { path: "M100 15L75 60L75 140L100 185L125 140L125 60L100 15ZM75 100L40 140L40 170L75 140ZM125 100L160 140L160 170L125 140Z", viewBox: "0 0 200 200" }
};

export default function Intro() {
  const containerStyle = {
    backgroundColor: '${config.backgroundColor}',
    display: 'flex',
    flexDirection: ${isHorizontal ? "'row'" : "'column'"},
    gap: '${config.itemSpacing || 20}px',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    color: '${config.textColor}',
    fontFamily: '${config.fontFamily || 'sans-serif'}',
    overflow: 'hidden'
  };

  const icon = ICONS.${config.iconId || 'rocket'};
  const target = ICONS.${config.morphIconId || 'star'};
  const iconSize = ${config.fontSize * 1.5};

  const IconElement = (
    <svg width={iconSize} height={iconSize} viewBox={icon.viewBox} style={{ overflow: 'visible' }}>
      <motion.path
        d={icon.path}
        initial={{ d: icon.path, fill: '${config.iconColor || config.textColor}', opacity: 0 }}
        animate={{ 
          d: [icon.path, target.path, icon.path],
          fill: ['${config.iconColor || config.textColor}', '${config.accentColor}', '${config.iconColor || config.textColor}'],
          opacity: 1
        }}
        transition={{
          duration: ${config.duration * 2},
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: ${config.delay}
        }}
        stroke="${config.accentColor}"
        strokeWidth={${config.strokeWidth ? config.strokeWidth * 0.5 : 0}}
      />
    </svg>
  );

  return (
    <div style={containerStyle}>
      ${(config.iconPosition === 'top' || config.iconPosition === 'left') ? '{IconElement}' : ''}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: ${config.delay + 0.5}, duration: ${config.duration} }}
          style={{ fontSize: '${config.fontSize}px', letterSpacing: '${config.letterSpacing}px', fontWeight: 'bold' }}
        >
          ${config.text}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: ${config.delay + 1}, duration: 0.8 }}
          style={{ color: '${config.accentColor}', marginTop: '1rem', fontSize: '1.25rem', fontWeight: 300 }}
        >
          ${config.subText}
        </motion.p>
      </div>
      ${(config.iconPosition === 'bottom' || config.iconPosition === 'right') ? '{IconElement}' : ''}
    </div>
  );
}
`;
    }

    // TYPEWRITER GENERATOR (REACT)
    if (config.type === AnimationType.TYPEWRITER) {
      return `${commonImports}

export default function Intro() {
  ${containerStyle}

  const titleStyle = {
    fontSize: '${config.fontSize}px',
    letterSpacing: '${config.letterSpacing}px',
    fontWeight: 'bold',
    fontFamily: '${config.fontFamily || 'inherit'}'
  };
  
  const text = "${config.text}";
  
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.1,
              delay: ${config.delay} + index * 0.05,
            }}
          >
            {char}
          </motion.span>
        ))}
      </h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ${config.delay + 1}, duration: 0.8 }}
        style={{ color: '${config.accentColor}', marginTop: '1rem', fontSize: '1.5rem' }}
      >
        ${config.subText}
      </motion.p>
    </div>
  );
}`;
    }

    // STANDARD VARIANTS (FADE, SLIDE, SCALE, ELASTIC, BLUR)
    let variantsObj = '';
    if (config.type === AnimationType.ELASTIC_POP) {
      variantsObj = `
  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: ${config.delay} 
      } 
    }
  };`;
    } else {
      variantsObj = `
  const variants = {
    hidden: { 
      opacity: 0, 
      ${config.type === AnimationType.SLIDE_UP ? 'y: 50,' : ''}
      ${config.type === AnimationType.SCALE ? 'scale: 0.8,' : ''}
      ${config.type === AnimationType.BLUR_REVEAL ? 'filter: "blur(10px)", scale: 1.1,' : ''}
      ${config.type === AnimationType.Glitch ? 'x: -10,' : ''}
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      x: 0,
      transition: { 
        duration: ${config.duration}, 
        delay: ${config.delay},
        ease: '${config.easing === 'linear' ? 'linear' : 'easeInOut'}' 
      }
    },
  };`;
    }

    return `${commonImports}

export default function Intro() {
  ${containerStyle}

  const titleStyle = {
    fontSize: '${config.fontSize}px',
    letterSpacing: '${config.letterSpacing}px',
    fontWeight: 'bold',
    fontFamily: '${config.fontFamily || 'inherit'}'
  };

  ${variantsObj}

  return (
    <div style={containerStyle}>
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={variants}
        style={titleStyle}
      >
        ${config.text}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ${config.delay + config.duration * 0.8}, duration: 0.8 }}
        style={{ color: '${config.accentColor}', marginTop: '1rem', fontSize: '1.5rem' }}
      >
        ${config.subText}
      </motion.p>
    </div>
  );
}`;
  }

  // HTML + CSS Generator
  if (format === ExportFormat.HTML_CSS) {
    const keyframeName = `anim-${config.type}`;
    let keyframes = '';
    let extraCss = '';
    let htmlContent = `<h1 class="intro-title">${config.text}</h1>`;
    
    switch (config.type) {
        case AnimationType.SLIDE_UP:
            keyframes = `
@keyframes ${keyframeName} {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}`;
            break;
        case AnimationType.SCALE:
            keyframes = `
@keyframes ${keyframeName} {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}`;
            break;
        case AnimationType.ELASTIC_POP:
            keyframes = `
@keyframes ${keyframeName} {
  0% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1.1); }
  70% { transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}`;
            break;
        case AnimationType.BLUR_REVEAL:
             keyframes = `
@keyframes ${keyframeName} {
  0% { opacity: 0; filter: blur(20px); transform: scale(1.1); }
  100% { opacity: 1; filter: blur(0); transform: scale(1); }
}`;
            break;
        case AnimationType.SVG_STROKE:
             htmlContent = `
  <svg class="intro-svg" viewBox="0 0 800 200">
    <text x="50%" y="50%" class="intro-text-svg">${config.text}</text>
  </svg>`;
             extraCss = `
  .intro-svg {
    width: 100%;
    height: 200px;
    overflow: visible;
  }
  .intro-text-svg {
    font-size: ${config.fontSize}px;
    letter-spacing: ${config.letterSpacing}px;
    font-weight: bold;
    fill: ${config.textColor};
    fill-opacity: 0;
    stroke: ${config.textColor};
    stroke-width: 2px;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    text-anchor: middle;
    dominant-baseline: middle;
    animation: strokeDraw ${config.duration * 1.5}s ease-in-out forwards ${config.delay}s,
               fillIn 0.8s ease-out forwards ${config.delay + config.duration}s;
  }
  @keyframes strokeDraw {
    to { stroke-dashoffset: 0; }
  }
  @keyframes fillIn {
    to { fill-opacity: 1; }
  }`;
             keyframes = ''; // Handled in extraCss
             break;
        default: // Fade
             keyframes = `
@keyframes ${keyframeName} {
  0% { opacity: 0; }
  100% { opacity: 1; }
}`;
            break;
    }

    const titleCss = config.type !== AnimationType.SVG_STROKE ? `
  .intro-title {
    font-size: ${config.fontSize}px;
    letter-spacing: ${config.letterSpacing}px;
    animation: ${keyframeName} ${config.duration}s ${config.easing} forwards;
    animation-delay: ${config.delay}s;
    opacity: 0; /* Initial state */
  }` : '';

    return `<!-- HTML -->
<div class="intro-container">
  ${htmlContent}
  <p class="intro-subtitle">${config.subText}</p>
</div>

/* CSS */
<style>
  .intro-container {
    background-color: ${config.backgroundColor};
    color: ${config.textColor};
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: ${config.fontFamily || 'sans-serif'};
    overflow: hidden;
  }

  ${titleCss}
  ${extraCss}

  .intro-subtitle {
    color: ${config.accentColor};
    font-size: 1.5rem;
    margin-top: 1rem;
    opacity: 0;
    animation: fadeIn 1s ease forwards;
    animation-delay: ${config.delay + config.duration + (config.type === AnimationType.SVG_STROKE ? 0.5 : 0)}s;
  }

  @keyframes fadeIn {
    to { opacity: 1; transform: translateY(0); }
    from { opacity: 0; transform: translateY(20px); }
  }

  ${keyframes}
</style>`;
  }

  return '';
};