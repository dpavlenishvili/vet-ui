import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { InfoComponent } from '@vet/shared';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vet-admission-program-result',
  imports: [GridModule, SVGIconModule, TranslocoPipe, InfoComponent, DatePipe],
  templateUrl: './admission-program-result.component.html',
  styleUrl: './admission-program-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionProgramResultComponent {
  allPrograms = signal<(any & { admissionId: number; programId: number })[]>([
    {
      select: true,
      status: 'pending',
      admissionId: 183,
      programId: 70,
      program: {
        id: 70,
        program_name: 'ელექტროობა',
        type: 'long-term',
        specialization_name: 'ელექტროობა',
        qualification_name: 'საბაზო პროფესიული კვალიფიკაცია ელექტროობაში',
        program_code: '07-0255',
        address: 'ილია ჭავჭავაძის ქ. N8',
        credits_count: '52',
        program_duration: '9',
        organisation: {
          name: 'სსიპ - კოლეჯი „ბლექსი"',
          address: 'ქ.ბათუმი, ლერმონტოვის ქ.N92 ა',
          phone: '577544457',
          email: 'info@blacksea.edu.ge',
        },
        region: {
          name: 'აჭარა',
        },
        district: {
          name: 'შუახევი',
        },
        admission: {
          registration_start_date: '2025-08-26',
          registration_end_date: '2025-08-29',
          study_start_date: '2025-11-01',
          study_end_date: '2026-06-13',
          students_limit: 5,
          program_fee: '0',
          student_fee: '0',
        },
      },
    },
    {
      select: false,
      status: 'pending',
      admissionId: 189,
      programId: 59,
      program: {
        id: 59,
        program_name: 'სასტუმრო მომსახურება',
        type: 'long-term',
        specialization_name: 'სასტუმროს მომსახურება',
        qualification_name: 'საშუალო პროფესიული კვალიფიკაცია სასტუმრო მომსახურებაში',
        program_code: '10-0029',
        address: 'მიხეილ ლერმონტოვის №92ა',
        credits_count: '80',
        program_duration: '20',
        organisation: {
          name: 'სსიპ - კოლეჯი „ბლექსი"',
          address: 'ქ.ბათუმი, ლერმონტოვის ქ.N92 ა',
          phone: '577544457',
          email: 'info@blacksea.edu.ge',
        },
        region: {
          name: 'აჭარა',
        },
        district: {
          name: 'ბათუმი',
        },
        admission: {
          registration_start_date: '2025-07-26',
          registration_end_date: '2025-07-29',
          study_start_date: '2025-11-01',
          study_end_date: '2027-08-19',
          students_limit: 5,
          program_fee: '0',
          student_fee: '0',
        },
      },
    },
    {
      select: true,
      status: 'approved',
      admissionId: 189,
      programId: 80,
      program: {
        id: 80,
        program_name: 'კომპიუტერული ქსელის ადმინისტრირება',
        type: 'long-term',
        specialization_name: 'კომპიუტერული ქსელის ადმინისტრირება',
        qualification_name: 'უმაღლესი პროფესიული კვალიფიკაცია კომპიუტერული ქსელის ადმინისტრირებაში',
        program_code: '06-0170',
        address: 'მიხეილ ლერმონტოვის №92ა',
        credits_count: '115',
        program_duration: '24',
        organisation: {
          name: 'სსიპ - კოლეჯი „ბლექსი"',
          address: 'ქ.ბათუმი, ლერმონტოვის ქ.N92 ა',
          phone: '577544457',
          email: 'info@blacksea.edu.ge',
        },
        region: {
          name: 'აჭარა',
        },
        district: {
          name: 'ბათუმი',
        },
        admission: {
          registration_start_date: '2025-08-26',
          registration_end_date: '2025-08-29',
          study_start_date: '2025-11-01',
          study_end_date: '2027-02-03',
          students_limit: 5,
          program_fee: '0',
          student_fee: '0',
        },
      },
    },
  ]);

  selectedPrograms = computed(() => this.allPrograms().filter((program) => program.select));

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'programs.status_pending';
      case 'approved':
        return 'programs.status_approved';
      case 'rejected':
        return 'programs.status_rejected';
      default:
        return 'programs.status_unknown';
    }
  }

  getPendingCount(): number {
    return this.selectedPrograms().filter((p) => p.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.selectedPrograms().filter((p) => p.status === 'approved').length;
  }
}
