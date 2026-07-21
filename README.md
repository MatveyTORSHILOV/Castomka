# Castomka

Каркас лендинга с проф. моушен-сценой: **React + React Three Fiber + scroll-driven camera** и слот под объекты из Blender.

## Запуск

```bash
npm install
npm run dev
```

## Как подставить свой Blender-объект

1. В Blender: `File → Export → glTF 2.0 (.glb)`
2. Сохрани файл как `public/models/hero.glb`
3. Перезагрузи страницу — плейсхолдер заменится на твою модель

Рекомендации по экспорту:
- один герой-объект, без тяжёлой сцены
- текстуры ≤ 1K
- Apply Modifiers перед экспортом
- целевой вес файла желательно до 3–8 MB

## Что уже есть

- fullscreen 3D-сцена на фоне
- scroll-progress крутит объект и двигает камеру
- procedural placeholder, пока нет `.glb`
- секции с пайплайном Blender → сайт
- `prefers-reduced-motion` отключает scroll-драйв

## Дальше

- второй объект / смена света по секциям
- Draco/meshopt compression
- mobile fallback на WebM
- loading-состояние и error boundary вокруг GLB
