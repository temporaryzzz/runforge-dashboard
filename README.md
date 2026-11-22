# Runforge Dashboard

Небольшой адаптивный React-дашборд для просмотра запусков AI-агентов. Данные для интерфейса предоставляет JSON Server; полноценный backend не требуется.

## Возможности

- Список запусков с названием, репозиторием и текстовым статусом.
- Цветовые метки статусов: `queued`, `running`, `succeeded`, `failed`.
- Поиск по названию запуска и репозиторию.
- Фильтрация по одному или нескольким статусам; условия поиска и фильтра применяются одновременно.
- Раскрытие карточки с веткой, датой создания, длительностью и логами запуска.
- Состояния загрузки, ошибки с повторным запросом и пустого результата.

## Технологии

- React и TypeScript
- Vite
- Tailwind CSS
- JSON Server
- Vitest, jsdom, React Testing Library и `user-event`
- ESLint

## Требования

- Node.js и npm

## Установка и запуск

В терминале из корня проекта:

```powershell
npm install
npm run dev:all
```

`dev:all` одновременно запускает:

- Vite — `http://localhost:5173`;
- JSON Server — `http://localhost:2777`.

Откройте адрес клиента, `http://localhost:5173`.

Чтобы остановить оба процесса, нажмите `Ctrl+C` в терминале, где выполняется `npm run dev:all`.

### Запуск серверов по отдельности

Если нужно запускать процессы раздельно, откройте два терминала:

```powershell
npm run dev
```

```powershell
npm run api
```

## Команды

```powershell
npm run dev:all       # frontend и mock API
npm run dev           # только Vite
npm run api           # только JSON Server
npm run build         # проверка TypeScript и production-сборка
npm run preview       # локальный просмотр production-сборки
npm run lint          # ESLint
npm test              # запуск всех тестов
```

Тесты подменяют `fetchRuns` через Vitest mock, поэтому для `npm test` запуск JSON Server не требуется.

## Данные

Типы сущностей определены в `src/types.ts`. Основные поля запуска:

```ts
type RunStatus = "queued" | "running" | "succeeded" | "failed";

type Run = {
    id: string;
    name: string;
    repository: string;
    branch: string;
    status: RunStatus;
    createdAt: string;
    durationSeconds?: number;
    logs: string[];
    result?: string;
};
```

Mock-записи находятся в [`db.json`](db.json).

## Структура проекта

```text
src/
  App.tsx                   # загрузка данных и состояние страницы
  api.ts                    # запросы к mock API
  types.ts                  # типы Run и RunStatus
  components/
    RunCard.tsx             # карточка запуска и подробности
    RunFilters.tsx          # поиск, статусы и активные ярлыки
    Selector.tsx            # кастомный multiple-селектор
    FilterCard.tsx          # ярлык одного активного фильтра
    LoadingState.tsx        # загрузка
    ErrorState.tsx          # ошибка и повторная загрузка
    EmptyState.tsx          # пустой результат
  App.test.tsx              # тесты фильтрации, поиска и деталей
db.json                     # записи для JSON Server
vite.config.ts              # плагины и proxy к JSON Server
vitest.config.ts            # настройки Vitest
```

## Проверки

`src/App.test.tsx` содержит три сценария:

1. фильтрация запусков по выбранному статусу;
2. поиск запуска по названию;
3. раскрытие карточки и отображение логов.
