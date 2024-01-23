/* eslint-disable @angular-eslint/no-host-metadata-property */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormControlProvider } from '@vet/ui/form-item';
import { NgSelectModule } from '@ng-select/ng-select';

let quantity = 0;

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'v-ui-dropdown',
    standalone: true,
    template: `
        <ng-select
            [items]="dropdownItems"
            [bindLabel]="bindLabel"
            [bindValue]="bindValue"
            (change)="onDropdownValueChange($event)"
        >
        </ng-select>
    `,
    styleUrls: ['./dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: FormControlProvider,
            useExisting: forwardRef(() => DropdownComponent),
        },
    ],
    encapsulation: ViewEncapsulation.None,
    imports: [NgSelectModule],
})
export class DropdownComponent<DropdownItem> extends FormControlProvider implements ControlValueAccessor {
    @Input() id = `v-ui-dropdown-${++quantity}`;
    @Input() placeholder?: string;
    @Input() value?: DropdownItem | DropdownItem[];
    @Input() dropdownItems!: DropdownItem[];
    @Input() bindLabel = 'name';
    @Input() bindValue = 'id';
    @Output() valueChange = new EventEmitter<DropdownItem | DropdownItem[] | undefined>();

    ngControl = inject(NgControl, { optional: true });

    protected disabled = false;
    protected _changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    onChange = (v?: DropdownItem | DropdownItem[]) => this.valueChange.emit(v);
    onTouched = Function.prototype;

    writeValue(obj: DropdownItem | DropdownItem[] | undefined): void {
        this.value = obj;
        this._changeDetectorRef.detectChanges();
    }

    registerOnChange(fn: (v?: DropdownItem | DropdownItem[]) => void): void {
        this.onChange = (v?: DropdownItem | DropdownItem[]) => {
            this.valueChange.emit(v);
            fn(v);
        };
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onDropdownValueChange(value: DropdownItem | DropdownItem[]) {
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }
}
