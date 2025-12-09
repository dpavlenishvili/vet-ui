export interface OrganisationFilters {
  search?: string;
  id?: number;
  name?: string;
  org_type?: string;
  institution_type_id?: string;
  per_page?: number;
  page?: number;
  region?: number;
  district?: number;
}

export interface Organisation {
  id?: number;
  name?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  org_type?: string;
  institution_type_id?: string;
  main_image?: string;
  is_authorized?: boolean;
  has_nf_programs?: boolean;
  has_retraining_programs?: boolean
}

export interface OrganisationLinks {
  first?: string;
  last?: string;
  prev?: string | null;
  next?: string | null;
}

export interface OrganisationMeta {
  current_page?: number;
  from?: number;
  last_page?: number;
  links?: {
    url?: string | null;
    label?: string;
    active?: boolean;
  }[];
  path?: string;
  per_page?: number;
  to?: number;
  total?: number;
}

export interface OrganisationResponse {
  data?: Organisation[];
  links?: OrganisationLinks;
  meta?: OrganisationMeta;
}
