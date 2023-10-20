import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesRegistrationComponent } from './features-registration.component';

describe('FeaturesRegistrationComponent', () => {
    let component: FeaturesRegistrationComponent;
    let fixture: ComponentFixture<FeaturesRegistrationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeaturesRegistrationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeaturesRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
