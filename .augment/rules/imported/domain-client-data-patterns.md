---
type: "manual"
---

Механизм работы с объектом на клиенте, при котором форма объекта получает копию из БД, работает с ней в памяти.

---

### Реализация Механизма Работы с Объектом на Клиенте (Паттерн "Полная Копия")

**1. Загрузка Данных Сущности (Серверная Сторона)**

- **Server Component (Next.js App Router):** Именно здесь происходит первичная выборка данных. `page.tsx` или `layout.tsx` (если форма глобальная) в слое `app/` или `ui/*.server.tsx` в слое домена/виджета будет выполнять эту роль.
- **Вызов Server Action / Репозитория:** Server Component вызывает соответствующий Server Action из `domain/<domain>/features/*.server.ts` или напрямую обращается к репозиторию `domain/<domain>/data/*.repo.server.ts` для получения данных.
- **Включение Версии для Оптимистичной Блокировки:** Важно, чтобы при выборке данных из БД в объект сущности **обязательно включалось поле `version`**

  - Пример в репозитории:

    ```typescript
    // domains/document-meetings-d004/data/meetings.repo.server.ts
    import "server-only";
    import { db } from "@/shared/database/connection";
    import { meetings } from "@/shared/database/schemas/meetings.schema";
    import { eq } from "drizzle-orm";

    export const meetingRepositoryServer = {
      async getMeetingById(id: string) {
        const meeting = await db.query.meetings.findFirst({
          where: eq(meetings.id, id),
        });
        if (!meeting) return null;
        // Включаем 'version' в возвращаемый объект
        return { ...meeting, version: meeting.version };
      },
      // ... другие методы
    };
    ```

- **Передача на Клиент:** Полученные данные (включая `version`) передаются в качестве `props` в клиентский компонент формы.

  ```typescript
  // app/(main)/meetings/[id]/page.tsx (Server Component)
  import { meetingRepositoryServer } from "@/domain/d004-meetings/index.server";
  import { MeetingDetailsFormClient } from "@/domain/d004-meetings/ui/meeting-details-form.client";

  export default async function MeetingEditPage({
    params,
  }: {
    params: { id: string };
  }) {
    const meeting = await meetingRepositoryServer.getMeetingById(params.id);

    if (!meeting) {
      // Обработка 404
      return <div>Meeting not found</div>;
    }

    return <MeetingDetailsFormClient initialMeeting={meeting} />;
  }
  ```

**2. Управление Состоянием Объекта на Клиенте**

- **Клиентский Компонент Формы (`domain/<domain>/ui/*.client.tsx`):** Это основной компонент, который будет управлять состоянием объекта в памяти.
- **Выбор Инструмента Управления Состоянием:**

  - **React Hook Form (рекомендовано для форм):** Отлично подходит для управления полями формы, их валидацией и сбором всех изменений. Вы можете инициализировать форму `initialMeeting` из `props`.

    ```typescript
    // domains/document-meetings-d004/ui/meeting-details-form.client.tsx
    "use client";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { meetingSchema } from "@/domain/d004-meetings/model/meetings.schema"; // Ваша Zod-схема
    import { useActionState } from "react";
    import { saveMeetingAction } from "@/domain/d004-meetings/features/crud.server"; // Ваш Server Action

    export function MeetingDetailsFormClient({ initialMeeting }) {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(meetingSchema), // Клиентская валидация
        defaultValues: initialMeeting, // Инициализация формы полной копией
      });

      // useActionState для обработки Server Action и его результатов
      const [state, formAction] = useActionState(saveMeetingAction, {
        success: false,
        error: null,
      });

      const onSubmit = async (data) => {
        // data будет содержать всю форму, включая initialMeeting.version
        formAction(data);
      };

      // Обработка результата Server Action, включая OptimisticLockingError
      // useEffect для side-эффектов useActionState.state
      // ...

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("title")} placeholder="Title" />
          {errors.title && <span>{errors.title.message}</span>}
          {/* ... другие поля */}
          <button type="submit">Save</button>

          {/* UI для отображения ошибок и конфликтов */}
          {state.error?.type === "OptimisticLocking" && (
            <div className="text-red-500">
              Conflict: Someone else updated this meeting.
              <button
                onClick={() => {
                  /* logic to refresh form from latestData or overwrite */
                }}
              >
                Refresh
              </button>
              <button
                onClick={() => {
                  /* logic to overwrite with user's changes */
                }}
              >
                Overwrite
              </button>
            </div>
          )}
          {state.success && <div>Saved successfully!</div>}
        </form>
      );
    }
    ```

  - **Zustand (для более сложных сценариев):** Если у вас очень сложная форма с множеством вложенных сущностей, или форма распределена по нескольким компонентам, Zustand-стор может хранить "черновик" объекта.

    ```typescript
    // domains/document-meetings-d004/lib/meeting-draft-store.ts
    "use client";
    import { create } from "zustand";
    import { Meeting } from "@/domain/d004-meetings/model/meetings.schema";

    interface MeetingDraftState {
      draft: Partial<Meeting>;
      setDraft: (meeting: Partial<Meeting>) => void;
      updateField: (field: keyof Meeting, value: any) => void;
      resetDraft: (initial: Meeting) => void;
    }

    export const useMeetingDraftStore = create<MeetingDraftState>((set) => ({
      draft: {},
      setDraft: (meeting) => set({ draft: meeting }),
      updateField: (field, value) =>
        set((state) => ({ draft: { ...state.draft, [field]: value } })),
      resetDraft: (initial) => set({ draft: initial }),
    }));
    ```

    Клиентский компонент тогда будет использовать этот стор.

