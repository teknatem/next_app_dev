'use client';

import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { User } from 'lucide-react';
import { getGenderLabel } from '../../labels.shared';
import { GENDER_OPTIONS } from '../../..';
import type { Bot as BotType } from '../../..';
import type { BotFormData, BotFormErrors } from '../types';

export function BasicInfoSection(props: {
  isEditing: boolean;
  bot: BotType | null;
  formData: BotFormData;
  setFormData: React.Dispatch<React.SetStateAction<BotFormData>>;
  formErrors: BotFormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<BotFormErrors>>;
}) {
  const { isEditing, bot, formData, setFormData, formErrors, setFormErrors } =
    props;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <User className="h-5 w-5" />
        Основная информация
      </h3>

      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Имя</Label>
          {isEditing ? (
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Введите имя бота"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded">{bot?.name}</div>
          )}
          {isEditing && formErrors.name && (
            <div className="text-sm text-red-500 mt-1">{formErrors.name}</div>
          )}
        </div>

        <div>
          <Label htmlFor="gender">Пол</Label>
          {isEditing ? (
            <select
              id="gender"
              className="w-full border rounded-md h-9 px-3 bg-white"
              value={formData.gender}
              onChange={(e) => {
                setFormData({ ...formData, gender: e.target.value });
                setFormErrors((prev) => ({ ...prev, gender: undefined }));
              }}
            >
              <option value="" disabled>
                Выберите пол
              </option>
              <option value={GENDER_OPTIONS.MALE}>
                {getGenderLabel(GENDER_OPTIONS.MALE)}
              </option>
              <option value={GENDER_OPTIONS.FEMALE}>
                {getGenderLabel(GENDER_OPTIONS.FEMALE)}
              </option>
              <option value={GENDER_OPTIONS.OTHER}>
                {getGenderLabel(GENDER_OPTIONS.OTHER)}
              </option>
            </select>
          ) : (
            <div className="p-2 bg-gray-50 rounded">
              <Badge variant="outline">
                {getGenderLabel(bot?.gender || '')}
              </Badge>
            </div>
          )}
          {isEditing && formErrors.gender && (
            <div className="text-sm text-red-500 mt-1">{formErrors.gender}</div>
          )}
        </div>

        <div>
          <Label htmlFor="position">Должность</Label>
          {isEditing ? (
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="Введите должность"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded">{bot?.position}</div>
          )}
          {isEditing && formErrors.position && (
            <div className="text-sm text-red-500 mt-1">
              {formErrors.position}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="hierarchyLevel">Уровень иерархии</Label>
          {isEditing ? (
            <Input
              id="hierarchyLevel"
              type="number"
              min="1"
              max="10"
              value={formData.hierarchyLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hierarchyLevel: parseInt(e.target.value)
                })
              }
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded">
              <Badge variant="secondary">{bot?.hierarchyLevel}</Badge>
            </div>
          )}
          {isEditing && formErrors.hierarchyLevel && (
            <div className="text-sm text-red-500 mt-1">
              {formErrors.hierarchyLevel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
