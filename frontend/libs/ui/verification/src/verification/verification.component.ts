/* eslint-disable @typescript-eslint/no-empty-function,@angular-eslint/no-host-metadata-property */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    inject,
    Input,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, FormControlProvider } from '@vet/ui/form-item';
import { NgForOf, NgIf } from '@angular/common';

enum Orientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

let quantity = 0;

@Component({
    selector: 'v-ui-verification',
    standalone: true,
    template: `
        <ul class="v-ui-verification__list">
            <li
                *ngFor="let digit of codeSegments; let i = index; let first = first"
                class="v-ui-verification__list-item"
            >
                <input
                    #verificationInput
                    type="text"
                    [id]="first ? id : null"
                    (input)="onInputValueChange($event, i)"
                />
            </li>
        </ul>
        <div *ngIf="isErrorState">
            <ng-content select="v-ui-form-error"></ng-content>
        </div>
    `,
    styleUrls: ['verification.component.scss'],
    host: {
        '[class.v-ui-verification]': 'true',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: FormControlProvider,
            useExisting: forwardRef(() => VerificationComponent),
        },
    ],
    imports: [NgForOf, NgIf],
    encapsulation: ViewEncapsulation.None,
})
export class VerificationComponent extends FormControlProvider implements FormControlProvider, ControlValueAccessor {
    @ViewChildren('verificationInput') verificationInputFields!: QueryList<ElementRef>;

    @Input() id = `v-ui-verification-${++quantity}`;
    @Input() orientation: Orientation.HORIZONTAL | Orientation.VERTICAL = Orientation.HORIZONTAL;
    @Input() verified = false;

    @Input() set codeLength(value: number) {
        if (value) {
            this.codeSegments = new Array(value);
        } else {
            this.codeSegments = new Array(4);
        }
    }

    @HostBinding('class.v-ui-verification--error')
    get isErrorState() {
        if (this.ngControl.control) {
            const isErrorState = this.errorStateMatcher.isErrorState(
                this.ngControl.control,
                this.formGroupDirective || this.ngForm || null,
            );

            this.changeDetectorRef.markForCheck();

            return isErrorState;
        }

        return false;
    }

    @HostBinding('class.v-ui-verification--success')
    get isVerified() {
        return this.verified;
    }

    codeSegments: number[] = new Array(4);

    isDisabled = false;
    ngControl = inject(NgControl);
    changeDetectorRef = inject(ChangeDetectorRef);
    errorStateMatcher = inject(ErrorStateMatcher);
    formGroupDirective = inject(FormGroupDirective, { optional: true });
    ngForm = inject(NgForm, { optional: true });

    constructor() {
        super();
        this.ngControl.valueAccessor = this;
    }

    onChange: (value: string) => void = () => {};
    onTouched: () => void = () => {};

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    writeValue(value: string): void {}

    onInputValueChange(event: Event, clickedElementIndex: number) {
        let verificationNumber = '';

        // Allow only numeric characters
        const sanitizedValue = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '');

        // Limit the length to 1 digit
        if ((event.target as HTMLInputElement).value.length <= 1) {
            (event.target as HTMLInputElement).value = sanitizedValue.slice(0, 1);
        } else {
            (event.target as HTMLInputElement).value = sanitizedValue.slice(1, 2);
        }

        this.verificationInputFields.toArray().forEach((input, index) => {
            if ((event.target as HTMLInputElement).value) {
                index === clickedElementIndex + 1 && input.nativeElement.focus();
            } else {
                if (clickedElementIndex !== 0) {
                    index === clickedElementIndex - 1 && input.nativeElement.focus();
                }
            }

            verificationNumber += input.nativeElement.value;
        });

        this.onChange(verificationNumber);
        this.onTouched();
    }
}
