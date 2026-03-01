import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface MedicineRow {
  medicine_name: string;
  quantity: number;
  dosage?: string;
  notes?: string;
}

const defaultRow: MedicineRow = {
  medicine_name: '',
  quantity: 1,
  dosage: '',
  notes: '',
};

export function MedicineList() {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Liste des médicaments</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ...defaultRow })}
          aria-label="Ajouter un médicament"
        >
          <Plus className="size-4" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-border bg-card p-4 space-y-3"
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Médicament {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => remove(index)}
                aria-label={`Supprimer le médicament ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor={`items.${index}.medicine_name`} className="sr-only">
                  Nom du médicament
                </Label>
                <Input
                  id={`items.${index}.medicine_name`}
                  placeholder="Nom du médicament"
                  {...register(`items.${index}.medicine_name`, { required: 'Requis' })}
                />
                {errors?.items?.[index]?.medicine_name && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {(errors.items[index] as { medicine_name?: { message?: string } })?.medicine_name?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`items.${index}.quantity`} className="sr-only">
                  Quantité
                </Label>
                <Input
                  id={`items.${index}.quantity`}
                  type="number"
                  min={1}
                  placeholder="Qté"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })}
                />
              </div>
              <div>
                <Label htmlFor={`items.${index}.dosage`} className="sr-only">
                  Dosage
                </Label>
                <Input
                  id={`items.${index}.dosage`}
                  placeholder="Dosage (ex. 500mg)"
                  {...register(`items.${index}.dosage`)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`items.${index}.notes`} className="sr-only">
                Notes
              </Label>
              <Input
                id={`items.${index}.notes`}
                placeholder="Notes optionnelles"
                {...register(`items.${index}.notes`)}
              />
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun médicament. Cliquez sur &quot;Ajouter&quot; pour commencer.
        </p>
      )}
    </div>
  );
}
