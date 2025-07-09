import { FileImportWidget } from '@/widgets/file-to-base-import';

export default function ImportPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Импорт данных</h1>
        <p className="text-muted-foreground">
          Импорт данных из Excel и CSV файлов
        </p>
      </div>

      <div className="max-w-4xl">
        <FileImportWidget />
      </div>
    </div>
  );
}
