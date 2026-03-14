import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, className, onClick }) => {
  return (
    <div 
      className={`glass-card ${className || ''}`} 
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
