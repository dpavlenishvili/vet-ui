import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VacancyResource } from '@vet/backend';

@Injectable({
  providedIn: 'root',
})
export class AddVacancyService {
  positionTypes = [
    { id: 0, text: 'პროფესორი' },
    { id: 1, text: 'მასწავლებელი' },
  ];
  modulslist = [
    { id: 0, text: 'პროფესორი' },
    { id: 1, text: 'მასწავლებელი' },
    { id: 2, text: 'პროფესორი 2' },
    { id: 3, text: 'მასწავლებელი 3' },
  ];

  positions = [
    { id: 0, text: 'პროფესორი' },
    { id: 1, text: 'მასწავლებელი' },
  ];

  contactPersons = [
    { id: 0, text: 'ნინო ბერიძე' },
    { id: 1, text: 'ლაშა კახიძე' },
  ];

  addresses = ['თბილისი', 'ბათუმი'];

  programsList = [
    { id: 0, text: 'IT პროგრამა' },
    { id: 1, text: 'გრაფიკული დიზაინი' },
  ];

  listItems = [
    { id: 0, text: 'პროფესორი' },
    { id: 1, text: 'მასწავლებელი' },
    { id: 2, text: 'პროკურირ' },
  ];

  readonly addPositionFormGroup: FormGroup = new FormGroup({
    position_type: new FormControl<number | null>(null, Validators.required),
    position: new FormControl<string | null>(null, Validators.required),
    contact_person: new FormControl<number | null>(null, Validators.required),
    start_date: new FormControl<string | null>(null, Validators.required),
    address: new FormControl<string | null>(null, Validators.required),
    teaching_professional_programs: new FormControl(false),
    teaching_short_term_programs: new FormControl(false),
    modules: new FormControl<number[] | null>(null),
    programs: new FormControl<number[] | null>(null),
  });
  readonly agreementFormGroup: FormGroup = new FormGroup({
    hourly_pay_from: new FormControl<string | null>(null, Validators.required),
    hourly_pay_to: new FormControl<string | null>(null, Validators.required),
    hourly_workload_from: new FormControl<string | null>(null, Validators.required),
    hourly_workload_to: new FormControl<string | null>(null, Validators.required),
    publish_date: new FormControl<Date | null>(null, Validators.required),
    deadline_date: new FormControl<Date | null>(null, Validators.required),
  });
  readonly extraDetailsForm: FormGroup = new FormGroup({
    selection_stages: new FormControl<number[] | null>(null, Validators.required),
    vacant_places: new FormControl('', Validators.required),
    work_format: new FormControl<number | null>(null, Validators.required),
    optional_requirements: new FormControl('', Validators.required),
    responsibilities: new FormControl('', Validators.required),
    essential_requirements: new FormControl('', Validators.required),
    basic_requirements: new FormControl('', Validators.required),
    additional_information: new FormControl('', Validators.required),
    obtaining_authorization: new FormControl(false),
  });

  resetAllForms(): void {
    this.addPositionFormGroup.reset();
    this.agreementFormGroup.reset();
    this.extraDetailsForm.reset();
  }

  patchAllForms(data: VacancyResource): void {
    this.addPositionFormGroup.patchValue(data);
    this.agreementFormGroup.patchValue(data);
    this.extraDetailsForm.patchValue(data);
  }
}
