import { inject } from '@angular/core';
import { PROGRAMS_ENVIRONMENT } from './programs.tokens';
import { ProgramsEnvironment } from './programs.types';

export function useProgramsEnvironment(): ProgramsEnvironment {
  return inject<ProgramsEnvironment>(PROGRAMS_ENVIRONMENT);
}