- **Изменения в Памяти:** При каждом взаимодействии пользователя (вводе текста, изменении флажков и т.д.) обновляется _только_ состояние формы/черновика на клиенте. Сетевых запросов на этом этапе нет.

**3. Сохранение Данных на Сервере (Серверная Сторона)**

- **Вызов Server Action:** При нажатии кнопки "Сохранить", данные из клиентской формы (весь "черновик" объекта) передаются в Server Action.
- **Server Action (`domain/<domain>/features/*.server.ts`):**

  - Получает полный объект.
  - Выполняет серверную валидацию (повторно, используя те же Zod-схемы, что и на клиенте).
  - Вызывает метод `update` в репозитории, передавая `id` объекта и его `version`.

  ```typescript
  // domains/document-meetings-d004/features/crud.server.ts
  "use server";
  import { meetingRepositoryServer } from "@/domain/d004-meetings/index.server";
  import {
    meetingSchema,
    Meeting,
  } from "@/domain/d004-meetings/model/meetings.schema";
  import { OptimisticLockingError } from "@/shared/lib/errors.shared"; // Ваша общая ошибка
  import { revalidatePath } from "next/cache";

  export async function saveMeetingAction(
    formData: Meeting
  ): Promise<ActionResult<Meeting>> {
    // 1. Серверная валидация
    const validationResult = meetingSchema.safeParse(formData);
    if (!validationResult.success) {
      return {
        success: false,
        error: {
          type: "ValidationError",
          issues: validationResult.error.issues,
        },
      };
    }
    const data = validationResult.data;

    try {
      // 2. Вызов репозитория с оптимистичной блокировкой
      const updatedMeeting = await meetingRepositoryServer.updateMeeting(
        data.id,
        data,
        data.version // Передаем ожидаемую версию
      );

      revalidatePath("/meetings"); // Инвалидация кэша Next.js
      return { success: true, data: updatedMeeting };
    } catch (error) {
      if (error instanceof OptimisticLockingError) {
        // Возвращаем последнюю версию из БД для UX
        const latestMeeting = await meetingRepositoryServer.getMeetingById(
          data.id
        );
        return {
          success: false,
          error: {
            type: "OptimisticLocking",
            message: error.message,
            latestData: latestMeeting,
          },
        };
      }
      return {
        success: false,
        error: { type: "GenericError", message: "Failed to save meeting" },
      };
    }
  }
  ```

- **Репозиторий (`domain/<domain>/data/*.repo.server.ts`):**

  - Выполняет запрос `UPDATE`, который включает условие `WHERE version = expectedVersion`.
  - Если `UPDATE` не затронул ни одной строки (потому что `version` не совпала), это означает конфликт. В этом случае выбрасывается `OptimisticLockingError`.
  - В случае успешного обновления, `version` в базе данных инкрементируется.

  ```typescript
  // domains/document-meetings-d004/data/meetings.repo.server.ts (дополнение)
  import { OptimisticLockingError } from "@/shared/lib/errors.shared";

  export const meetingRepositoryServer = {
    // ... getMeetingById, insertMeeting
    async updateMeeting(
      id: string,
      updates: Partial<Meeting>,
      expectedVersion: number
    ): Promise<Meeting> {
      const result = await db
        .update(meetings)
        .set({
          ...updates, // Ваши изменения
          updatedAt: new Date(), // Обновляем timestamp
          version: updates.version + 1, // Инкрементируем версию на сервере
        })
        .where(eq(meetings.id, id))
        .where(eq(meetings.version, expectedVersion)) // Ключевое условие для Optimistic Locking
        .returning(); // Возвращаем обновленную запись

      if (result.length === 0) {
        throw new OptimisticLockingError(
          "The record has been updated by another user. Please refresh and try again."
        );
      }
      return result[0]; // Возвращаем обновленный объект
    },
  };
  ```

**4. Обработка Конфликтов на Клиенте**

