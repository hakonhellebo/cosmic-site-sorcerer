import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SurveyQuestion } from '@/hooks/useSurveyQuestions';

interface QuestionRendererProps {
  question: SurveyQuestion;
  value: any;
  onChange: (questionId: string, value: string | string[] | number) => void;
  error?: string;
}

/* ─── Searchable multi-select with chips ─── */
interface MultiSelectSearchProps {
  options: { value: string; label: string }[];
  selected: string[];
  maxSelect?: number | null;
  onChange: (next: string[]) => void;
  placeholder?: string;
}

const MultiSelectSearch: React.FC<MultiSelectSearchProps> = ({
  options,
  selected,
  maxSelect,
  onChange,
  placeholder = 'Søk...',
}) => {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      if (maxSelect && selected.length >= maxSelect) {
        // Replace oldest
        onChange([...selected.slice(1), value]);
      } else {
        onChange([...selected, value]);
      }
    }
  };

  const remove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const labelFor = (val: string) =>
    options.find((o) => o.value === val)?.label ?? val;

  return (
    <div className="space-y-2 mt-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((val) => (
            <Badge key={val} variant="secondary" className="pr-1 gap-1 text-xs">
              {labelFor(val)}
              <button
                type="button"
                onClick={() => remove(val)}
                className="ml-0.5 rounded-sm opacity-70 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className="text-muted-foreground">
              {selected.length === 0
                ? placeholder
                : `${selected.length} valgt${maxSelect ? ` (maks ${maxSelect})` : ''}`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList className="max-h-[260px]">
              <CommandEmpty>Ingen treff</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      toggle(opt.value);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected.includes(opt.value) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

/* ─── Main renderer ─── */
const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const { question_id, text, help_text, type, placeholder, survey_options, max_select, min_value, max_value } = question;
  const sortedOptions = [...(survey_options || [])].sort(
    (a, b) => (a.option_order || 0) - (b.option_order || 0)
  );

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(question_id, e.target.value)}
            placeholder={placeholder || ''}
            className="mt-2"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(question_id, Number(e.target.value))}
            placeholder={placeholder || ''}
            min={min_value ?? undefined}
            max={max_value ?? undefined}
            className="mt-2"
          />
        );

      case 'single_select':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(v) => onChange(question_id, v)}
            className="mt-3 space-y-2"
          >
            {sortedOptions.map((opt) => (
              <div key={opt.option_value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.option_value} id={`${question_id}-${opt.option_value}`} />
                <Label htmlFor={`${question_id}-${opt.option_value}`} className="cursor-pointer">
                  {opt.option_label || opt.option_value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multi_select': {
        const selected: string[] = Array.isArray(value) ? value : [];
        const handleToggle = (optValue: string, checked: boolean) => {
          let next: string[];
          if (checked) {
            next = [...selected, optValue];
            if (max_select && next.length > max_select) {
              next = next.slice(next.length - max_select);
            }
          } else {
            next = selected.filter((v) => v !== optValue);
          }
          onChange(question_id, next);
        };

        return (
          <div className="mt-3 space-y-2">
            {max_select && (
              <p className="text-sm text-muted-foreground">
                Velg opptil {max_select} alternativer
              </p>
            )}
            {sortedOptions.map((opt) => (
              <div key={opt.option_value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question_id}-${opt.option_value}`}
                  checked={selected.includes(opt.option_value)}
                  onCheckedChange={(checked) => handleToggle(opt.option_value, !!checked)}
                />
                <Label htmlFor={`${question_id}-${opt.option_value}`} className="cursor-pointer">
                  {opt.option_label || opt.option_value}
                </Label>
              </div>
            ))}
          </div>
        );
      }

      case 'multi_select_search': {
        const selected: string[] = Array.isArray(value) ? value : [];
        const options = sortedOptions.map((opt) => ({
          value: opt.option_value,
          label: opt.option_label || opt.option_value,
        }));
        return (
          <div className="mt-2">
            {max_select && (
              <p className="text-sm text-muted-foreground mb-1">
                Velg opptil {max_select} alternativer
              </p>
            )}
            <MultiSelectSearch
              options={options}
              selected={selected}
              maxSelect={max_select}
              onChange={(next) => onChange(question_id, next)}
              placeholder={placeholder || 'Søk og velg...'}
            />
          </div>
        );
      }

      case 'scale_1_5': {
        const min = min_value ?? 1;
        const max = max_value ?? 5;
        const current = typeof value === 'number' ? value : min;

        // If sortedOptions has labels, render them as labels under the slider
        const hasLabels = sortedOptions.length >= 2;
        const minLabel = hasLabels ? (sortedOptions[0]?.option_label || String(min)) : String(min);
        const maxLabel = hasLabels ? (sortedOptions[sortedOptions.length - 1]?.option_label || String(max)) : String(max);

        return (
          <div className="mt-3 space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{minLabel}</span>
              <span>{maxLabel}</span>
            </div>
            <Slider
              value={[current]}
              onValueChange={([v]) => onChange(question_id, v)}
              min={min}
              max={max}
              step={1}
              className="w-full"
            />
            <p className="text-center font-medium">{current}</p>
          </div>
        );
      }

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(question_id, e.target.value)}
            placeholder={placeholder || ''}
            className="mt-2"
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <label className="block font-medium text-sm">
        {text}
        {question.required && <span className="text-destructive ml-1">*</span>}
      </label>
      {help_text && <p className="text-sm text-muted-foreground">{help_text}</p>}
      {renderInput()}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default QuestionRenderer;
