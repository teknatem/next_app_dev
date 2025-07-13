'use client';

import {
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  Eye,
  Heart,
  Star,
  ArrowRight,
  Check,
  X,
  Settings,
  Search,
  Bell,
  User,
  Lock,
  Unlock,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export default function TestButtonsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Test Buttons</h1>
        <p className="text-muted-foreground text-lg">
          Демонстрация 20 различных вариантов кнопок с разными стилями
        </p>
      </div>

      {/* Базовые варианты */}
      <Card>
        <CardHeader>
          <CardTitle>Базовые варианты</CardTitle>
          <CardDescription>
            Стандартные варианты кнопок из дизайн-системы
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Размеры */}
      <Card>
        <CardHeader>
          <CardTitle>Размеры кнопок</CardTitle>
          <CardDescription>
            Различные размеры для разных контекстов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Plus />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с иконками */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с иконками</CardTitle>
          <CardDescription>Комбинации иконок и текста</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Градиентные кнопки */}
      <Card>
        <CardHeader>
          <CardTitle>Градиентные кнопки</CardTitle>
          <CardDescription>
            Кастомные градиенты для особых случаев
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
              Blue to Purple
            </Button>
            <Button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white border-0">
              Green to Blue
            </Button>
            <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0">
              Pink to Orange
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0">
              Rainbow
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с эффектами */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с эффектами</CardTitle>
          <CardDescription>Анимации и hover эффекты</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="transform hover:scale-105 transition-transform duration-200">
              Scale on Hover
            </Button>
            <Button className="hover:shadow-lg transition-shadow duration-200">
              Shadow on Hover
            </Button>
            <Button className="hover:rotate-1 transition-transform duration-200">
              Rotate on Hover
            </Button>
            <Button className="relative overflow-hidden before:absolute before:inset-0 before:bg-white before:opacity-0 hover:before:opacity-20 before:transition-opacity">
              Shine Effect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки состояний */}
      <Card>
        <CardHeader>
          <CardTitle>Состояния кнопок</CardTitle>
          <CardDescription>
            Loading, disabled и другие состояния
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button className="opacity-50 cursor-not-allowed">
              Semi-disabled
            </Button>
            <Button>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <Check className="mr-2 h-4 w-4" />
              Success
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с бейджами */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с бейджами</CardTitle>
          <CardDescription>Комбинация кнопок и бейджей</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="relative">
              Notifications
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
            <Button variant="outline" className="relative">
              Messages
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
              >
                12
              </Badge>
            </Button>
            <Button variant="ghost" className="relative">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-green-500">
                <Check className="h-2 w-2" />
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки действий */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки действий</CardTitle>
          <CardDescription>
            Специализированные кнопки для конкретных действий
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Star className="mr-2 h-4 w-4" />
              Favorite
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки навигации */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки навигации</CardTitle>
          <CardDescription>Кнопки для навигации и переходов</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="ghost" className="group">
              <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              Next Page
            </Button>
            <Button variant="outline" className="group">
              <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
              Settings
            </Button>
            <Button variant="ghost" className="group">
              <User className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Profile
            </Button>
            <Button variant="outline" className="group">
              <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки медиа */}
      <Card>
        <CardHeader>
          <CardTitle>Медиа кнопки</CardTitle>
          <CardDescription>
            Кнопки для управления медиа контентом
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              size="icon"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              <Play className="h-4 w-4 ml-0.5" />
            </Button>
            <Button size="icon" variant="outline" className="rounded-full">
              <Pause className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки безопасности */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки безопасности</CardTitle>
          <CardDescription>Кнопки для управления безопасностью</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Unlock className="mr-2 h-4 w-4" />
              Unlock
            </Button>
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <Lock className="mr-2 h-4 w-4" />
              Lock
            </Button>
            <Button variant="destructive">
              <X className="mr-2 h-4 w-4" />
              Block User
            </Button>
            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <Settings className="mr-2 h-4 w-4" />
              Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с анимацией */}
      <Card>
        <CardHeader>
          <CardTitle>Анимированные кнопки</CardTitle>
          <CardDescription>Кнопки с встроенными анимациями</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="animate-pulse bg-blue-600 hover:bg-blue-700 text-white">
              Pulsing Button
            </Button>
            <Button className="animate-bounce bg-green-600 hover:bg-green-700 text-white">
              Bouncing Button
            </Button>
            <Button className="animate-ping bg-red-600 hover:bg-red-700 text-white">
              Ping Button
            </Button>
            <Button className="animate-spin bg-purple-600 hover:bg-purple-700 text-white">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с границами */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с границами</CardTitle>
          <CardDescription>Различные стили границ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-2 border-dashed">
              Dashed Border
            </Button>
            <Button variant="outline" className="border-2 border-dotted">
              Dotted Border
            </Button>
            <Button variant="outline" className="border-4">
              Thick Border
            </Button>
            <Button className="border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-border">
              Gradient Border
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с тенями */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с тенями</CardTitle>
          <CardDescription>Различные эффекты теней</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="shadow-sm">Small Shadow</Button>
            <Button className="shadow-md">Medium Shadow</Button>
            <Button className="shadow-lg">Large Shadow</Button>
            <Button className="shadow-xl">Extra Large Shadow</Button>
            <Button className="shadow-2xl">2XL Shadow</Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с закруглениями */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с закруглениями</CardTitle>
          <CardDescription>Различные радиусы закругления</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="rounded-none">Square</Button>
            <Button className="rounded-sm">Small Rounded</Button>
            <Button className="rounded-md">Medium Rounded</Button>
            <Button className="rounded-lg">Large Rounded</Button>
            <Button className="rounded-full">Fully Rounded</Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с прозрачностью */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с прозрачностью</CardTitle>
          <CardDescription>Эффекты прозрачности и размытия</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-500/50 hover:bg-blue-500/70 text-white backdrop-blur-sm">
              Semi-transparent
            </Button>
            <Button className="bg-green-500/30 hover:bg-green-500/50 text-green-800 backdrop-blur-md">
              Very Transparent
            </Button>
            <Button className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-900 backdrop-blur-lg">
              Glass Effect
            </Button>
            <Button className="bg-red-500/80 hover:bg-red-500/90 text-white backdrop-blur">
              Frosted Glass
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с градиентным текстом */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с градиентным текстом</CardTitle>
          <CardDescription>Градиенты применяются к тексту</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent border-blue-500"
            >
              Gradient Text
            </Button>
            <Button
              variant="ghost"
              className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
            >
              Rainbow Text
            </Button>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent border-pink-500"
            >
              Sunset Text
            </Button>
            <Button className="bg-white text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border border-gray-300">
              White with Gradient Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с иконками справа */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с иконками справа</CardTitle>
          <CardDescription>Иконки размещены справа от текста</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              Save Changes
              <Check className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="destructive">
              Delete Forever
              <Trash2 className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost">
              View Details
              <Eye className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с счетчиками */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с счетчиками</CardTitle>
          <CardDescription>Кнопки с встроенными счетчиками</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="relative">
              Cart
              <Badge className="ml-2 bg-blue-500 text-white">3</Badge>
            </Button>
            <Button variant="ghost" className="relative">
              <Heart className="mr-2 h-4 w-4" />
              Favorites
              <Badge className="ml-2 bg-red-500 text-white">12</Badge>
            </Button>
            <Button className="relative">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              <Badge className="ml-2 bg-yellow-500 text-white">5</Badge>
            </Button>
            <Button variant="outline" className="relative">
              Messages
              <Badge className="ml-2 bg-green-500 text-white">99+</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки с подсказками */}
      <Card>
        <CardHeader>
          <CardTitle>Кнопки с подсказками</CardTitle>
          <CardDescription>Кнопки с дополнительной информацией</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="group relative">
              <Button variant="outline" className="relative">
                <Settings className="mr-2 h-4 w-4" />
                Advanced
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Advanced settings panel
              </div>
            </div>
            <div className="group relative">
              <Button variant="ghost">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                View your profile
              </div>
            </div>
            <div className="group relative">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Star className="mr-2 h-4 w-4" />
                Premium
              </Button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Upgrade to premium
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
