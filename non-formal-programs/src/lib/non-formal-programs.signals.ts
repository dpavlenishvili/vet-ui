import { Type } from '@angular/core';
import { trans, useDialog } from '@vet/shared';

export interface NonFormalProgramDialogInputs {
  programId: number;
  showGallery: boolean;
  showVideo: boolean;
}

export function useNonFormalProgramDialog(component: Type<any>) {
  return useDialog<NonFormalProgramDialogInputs>({
    title: trans('non_formal.program_description'),
    component,
    width: '90%',
    height: '90%',
    inputs: {
      showGallery: false,
      showVideo: false,
      programId: 0,
    },
  });
}
