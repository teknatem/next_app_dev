import { Background } from '@/shared/ui/background';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export default function BackgroundExamplePage() {
  return (
    <Background
      imageUrl="/images/placeholder-product.svg"
      overlay={true}
      overlayOpacity={0.8}
      variant="light"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Пример использования Background компонента
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Эта страница демонстрирует использование компонента Background
          </p>
          <Link href="/background-demo">
            <Button variant="outline">Вернуться к демо</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-background/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Карточка 1</CardTitle>
              <CardDescription>Карточка с полупрозрачным фоном</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Содержимое карточки с красивым фоном</p>
            </CardContent>
          </Card>

          <Card className="bg-background/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Карточка 2</CardTitle>
              <CardDescription>Еще одна карточка</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Фоновая картинка видна через полупрозрачный фон</p>
            </CardContent>
          </Card>

          <Card className="bg-background/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Карточка 3</CardTitle>
              <CardDescription>Последняя карточка</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Эффект backdrop-blur создает размытие</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-background/80 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Настройки фона</CardTitle>
              <CardDescription>
                Параметры, используемые на этой странице
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-left space-y-2 text-sm">
                <p>
                  <strong>imageUrl:</strong> "/images/placeholder-product.svg"
                </p>
                <p>
                  <strong>overlay:</strong> true
                </p>
                <p>
                  <strong>overlayOpacity:</strong> 0.8
                </p>
                <p>
                  <strong>variant:</strong> "light"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Background>
  );
}
