'use client';

import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Palette } from 'lucide-react';
import { ImagePicker } from '@/domains/catalog-files-d002';
import type { Bot as BotType } from '../../..';
import type { BotFormData, BotFormErrors } from '../types';

export function AppearanceSection(props: {
  isEditing: boolean;
  bot: BotType | null;
  formData: BotFormData;
  setFormData: React.Dispatch<React.SetStateAction<BotFormData>>;
  formErrors: BotFormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<BotFormErrors>>;
  // no actions needed anymore
}) {
  const { isEditing, bot, formData, setFormData, formErrors } = props;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Palette className="h-5 w-5" />
        Внешний вид
      </h3>

      <div className="space-y-3">
        <div>
          <Label>Аватар</Label>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded">
              {(() => {
                const currentUrl = (
                  isEditing ? formData.avatarUrl : bot?.avatarUrl
                ) as string | undefined;
                return currentUrl ? (
                  <img
                    key={currentUrl}
                    src={currentUrl}
                    alt={bot?.name || 'avatar'}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted" />
                );
              })()}
            </div>
            {isEditing && (
              <ImagePicker
                trigger={
                  <Button variant="outline" size="sm">
                    Изменить
                  </Button>
                }
                onSelectAction={(url) =>
                  setFormData((prev) => ({ ...prev, avatarUrl: url }))
                }
              />
            )}
          </div>
          {/* Upload moved inside ImagePicker dialog */}
        </div>

        <div>
          <Label htmlFor="primaryColor">Основной цвет</Label>
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="w-16 h-10"
              />
              <Input
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                placeholder="#3B82F6"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: bot?.primaryColor }}
              />
              {bot?.primaryColor}
            </div>
          )}
          {isEditing && formErrors.primaryColor && (
            <div className="text-sm text-red-500 mt-1">
              {formErrors.primaryColor}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
