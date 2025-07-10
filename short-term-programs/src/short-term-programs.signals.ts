import { trans, useDialog } from '@vet/shared';
import { ShortProgramPageComponent } from './short-program-page/short-program-page.component';

export function useProgramDialog() {
  return useDialog<{ programId: number, showGallery: boolean }>({
    title: trans('shorts.program_description'),
    component: ShortProgramPageComponent,
    width: '90%',
    height: '90%',
    inputs: {
      showGallery: false,
    },
  });
}
