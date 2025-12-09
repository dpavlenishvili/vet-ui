export interface NonFormalProgramFilters {
  search?: string | null;
  organisation?: number | null;
  isced_code?: string[] | null;
  region?: number | null;
  district?: number | null;
  registration_start_from?: string | Date | null;
  registration_start_to?: string | Date | null;
}
