/* eslint-disable @angular-eslint/no-host-metadata-property */
import {
    AfterViewInit,
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
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { FormControlProvider } from '../../form-item/form-control-provider';
import { FormItemComponent } from '../../form-item/form-item/form-item.component';
import { NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';

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
            [(ngModel)]="value"
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
    imports: [NgSelectModule, FormsModule],
})
export class DropdownComponent<DropdownItem>
    extends FormControlProvider
    implements ControlValueAccessor, AfterViewInit
{
    @Input() id = `v-ui-dropdown-${++quantity}`;
    @Input() placeholder?: string;
    @Input() value?: DropdownItem | DropdownItem[];
    @Input() dropdownItems!: DropdownItem[];
    @Input() bindLabel = 'name';
    @Input() bindValue = '';
    @Output() valueChange = new EventEmitter<DropdownItem | DropdownItem[] | undefined>();

    ngControl = inject(NgControl, { optional: true });
    private formItem = inject(FormItemComponent, { optional: true });

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

    ngAfterViewInit() {
        if (this.formItem) {
            this.formItem.paddingless = true;
        }
    }

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
        if (this.bindValue) {
            if (Array.isArray(value)) {
                const modifiedValue = [];

                value.forEach((item) => {
                    modifiedValue.push(_.get(item, this.bindValue));
                });
            } else {
                this.value = _.get(value, this.bindValue);
            }
        } else {
            this.value = value;
        }
        this.onChange(this.value);
        this.onTouched();
    }
}
