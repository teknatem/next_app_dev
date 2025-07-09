'use client';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

interface BackgroundSwitcherProps {
  title: string;
  description: string;
  className: string;
  buttonText: string;
}

export const BackgroundSwitcher: React.FC<BackgroundSwitcherProps> = ({
  title,
  description,
  className,
  buttonText
}) => {
  const handleBackgroundChange = () => {
    // Находим основной div в layout.tsx
    const mainContainer = document.querySelector(
      'div[class*="flex min-h-screen w-full flex-col"]'
    );
    if (mainContainer) {
      // Удаляем все существующие классы фона
      mainContainer.classList.remove(
        'bg-pattern-overlay',
        'bg-pattern-dark',
        'bg-gradient-primary',
        'bg-gradient-secondary',
        'bg-gradient-business'
      );
      // Добавляем новый класс
      if (className) {
        mainContainer.classList.add(className);
      }
    }
  };

  return (
    <Card className="bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Нажмите кнопку, чтобы применить этот фон ко всему приложению
        </p>
        <Button onClick={handleBackgroundChange} className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
