import {
  Background,
  GradientBackground,
  AnimatedBackground
} from '@/shared/ui/background';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { BackgroundSwitcher } from './components/background-switcher';

export default function BackgroundDemoPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Демонстрация фоновых картинок
        </h1>
        <p className="text-muted-foreground">Выберите один из вариантов ниже</p>
        <div className="mt-4">
          <Link href="/background-example">
            <Button variant="outline">
              Посмотреть пример с Background компонентом
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Вариант 1: Фоновая картинка с белым оверлеем */}
        <BackgroundSwitcher
          title="Фоновая картинка (светлый оверлей)"
          description="Использует CSS класс bg-pattern-overlay"
          className="bg-pattern-overlay"
          buttonText="Применить"
        />

        {/* Вариант 2: Фоновая картинка с темным оверлеем */}
        <BackgroundSwitcher
          title="Фоновая картинка (темный оверлей)"
          description="Использует CSS класс bg-pattern-dark"
          className="bg-pattern-dark"
          buttonText="Применить"
        />

        {/* Вариант 3: Градиентный фон */}
        <BackgroundSwitcher
          title="Градиентный фон"
          description="Использует CSS класс bg-gradient-primary"
          className="bg-gradient-primary"
          buttonText="Применить"
        />

        {/* Вариант 4: Бизнес градиент */}
        <BackgroundSwitcher
          title="Бизнес градиент"
          description="Использует CSS класс bg-gradient-business"
          className="bg-gradient-business"
          buttonText="Применить"
        />

        {/* Вариант 5: Без фона */}
        <BackgroundSwitcher
          title="Без фона"
          description="Возврат к стандартному фону"
          className=""
          buttonText="Применить"
        />

        {/* Вариант 6: Информация о компонентах */}
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Компоненты фона</CardTitle>
            <CardDescription>Доступные React компоненты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <code>Background</code> - основной компонент
              </p>
              <p>
                <code>GradientBackground</code> - градиентные фоны
              </p>
              <p>
                <code>AnimatedBackground</code> - анимированный фон
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Примеры использования компонентов */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          Примеры использования компонентов
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Пример с Background компонентом */}
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Background компонент</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {`<Background 
  imageUrl="/images/your-image.jpg"
  overlay={true}
  overlayOpacity={0.8}
  variant="light"
>
  <YourContent />
</Background>`}
              </pre>
            </CardContent>
          </Card>

          {/* Пример с GradientBackground компонентом */}
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>GradientBackground компонент</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {`<GradientBackground 
  gradient="business"
  className="min-h-screen"
>
  <YourContent />
</GradientBackground>`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Инструкции по добавлению своих картинок */}
      <Card className="bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Как добавить свою картинку</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                1. Добавьте картинку в папку public/images/
              </h3>
              <p className="text-sm text-muted-foreground">
                Например: <code>public/images/background.jpg</code>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                2. Обновите CSS классы в globals.css
              </h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {`.bg-pattern {
  background-image: url('/images/your-image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                3. Или используйте компонент Background
              </h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {`<Background imageUrl="/images/your-image.jpg">
  <YourContent />
</Background>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
