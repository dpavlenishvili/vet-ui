import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { useRouteParam, vetIcons } from '@vet/shared';
import { ProgramsService } from '@vet/backend';
import { map } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-program',
  imports: [CommonModule, KENDO_ICONS, TranslocoPipe],
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramComponent {
  programsService = inject(ProgramsService);
  programId$ = useRouteParam('programId');

  vetIcons = vetIcons;
  program$ = this.getProgram();
  admission = true;

  getProgram() {
    return this.programId$.pipe(
      map(() => ({
        program_name: 'განათლება',
        program_code: '2214',
        education_level: '5',
        program_kind: 'მომზადება',
        program_duration: '17 თვე',
        specialization_name: 'ბიზნესი და ადმინისტრირება',
        type: 'გასაუბრება',
        description: 'სრული ზოგადი განათლება, ასაკი 18 წელი',
        address: 'გლდანი-ნაძალადევი, ქ. თბილისი, ილია ვეკუას ქუჩა, №44',
        partners: [
          {
            id: 1,
            name: 'შპს სქაინეთი',
            size: 'მცირე',
            sector: 'სოფლის მეურნეობა და თევზჭერა',
          },
          {
            id: 2,
            name: 'შპს კომპიუტერული ტექნოლოგიების აკადემია სი თი ეი',
            size: 'დიდი',
            sector: 'ვაჭრობა',
          },
        ],
        summary:
          'ბუღალტრული აღრიცხვის პროგრამაზე სტუდენტი შეისწავლის ფინანსური ოპერაციების განხორციელებას, აუდიტირებასა და აღრიცხვას. ბუღალტრული აღრიცხვის კურსდამთავრებულს შეუძლია დასაქმდეს კერძო და საჯარო უწყებებში, არასამთავრობო ორგანიზაციებში საბუღალტრო და საფინანსო სამსახურებში, აუდიტორულ და საკონსულტაციო კომპანიებში მთავარ ბუღალტრად, ბუღალტრის თანაშემწედ/ასისტენტად, ბუღალტერ-მოანგარიშედ. შესაძლებელია თვითდასაქმებაც, კერძო პროფესიული პრაქტიკის განხორციელების გზით. პროგრამის დასრულების შემდეგ კურსდამთავრებულს შეეძლება : 1. შეიმუშაოს სააღრიცხვო პოლიტიკა 2. შეავსოს და არგუმენტირება გაუკეთოს სამუშაო ფორმებს (სააღრიცხვო დოკუმენტები) 3. აწარმოოს ბუღალტრული ოპერაციები 4. შეავსოს და გააგზავნოს დეკლარაციები 5. მოამზადოს ფინანსური ანგარიშგება 6. აწარმოოს ბუღალტრული აღრიცხვა ეკონომიკური საქმიანობის ზოგიერთი სახეობის მიხედვით 7. აწარმოოს კონტროლი სამეურნეო სუბიექტის საბუღალტრო აღრიცხვაზე 8. აწარმოოს მმართველობითი აღრიცხვა შეასრულოს ეკონომიკური ანალიზი.',
        admission: [
          {
            id: 1,
            registrationStart: '11.01.2023',
            registrationEnd: '02.01.2024',
            tuitionStartDate: '11.07.2023',
            numberOfVacantPositions: '10',
            tuitionFee: 2000,
            grantStatus: 'ნაწილობრივ',
            listenerFee: 1000,
          },
          {
            id: 2,
            registrationStart: '11.01.2023',
            registrationEnd: '02.01.2024',
            tuitionStartDate: '11.07.2023',
            numberOfVacantPositions: '11',
            tuitionFee: 1000,
            grantStatus: 'კი',
            listenerFee: '-',
          },
          {
            id: 3,
            registrationStart: '11.01.2023',
            registrationEnd: '02.01.2024',
            tuitionStartDate: '11.07.2023',
            numberOfVacantPositions: '20',
            tuitionFee: 3000,
            grantStatus: 'ნაწილობრივ',
            listenerFee: 3000,
          },
          {
            id: 4,
            registrationStart: '11.01.2023',
            registrationEnd: '02.01.2024',
            tuitionStartDate: '11.07.2023',
            numberOfVacantPositions: '20',
            tuitionFee: 2000,
            grantStatus: 'კი',
            listenerFee: 0,
          },
        ],
      })),
    );
  }
}
