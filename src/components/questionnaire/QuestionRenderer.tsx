import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { SurveyQuestion } from '@/hooks/useSurveyQuestions';

interface QuestionRendererProps {
  question: SurveyQuestion;
  value: any;
  onChange: (questionId: string, value: string | string[] | number) => void;
  error?: string;
}

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
            // If max_select is set, trim from the beginning
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

      case 'scale_1_5': {
        const min = min_value ?? 1;
        const max = max_value ?? 5;
        const current = typeof value === 'number' ? value : min;
        return (
          <div className="mt-3 space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{min}</span>
              <span>{max}</span>
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
