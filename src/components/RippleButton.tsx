import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleButtonProps {
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  className?: string;
  rippleColor?: string;
  as?: 'button' | 'div';
}

export function RippleButton({
  onClick,
  children,
  className = '',
  rippleColor = 'rgba(255,255,255,0.45)',
  as: Tag = 'button',
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLElement>(null);
  const counterRef = useRef(0);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Make ripple large enough to fill the element from the click point
    const distX = Math.max(x, rect.width - x);
    const distY = Math.max(y, rect.height - y);
    const size = Math.sqrt(distX * distX + distY * distY) * 2.2;

    const id = counterRef.current++;
    setRipples((prev) => [...prev, { id, x, y, size }]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);

    if (onClick) {
      // Small delay so the ripple is visible before navigation
      setTimeout(() => onClick(e), 220);
    }
  };

  return (
    <Tag
      // @ts-ignore
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full animate-ripple"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            background: rippleColor,
          }}
        />
      ))}
    </Tag>
  );
}
