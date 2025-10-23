import { ChangeDetectionStrategy, Component, computed, inject, input, signal, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { ButtonComponent, vetIcons } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { GeneralsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { InputVersion } from '../input';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'vet-eduaction-standarts',
  templateUrl: './eduaction-standarts.component.html',
  styleUrls: ['./eduaction-standarts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KENDO_TEXTBOX, KENDO_DIALOG, KENDO_LABEL, KENDO_SVGICON, KENDO_LOADER, ButtonComponent, TranslocoPipe],
})
export class EduactionStandartsComponent implements ControlValueAccessor {
  version = input<InputVersion>('thin');
  placeholder = input('');
  vetIcons = vetIcons;
  expandedItems = new Set<number | undefined>();

  isDisabled = signal(false);
  hasError = signal(false);
  isDialogOpen = signal(false);

  educationStandards = rxResource({
    loader: () => this.generalsService.getIsceds().pipe(map((response) => response.data)),
  });

  selectedCodes = new Set<string>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  generalsService = inject(GeneralsService);

  errorMessage = computed(() => {
    const control = this.ngControl?.control;

    if (!control?.errors) return '';
    const errors = control.errors;
    const keys = Object.keys(errors);
    const error = keys.find((key) => errors[key]) ?? 'required';
    return `errors.${error}`;
  });

  writeValue(value: string[] | null): void {
    this.selectedCodes.clear();
    if (Array.isArray(value)) {
      value.forEach((v) => this.selectedCodes.add(v));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  openDialog() {
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
    this.onTouched();
  }

  toggleChildren(id: number | undefined, event: Event): void {
    event.stopPropagation();
    if (this.expandedItems.has(id)) this.expandedItems.delete(id);
    else this.expandedItems.add(id);
  }

  isExpanded(id: number | undefined): boolean {
    return this.expandedItems.has(id);
  }

  selectItem(item: any, event: Event) {
    event.stopPropagation();

    const isChecked = this.selectedCodes.has(item.code);

    if (isChecked) {
      this.deselectRecursive(item);
    } else {
      this.selectRecursive(item);
    }

    this.onChange(Array.from(this.selectedCodes));
  }

  private selectRecursive(item: any): void {
    this.selectedCodes.add(item.code);
    if (item.children) {
      item.children.forEach((child: any) => this.selectRecursive(child));
    }
  }

  private deselectRecursive(item: any): void {
    this.selectedCodes.delete(item.code);
    if (item.children) {
      item.children.forEach((child: any) => this.deselectRecursive(child));
    }
  }

  isSelected(item: any): boolean {
    return this.selectedCodes.has(item.code);
  }

  getSelectedTitles(): string {
    const standards = this.educationStandards.value() ?? [];
    const all = this.flattenItems(standards);
    return all
      .filter((i: any) => this.selectedCodes.has(i.code))
      .map((i: any) => i.title)
      .join(', ');
  }

  private flattenItems(items: any[]): any[] {
    return items.flatMap((i: any) => [i, ...(i.children ? this.flattenItems(i.children) : [])]);
  }
}
