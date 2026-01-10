import { ChangeDetectionStrategy, Component, computed, inject, input, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { GeneralsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { vetIcons } from '@vet/shared/icons';
import { ButtonComponent, InputVersion } from '@vet/shared';

@Component({
  selector: 'vet-education-standards',
  templateUrl: './education-standards.component.html',
  styleUrls: ['./education-standards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KENDO_TEXTBOX, KENDO_DIALOG, KENDO_LABEL, KENDO_SVGICON, KENDO_LOADER, ButtonComponent, TranslocoPipe],
})
export class EducationStandardsComponent implements ControlValueAccessor {
  version = input<InputVersion>('thin');
  placeholder = input('');
  vetIcons = vetIcons;

  expandedItems = new Set<number | undefined>();
  isDisabled = signal(false);
  hasError = signal(false);
  isDialogOpen = signal(false);

  educationStandards = rxResource({
    loader: () => this.generalsService.getNqf().pipe(map((response) => response.data)),
  });

  // Changed to signal for better reactivity
  selectedCodes = signal(new Set<string>());

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string[] | null) => void = () => {};
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

  writeValue(value: string[] | null | Record<number, string>): void {
    const newSet = new Set<string>();

    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => newSet.add(v));
      } else if (typeof value === 'object') {
        Object.values(value).forEach((v) => newSet.add(v));
      }
    }

    this.selectedCodes.set(newSet);
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
    const currentCodes = this.selectedCodes();
    const isChecked = currentCodes.has(item.code);

    const newCodes = new Set(currentCodes);

    if (isChecked) {
      this.deselectRecursive(item, newCodes);
    } else {
      this.selectRecursive(item, newCodes);
    }

    this.selectedCodes.set(newCodes);
    const codesArray = Array.from(newCodes);
    this.onChange(codesArray.length > 0 ? codesArray : null);
  }

  private selectRecursive(item: any, codesSet: Set<string>): void {
    codesSet.add(item.code);
    if (item.children) {
      item.children.forEach((child: any) => this.selectRecursive(child, codesSet));
    }
  }

  private deselectRecursive(item: any, codesSet: Set<string>): void {
    codesSet.delete(item.code);
    if (item.children) {
      item.children.forEach((child: any) => this.deselectRecursive(child, codesSet));
    }
  }

  isSelected(item: any): boolean {
    return this.selectedCodes().has(item.code);
  }

  getSelectedTitles(): string {
    const standards = this.educationStandards.value() ?? [];
    const all = this.flattenItems(standards);
    const currentCodes = this.selectedCodes();

    return all
      .filter((i: any) => currentCodes.has(i.code))
      .map((i: any) => i.title)
      .join(', ');
  }

  private flattenItems(items: any[]): any[] {
    return items.flatMap((i: any) => [i, ...(i.children ? this.flattenItems(i.children) : [])]);
  }
}
