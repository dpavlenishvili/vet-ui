import { UserLogin2FaResponseBody, UserLoginResponseBody } from '@vet/backend';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserAccount {
  name?: string;
  roles?: AuthRole[];
  organisation?: string;
  permissions?: AuthPermission[];
}

export type AuthRole =
  | 'Super Admin'
  | 'Default User'
  | 'Organisation';

export type AuthPermission =
  | 'viewAnyApplication'
  | 'viewApplication'
  | 'applyApplication'
  | 'viewProfessionProgram'
  | 'updateProfessionProgram'
  | 'createProfessionProgram'
  | 'deleteProfessionProgram'
  | 'viewAnyProfessionProgramRegister'
  | 'viewProfessionProgramRegister'
  | 'updateProfessionProgramRegister'
  | 'createProfessionProgramRegister'
  | 'deleteProfessionProgramRegister'
  | 'finalChoiceProfessionProgramRegister'
  | 'resultsProfessionProgramRegister'
  | 'viewAnyProfessionProgramTesting'
  | 'viewProfessionProgramTesting'
  | 'updateProfessionProgramTesting'
  | 'createProfessionProgramTesting'
  | 'deleteProfessionProgramTesting'
  | 'viewAnyProfessionProgramExamCard'
  | 'viewProfessionProgramExamCard'
  | 'updateProfessionProgramExamCard'
  | 'createProfessionProgramExamCard'
  | 'deleteProfessionProgramExamCard'
  | 'viewAnyProfessionProgramCommissionMember'
  | 'viewProfessionProgramCommissionMember'
  | 'updateProfessionProgramCommissionMember'
  | 'createProfessionProgramCommissionMember'
  | 'deleteProfessionProgramCommissionMember'
  | 'viewAnyProfessionProgramStats'
  | 'viewProfessionProgramStats'
  | 'updateProfessionProgramStats'
  | 'createProfessionProgramStats'
  | 'deleteProfessionProgramStats'
  | 'viewAnyTrainingRetraining'
  | 'viewTrainingRetraining'
  | 'updateTrainingRetraining'
  | 'createTrainingRetraining'
  | 'deleteTrainingRetraining'
  | 'viewAnyTrainingRetrainingRegister'
  | 'viewTrainingRetrainingRegister'
  | 'updateTrainingRetrainingRegister'
  | 'createTrainingRetrainingRegister'
  | 'deleteTrainingRetrainingRegister'
  | 'viewAnyTrainingRetrainingStats'
  | 'viewTrainingRetrainingStats'
  | 'updateTrainingRetrainingStats'
  | 'createTrainingRetrainingStats'
  | 'deleteTrainingRetrainingStats'
  | 'viewAnyNonFormalEducation'
  | 'viewNonFormalEducation'
  | 'updateNonFormalEducation'
  | 'createNonFormalEducation'
  | 'deleteNonFormalEducation'
  | 'viewAnyNonFormalEducationRegister'
  | 'viewNonFormalEducationRegister'
  | 'updateNonFormalEducationRegister'
  | 'createNonFormalEducationRegister'
  | 'deleteNonFormalEducationRegister'
  | 'viewAnyNonFormalEducationStats'
  | 'viewNonFormalEducationStats'
  | 'updateNonFormalEducationStats'
  | 'createNonFormalEducationStats'
;

export interface Pending2FaState {
  pid: string;
  token: string;
  maskedPhoneNumber: string;
  timestamp: number;
  isUsed: boolean;
}

export interface Credentials {
  pid: string;
  password: string;
  remember?: boolean;
}

export type AuthorizationResult = UserLoginResponseBody | UserLogin2FaResponseBody | HttpErrorResponse | Error;

export type TwoFaErrorCode =
  | 'INVALID_2FA_CODE'
  | '2FA_VALIDATION_FAILED'
  | '2FA_SESSION_EXPIRED'
  | 'INVALID_2FA_SESSION'
  | '2FA_RESEND_FAILED'
  | '2FA_CODE_EXPIRED'
  | 'UNKNOWN';

export type AuthorizationErrorCode =
  | TwoFaErrorCode
  | 'INVALID_CREDENTIALS'
  | 'TEMPORARILY_LOCKED'
  | 'UNKNOWN';

export interface TwoFaError {
  code: TwoFaErrorCode;
  error: unknown;
  attributes?: Record<string, unknown>;
}

export interface AuthorizationError {
  code: AuthorizationErrorCode;
  error: unknown;
  attributes?: Record<string, unknown>;
}
