import React from 'react';

interface BackgroundProps {
  children: React.ReactNode;
  imageUrl?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  variant?: 'light' | 'dark' | 'gradient' | 'none';
}

export const Background: React.FC<BackgroundProps> = ({
  children,
  imageUrl = '/images/placeholder-product.svg',
  overlay = true,
  overlayOpacity = 0.7,
  className = '',
  variant = 'light'
}) => {
  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      width: '100%'
    };

    switch (variant) {
      case 'light':
        return {
          ...baseStyle,
          backgroundImage: overlay
            ? `linear-gradient(rgba(255, 255, 255, ${overlayOpacity}), rgba(255, 255, 255, ${overlayOpacity * 0.8})), url('${imageUrl}')`
            : `url('${imageUrl}')`
        };
      case 'dark':
        return {
          ...baseStyle,
          backgroundImage: overlay
            ? `linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity * 0.8})), url('${imageUrl}')`
            : `url('${imageUrl}')`
        };
      case 'gradient':
        return {
          ...baseStyle,
          backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
        };
      case 'none':
      default:
        return baseStyle;
    }
  };

  return (
    <div style={getBackgroundStyle()} className={className}>
      {children}
    </div>
  );
};

// Компонент для градиентных фонов
export const GradientBackground: React.FC<{
  children: React.ReactNode;
  gradient?: 'primary' | 'secondary' | 'business' | 'custom';
  customGradient?: string;
  className?: string;
}> = ({ children, gradient = 'primary', customGradient, className = '' }) => {
  const getGradientStyle = () => {
    if (customGradient) {
      return { background: customGradient };
    }

    const gradients = {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      business: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    };

    return { background: gradients[gradient as keyof typeof gradients] };
  };

  return (
    <div
      style={getGradientStyle()}
      className={`min-h-screen w-full ${className}`}
    >
      {children}
    </div>
  );
};

// Компонент для анимированного фона
export const AnimatedBackground: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
    >
      {/* Анимированные элементы фона */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-500/20 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
