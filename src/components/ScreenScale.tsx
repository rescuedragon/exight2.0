import { useEffect, useState } from "react";

interface ScreenScaleProps {
  children: React.ReactNode;
  baseWidth?: number; // design width to scale against
  baseHeight?: number; // design height to scale against
  maxScale?: number; // maximum scale
  minScale?: number; // minimum scale
  className?: string;
}

export const ScreenScale = ({
  children,
  baseWidth = 1440, // MacBook Air M1 width
  baseHeight = 900, // MacBook Air M1 height
  maxScale = 1.35,
  minScale = 0.85,
  className
}: ScreenScaleProps) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const widthRatio = width / baseWidth;
      const heightRatio = height / baseHeight;
      const next = Math.max(minScale, Math.min(maxScale, Math.min(widthRatio, heightRatio)));
      setScale(parseFloat(next.toFixed(3)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [baseWidth, baseHeight, maxScale, minScale]);

  return (
    <div className={className} style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
      {children}
    </div>
  );
};

export default ScreenScale;

