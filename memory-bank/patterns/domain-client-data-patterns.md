Механизм работы с объектом на клиенте, при котором форма объекта получает копию из БД, работает с ней в памяти.

---

### Реализация Механизма Работы с Объектом на Клиенте (Паттерн "Полная Копия")

**1. Загрузка Данных Сущности (Серверная Сторона)**

- **Server Component (Next.js App Router):** Именно здесь происходит первичная выборка данных. `page.tsx` или `layout.tsx` (если форма глобальная) в слое `app/` или `ui/*.server.tsx` в слое домена/виджета будет выполнять эту роль.
- **Вызов Server Action / Репозитория:** Server Component вызывает соответствующий Server Action из `domains/<domain>/features/*.server.ts` или напрямую обращается к репозиторию `domains/<domain>/data/*.repo.server.ts` для получения данных.
- **Включение Версии для Оптимистичной Блокировки:** Важно, чтобы при выборке данных из БД в объект сущности **обязательно включалось поле `version`**

  - Пример в репозитории:

    ```typescript
    // domains/document-meetings-d004/data/meetings.repo.server.ts
    import 'server-only';
    import { db } from '@/shared/database/connection';
    import { meetings } from '@/shared/database/schemas/meetings.schema';
    import { eq } from 'drizzle-orm';

    export const meetingRepositoryServer = {
      async getMeetingById(id: string) {
        const meeting = await db.query.meetings.findFirst({
          where: eq(meetings.id, id)
        });
        if (!meeting) return null;
        // Включаем 'version' в возвращаемый объект
        return { ...meeting, version: meeting.version };
      }
      // ... другие методы
    };
    ```

- **Передача на Клиент:** Полученные данные (включая `version`) передаются в качестве `props` в клиентский компонент формы.

  ```typescript
  // app/(main)/meetings/[id]/page.tsx (Server Component)
  import { meetingRepositoryServer } from "@/domains/document-meetings-d004/index.server";
  import { MeetingDetailsFormClient } from "@/domains/document-meetings-d004/ui/meeting-details-form.client";

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

- **Клиентский Компонент Формы (`domains/<domain>/ui/*.client.tsx`):** Это основной компонент, который будет управлять состоянием объекта в памяти.
- **Выбор Инструмента Управления Состоянием:**

  - **React Hook Form (рекомендовано для форм):** Отлично подходит для управления полями формы, их валидацией и сбором всех изменений. Вы можете инициализировать форму `initialMeeting` из `props`.

    ```typescript
    // domains/document-meetings-d004/ui/meeting-details-form.client.tsx
    "use client";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { meetingSchema } from "@/domains/document-meetings-d004/model/meetings.schema"; // Ваша Zod-схема
    import { useActionState } from "react";
    import { saveMeetingAction } from "@/domains/document-meetings-d004/features/crud.server"; // Ваш Server Action

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

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("title")} placeholder="Title" />
          {errors.title && <span>{errors.title.message}</span>}
          <button type="submit">Save</button>
          {state.success && <div>Saved successfully!</div>}
        </form>
      );
    }
    ```

  - **Zustand (для более сложных сценариев):** Если у вас очень сложная форма с множеством вложенных сущностей, или форма распределена по нескольким компонентам, Zustand-стор может хранить "черновик" объекта.

**3. Сохранение Данных на Сервере (Серверная Сторона)**

- **Вызов Server Action:** При нажатии кнопки "Сохранить", данные из клиентской формы (весь "черновик" объекта) передаются в Server Action.
- **Server Action (`domains/<domain>/features/*.server.ts`):** Серверная валидация, вызов репозитория с проверкой `version`, `revalidatePath`.

**4. Обработка Конфликтов на Клиенте**

- При `OptimisticLocking` показать пользователю варианты: обновить данные или перезаписать с подтверждением.
