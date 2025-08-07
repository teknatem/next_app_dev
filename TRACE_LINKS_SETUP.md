# 🔗 Настройка гиперссылок в trace-index.yml

Это руководство поможет вам настроить кликабельные ссылки в файле `trace-index.yml` для быстрой навигации по каталогам объектов в IDE.

## 🎯 Что получится

После настройки в файле `trace-index.yml` пути станут кликабельными:

```yaml
E-001:
  path: entities/production-item # ← кликабельная ссылка
  name: ProductionItem
  layer: entities
```

## 🚀 Способы реализации

### 1. VS Code Extension (Рекомендуется)

#### Установка расширения

1. **Создайте расширение:**

```bash
# Клонируйте или создайте папку cursor-trace-links
mkdir cursor-trace-links
cd cursor-trace-links
```

2. **Установите зависимости:**

```bash
npm install
npm install -g vsce
```

3. **Скомпилируйте:**

```bash
npm run compile
```

4. **Создайте .vsix файл:**

```bash
vsce package
```

5. **Установите в Cursor:**
   - Откройте Command Palette (`Ctrl+Shift+P`)
   - Выберите "Extensions: Install from VSIX..."
   - Выберите созданный `.vsix` файл

#### Использование

После установки расширения:

- Откройте `trace-index.yml`
- Пути автоматически станут кликабельными
- Кликните на путь для открытия директории в IDE

### 2. Command Line Scripts

#### Быстрый старт

```bash
# Показать все доступные пути
pnpm trace:list

# Открыть конкретный путь в IDE
pnpm trace:ide entities/production-item
pnpm trace:ide widgets/file-to-base-import
```

#### Прямые команды

```bash
# Открыть в Cursor
cursor entities/production-item

# Открыть в VS Code
code shared/database

# Использовать скрипт напрямую
node scripts/trace-links-vscode.js features/product-catalog-delete
```

### 3. Автоматизация через Git Hooks

#### Настройка pre-commit hook

Создайте `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Проверяем, что trace-index.yml актуален
if git diff --cached --name-only | grep -q "trace-index.yml"; then
    echo "🔍 Проверяем trace-index.yml..."
    node scripts/trace-links.js
fi
```

## 📁 Структура файлов

```
project/
├── cursor-trace-links/          # VS Code расширение
│   ├── src/extension.ts
│   ├── package.json
│   └── README.md
├── scripts/
│   ├── trace-links.js           # Базовый скрипт
│   ├── trace-links-vscode.js    # Улучшенный скрипт
│   └── trace-links-demo.html    # Демонстрация
├── trace-index.yml              # Ваш файл с путями
└── TRACE_LINKS_SETUP.md         # Это руководство
```

## 🛠️ Настройка для вашего проекта

### 1. Добавьте команды в package.json

```json
{
  "scripts": {
    "trace:list": "node scripts/trace-links.js",
    "trace:ide": "node scripts/trace-links-vscode.js"
  }
}
```

### 2. Создайте скрипты

Скопируйте файлы `scripts/trace-links.js` и `scripts/trace-links-vscode.js` в ваш проект.

### 3. Настройте IDE

Убедитесь, что Cursor или VS Code добавлены в PATH:

```bash
# Проверка доступности
cursor --version
code --version
```

## 🎨 Кастомизация

### Изменение цветов ссылок

В VS Code расширении (`cursor-trace-links/src/extension.ts`):

```typescript
// Настройка стилей ссылок
const link = new vscode.DocumentLink(
  new vscode.Range(startPos, endPos),
  vscode.Uri.parse(
    `command:cursor-trace-links.openPath?${encodeURIComponent(JSON.stringify(pathValue))}`
  )
);
link.tooltip = `Открыть ${pathValue} в IDE`;
```

### Добавление новых слоев

В `scripts/create-slice.ts` добавьте новые префиксы:

```typescript
const PREFIX: Record<Layers, string> = {
  entities: 'E',
  features: 'F',
  widgets: 'W',
  shared: 'S',
  pages: 'P', // Новый слой
  processes: 'PR' // Новый слой
};
```

## 🔧 Устранение неполадок

### Проблема: "Команда не найдена"

```bash
# Решение: добавьте IDE в PATH
# Windows (добавьте в PATH):
C:\Users\YourUser\AppData\Local\Programs\Cursor\resources\app\bin

# macOS/Linux:
export PATH="/Applications/Cursor.app/Contents/Resources/app/bin:$PATH"
```

### Проблема: "Путь не существует"

```bash
# Проверьте структуру проекта
ls -la entities/production-item
ls -la widgets/file-to-base-import

# Создайте недостающие директории
mkdir -p entities/production-item
mkdir -p widgets/file-to-base-import
```

### Проблема: Расширение не работает

1. Проверьте логи расширения:

   - `Ctrl+Shift+P` → "Developer: Show Logs"
   - Выберите "Extension Host"

2. Перезапустите Cursor

3. Проверьте, что файл называется именно `trace-index.yml`

## 🚀 Продвинутые возможности

### Интеграция с архитектурой (пример слоёв)

```typescript
// Автоматическое создание ссылок для слоёв (пример)
const LAYERS = ['entities', 'features', 'widgets', 'shared', 'pages'];
```

### Поддержка относительных путей

```typescript
// Поддержка путей вида:
// path: ./entities/production-item
// path: ../shared/database
```

### Интеграция с Git

```bash
# Автоматическое обновление trace-index.yml при создании новых слайсов
git add trace-index.yml
git commit -m "feat: add new slice with trace links"
```

## 📚 Дополнительные ресурсы

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Cursor Documentation](https://cursor.sh/docs)
  // Ранее: Feature-Sliced Design — заменено на CDD в проектной документации

## 🤝 Вклад в проект

Если вы улучшили функциональность:

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Добавьте тесты
4. Создайте Pull Request

---

**💡 Совет:** Начните с простого скрипта `pnpm trace:ide`, а затем переходите к VS Code расширению для полной интеграции.
