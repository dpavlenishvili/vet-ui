import {FormGroup} from '@angular/forms';
import {TemplateRef} from '@angular/core';

export interface Criteria {
  id?: number | undefined;
  name?: string | undefined;
  min_score?: number | undefined;
  max_score?: number | undefined;
  order?: number | undefined;
  score?: number | undefined;
}

export interface ScorePayload {
  admission?: number;
  program?: number;
  scores?: {
    criteria_id?: number;
    score?: number;
  }[];
}

export interface StepDefinition {
  label: string;
  title: string;
  form: () => FormGroup;
  template: TemplateRef<void>;
  path: string;
}

export interface StepBody<P = unknown> {
  step: string;
  body: {
    id: string;
    payload: P;
  };
}
