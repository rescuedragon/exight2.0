import { useEffect, useState } from "react";

interface ScreenScaleProps {
  children: React.ReactNode;
  baseWidth?: number; // design width to scale against
  maxScale?: number; // maximum scale
  minScale?: number; // minimum scale
  className?: string;
}

export const ScreenScale = ({
  children,
  baseWidth = 1440, // MacBook Air M1 width
  maxScale = 1.05,
  minScale = 0.92,
  className
}: ScreenScaleProps) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const next = Math.max(minScale, Math.min(maxScale, width / baseWidth));
      setScale(parseFloat(next.toFixed(3)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [baseWidth, maxScale, minScale]);

  return (
    <div className={className} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      {children}
    </div>
  );
};

export default ScreenScale;

