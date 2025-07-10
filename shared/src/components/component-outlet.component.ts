import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef, effect,
  inject,
  input,
  Type,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule, TooltipModule } from '@progress/kendo-angular-tooltip';
import { IconModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { isObservable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-component-outlet',
  standalone: true,
  imports: [
    GridModule,
    TooltipModule,
    PopoverModule,
    IconModule,
    SVGIconModule,
    SwitchModule,
    ButtonsModule,
    DialogsModule,
  ],
  template: `<ng-container #outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentOutletComponent<T> {
  component = input.required<Type<T> | null | unknown>();
  inputs = input<Record<string, unknown> | null | undefined>();
  outputs = input<Record<string, (event?: any) => void> | null | undefined>();

  destroyRef = inject(DestroyRef);
  viewContainerRef = viewChild('outlet', { read: ViewContainerRef });

  constructor() {
    effect(() => {
      const component = this.component();
      const inputs = this.inputs();
      const outputs = this.outputs();
      const viewContainerRef = this.viewContainerRef();

      if (viewContainerRef) {
        viewContainerRef.clear();
      }

      if (viewContainerRef && component) {
        const componentRef = viewContainerRef.createComponent(component as Type<unknown>);

        if (componentRef) {
          if (inputs) {
            Object.keys(inputs).forEach((key) => {
              componentRef.setInput(key, inputs[key]);
            });
          }

          if (outputs) {
            Object.keys(outputs).forEach((key) => {
              const callback = outputs[key];
              const output = (componentRef.instance as any)[key];

              if (typeof callback === 'function' && callback.length <= 1 && isObservable(output)) {
                output.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(callback);
              }
            });
          }
        }
      }
    });
  }
}
