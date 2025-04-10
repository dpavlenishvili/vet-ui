export interface Criteria {
  id?: number | undefined;
  name?: string | undefined;
  min_score?: number | undefined;
  max_score?: number | undefined;
  order?: number | undefined;
  score?: number | undefined;
};

export interface ScorePayload {
  admission?: number;
  program?: number;
  scores?: {
    criteria_id?: number;
    score?: number;
  }[];
};
