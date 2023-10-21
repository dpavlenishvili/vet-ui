import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperCardComponent } from '@vet/ui/card';

@Component({
    selector: 'lib-features-registration',
    standalone: true,
    imports: [CommonModule, WrapperCardComponent],
    templateUrl: './features-registration.component.html',
    styleUrls: ['./features-registration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesRegistrationComponent {}