- Когда `saveMeetingAction` возвращает ошибку типа `OptimisticLocking`, клиентский компонент (использующий `useActionState`) должен отобразить UI, предлагающий пользователю варианты:
  - **"Отменить мои изменения / Обновить"**: Сбросить форму (`reset` в React Hook Form) и заново загрузить актуальные данные из БД (возможно, вызвав `initialMeeting={latestData}` из `state.error.latestData`).
  - **"Перезаписать мои изменения"**: Пользователь осознанно решает, что его изменения важнее. В этом случае, форма повторно отправляется Server Action, но **передается уже новая, актуальная `version`** (например, `state.error.latestData.version`), полученная из ответа Server Action. Это говорит серверу: "Я знаю, что было `X` версией, но я получил `Y` (последнюю) и хочу перезаписать ее своими изменениями." Это должно быть сделано с предупреждением пользователя, так как это приведет к потере чужих изменений.

---

### 📝 Правило для Новых Доменов: Управление Состоянием Объекта на Клиенте (Паттерн "Полная Копия")

**Принцип:** Для форм создания и редактирования сложных сущностей, где требуется атомарное сохранение множества изменений, используй паттерн "Полная Копия". Это означает загрузку всего объекта сущности из БД на клиент, работу с его "черновиком" в памяти и сохранение всех изменений одним атомарным действием на сервере, с обязательной проверкой на конфликты.

**✅ Механизм реализации для Доменов типа "Catalog" или "Document":**

1.  **Поле `version`:**

    - В схему БД для каждой сущности (например, `meetings`, `files`, `employees`) **обязательно** добавь поле `version INTEGER NOT NULL DEFAULT 0`.
    - Обнови соответствующие Drizzle-схемы и Zod-типы (`domain/<domain>/model/*.schema.ts`) для включения этого поля.

2.  **Загрузка Данных на Клиент (Read):**

    - **Серверный Компонент:** Пусть Server Component (`app/page.tsx` или `domain/<domain>/ui/*.server.tsx`) выбирает данные сущности (включая `version`) из БД через соответствующий **репозиторий** (`domain/<domain>/data/*.repo.server.ts`).
    - **Пропсы:** Передавай _полный_ объект сущности как `prop` (`initial<Entity>`) в **клиентский компонент формы** (`domain/<domain>/ui/*.client.tsx`).

3.  **Управление "Черновиком" Объекта на Клиенте (Client-Side State):**

    - **Инструмент:** В клиентском компоненте формы (`domain/<domain>/ui/*.client.tsx`) используй **React Hook Form** (рекомендуется) или **Zustand** (`domain/<domain>/lib/<entity>-draft-store.ts`) для создания и управления "черновиком" объекта.
    - **Инициализация:** Инициализируй черновик данными, полученными через пропсы (`initial<Entity>`).
    - **Мгновенный Отклик:** Все изменения, вносимые пользователем, должны модифицировать только этот "черновик" в памяти клиента. **Запросов на сервер при каждом изменении быть не должно.**
    - **Клиентская Валидация:** Используй Zod-схемы (`domain/<domain>/model/*.schema.ts`) для мгновенной валидации ввода на клиенте.

4.  **Сохранение Данных на Сервере (Write):**

    - **Атомарная Отправка:** При действии "Сохранить", выполни финальную клиентскую валидацию "черновика" объекта. Затем вызови соответствующий **Server Action** (`domain/<domain>/features/crud.server.ts` или специфический `save<Entity>.server.ts`).
    - **Передача:** Передай _весь_ "черновик" объекта (включая `id` и текущее поле `version`) в Server Action.
    - **Серверный Action:** Должен выполнить серверную валидацию и вызвать метод `update` соответствующего **репозитория** (`domain/<domain>/data/*.repo.server.ts`), передавая `id`, данные и **ожидаемую `version`**.
    - **Репозиторий:** Метод `update` должен использовать **оптимистичную блокировку**: обновить запись только если `id` и `version` соответствуют текущим в БД, и инкрементировать `version` в БД. В случае конфликта (версия не совпала), выбросить `OptimisticLockingError` (`shared/lib/errors.shared.ts`).

5.  **Разрешение Конфликтов (UX):**
    - Клиентский компонент формы должен использовать `useActionState` (или аналогичный механизм) для отслеживания результата Server Action.
    - При получении `OptimisticLockingError`, отобрази пользователю понятный UI-диалог с опциями:
      - "Отменить мои изменения / Обновить" (сбросить форму и загрузить последнюю версию из БД).
      - "Перезаписать" (с подтверждением, повторно отправить запрос, используя _актуальную_ версию, полученную из ошибки конфликта, чтобы переопределить чужие изменения).

**💡 Важно:**

- **Сервер - Источник Истины:** Всегда помни, что окончательная валидация и бизнес-логика выполняются на сервере. Клиентская логика - для UX.
- **Производительность:** Для очень больших объектов с глубокой вложенностью данных, рассмотри частичную загрузку/сохранение или оптимизацию DTO, чтобы не передавать избыточные данные.
