export interface AdmissionRequest {
  /**
   * Program IDS
   * @default "[1,2,3]"
   */
  program_ids: number[];
  /**
   * Education level
   * @default "Education"
   */
  education: string;
  /**
   * District ID
   * @default 1
   */
  district_id: number;
  /**
   * Language code
   * @default "KA"
   */
  language: string;
  /** PDF base 64 code */
  doc?: {
    /**
     * File id
     * @example "1"
     */
    id?: number;
    /**
     * File name
     * @example "filename.jpg"
     */
    filename?: string;
    /**
     * Base64 encoded file content
     * @example "base64"
     */
    base64?: string;
  }[];
  /** (Spec Education) if checked then pass value */
  spec_edu?: boolean;
  /**
   * (Spec Education) if checked then pass value
   * @default "name of contact person"
   */
  e_name?: string;
  /**
   * (Spec Education) if checked then pass value
   * @default "last name of contact person"
   */
  e_lastname?: string;
  /**
   * (Spec Education) if checked then pass value
   * @default "email of contact person"
   */
  e_email?: string;
  /**
   * (Spec Education) if checked then pass value
   * @default "phone number of contact person"
   */
  e_phone?: string;
  /**
   * (Spec Education) if checked then pass value
   * @default "special education description"
   */
  spe_description?: string;
  /**
   * (translate) if checked then pass value
   * @default "translate language"
   */
  translate?: string;
  /**
   * (translate) if checked then pass value of select box
   * @default "translate select value"
   */
  translate_select?: string;
  /** (Spec Environment) If checked, then pass value for the environments like lift and ramp. */
  spec_env?: string[];
  /** (Abroad pass any education) if checked then pass value */
  abroad_doc?: {
    /**
     * File id
     * @example "1"
     */
    id?: number;
    /**
     * File name
     * @example "filename.jpg"
     */
    filename?: string;
    /**
     * Base64 encoded file content
     * @example "base64"
     */
    base64?: string;
  }[];
  /** (Occupied region pass any education) if checked then pass value */
  ocu_doc?: {
    /**
     * File id
     * @example "1"
     */
    id?: number;
    /**
     * File name
     * @example "filename.jpg"
     */
    filename?: string;
    /**
     * Base64 encoded file content
     * @example "base64"
     */
    base64?: string;
  }[];
  /**
   * Send 'registered' if user finishes the flow
   * @default "registered"
   */
  status?: string;
  /** (Spec Education) if checked then pass value */
  complete_edu_abroad?: boolean;
  /** (Spec Education) if checked then pass value */
  complete_base_edu_abroad?: boolean;
  /** User education level text */
  education_level?: string;
  /** User education level id */
  education_level_id?: number;
}

export interface ApplicationRequest {
  /**
   * Admission IDS
   * @default "[1,2,3]"
   */
  admission_ids: number[];
  /**
   * Education level id
   * @example "1"
   */
  education_level_id?: string;
}

export interface Admission {
  admission_id?: number;
  min_allowed_education_level_id?: MinAllowed;
  min_allowed_age?: string;
  program_fee?: string;
  student_fee?: string;
  has_college_exam?: boolean;
  financing_type_id?: number;
  financing_type?: number;
  registration_start_date?: string;
  registration_end_date?: string;
  study_start_date?: number;
  study_end_date?: string;
  students_limit?: number;
  inclusive_students_limit?: number;
  exam_language_id?: number;
  is_universal?: boolean;
  other_requirements?: string;
  step?: string;
  funded_method?: string;
  /**
   * Selection
   * Relations of selection
   */
  selection?: Selection[];
}

export interface AdmissionProgramReq {
  /**
   * Programs
   * Relations to programs
   */
  data?: AdmissionPrograms[];
}

export interface AdmissionPrograms {
  select?: boolean;
  status?: string;
  program?: LongTerm;
  result?: UserRatings;
}

export interface AdmissionReq {
  id?: number;
  code?: string;
  /** User model */
  user?: User;
  education?: IdName;
  district?: IdName;
  language?: IdName;
  doc?: File[];
  spec_edu?: boolean;
  e_name?: string;
  e_phone?: string;
  e_email?: string;
  e_lastname?: string;
  spe_description?: string;
  spec_env?: string[];
  abroad_doc?: File[];
  ocu_doc?: File[];
  complete_edu_abroad?: boolean;
  complete_base_edu_abroad?: boolean;
  number?: string;
  education_level?: string;
  education_level_id?: number;
  translate?: string;
  rofficer_status?: string;
  rofficer_doc?: string;
  translate_select?: string;
  actions?: KeyVal;
  status?: KeyVal;
  /**
   * Programs
   * Relations to programs
   */
  programs?: AdmissionPrograms[];
}

export interface ApplicantCollection {
  id?: number;
  /** User model */
  user?: User;
  regions?: number[];
  institutions?: number[];
  fields?: number[];
  positions?: number[];
  created_at?: string;
}

export interface ApplicationResource {
  id?: number;
  positions?: number[];
  regions?: number[];
  institutions?: number[];
  fields?: number[];
  allow_email_notifications?: boolean;
  allow_review_personal_page?: boolean;
  file?: string;
}

export interface CardPrograms {
  programs?: LongTerm;
  start_at?: string;
  address?: string;
  name?: string;
  sector?: string;
  reg_code?: string;
}

export interface CardProgramsType {
  naec?: CardPrograms[];
  other?: CardPrograms[];
}

/**
 * Collection Item
 * Collection Item
 */
export interface Collection {
  /**
   * ID
   * ID
   * @example "1"
   */
  id?: number;
  /**
   * name
   * name
   */
  name?: string;
  /**
   * type
   * type
   */
  type?: string;
}

/**
 * Collection Item
 * Collection Item
 */
export interface CollectionItem {
  /**
   * ID
   * ID
   * @example "1"
   */
  id?: number;
  /**
   * Slug
   * Slug
   * @example "contact-us"
   */
  slug?: string;
  /**
   * Title
   * Item title
   * @example "naxes ucxo moyme vinme"
   */
  title?: string;
  /**
   * Meta title
   * Page meta title
   * @example "naxes ucxo moyme vinme"
   */
  meta_title?: string;
  /**
   * Content
   * Page content
   * @example "<p>Hello world</p>"
   */
  content?: string;
  /**
   * Meta description
   * Page meta description
   * @example "Hello world"
   */
  meta_description?: string;
  /**
   * Image
   * MPage main banner/poster
   * @example "http://..."
   */
  image?: string;
  /**
   * Create at
   * Page creation date time
   * @example "2024-12-30 13:00:00"
   */
  created_at?: string;
  /**
   * Pin
   * Pinned items
   */
  pin?: boolean;
}

export interface CommissionResult {
  completed?: boolean;
  /** User model */
  commission_member?: User;
}

export interface CommissionReview {
  id?: number;
  select?: boolean;
  program_name?: string;
  status?: string;
  created_at?: string;
  /** User model */
  user?: User;
  program?: LongTerm;
  admission?: AdmissionReq;
  reviews?: CommissionResult[];
  criteria?: CriteriaResult[];
}

export interface CommissionReviews {
  results?: CommissionResult;
}

export interface CommissionScore {
  id?: number;
  program_type?: string;
  name?: string;
  weight?: string;
  min_score?: string;
  max_score?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
  score?: number;
}

export interface CommissionsReview {
  data?: CommissionReview[];
  filters?: {
    /**
     * Filters applied to admissions.
     * @example "text"
     */
    type?: string;
    /** @example null */
    selected?: string | null;
    /** @example "program_name" */
    key?: string;
    /** @example "*" */
    values?: string;
  }[];
}

export interface CriteriaResult {
  id?: number;
  name?: string;
  /** @format float */
  min_score?: number;
  /** @format float */
  max_score?: number;
  order?: number;
}

export interface File {
  id?: number;
  file_name?: string;
  path?: string;
  download_url?: string;
  extension?: string;
  base64?: string;
}

export interface IdName {
  id?: number;
  name?: string;
}

export interface Isced {
  name?: string;
  code?: string;
}

export interface KeyVal {
  key?: string;
}

export interface LongTerm {
  id?: number;
  path?: string;
  program_name?: string;
  type?: string;
  program_id?: number;
  specialization_code?: string;
  specialization_name?: string;
  specialization?: Specialisation;
  isced_code?: string;
  isced_description?: string;
  qualification_name?: string;
  program_code?: string;
  program_kind?: IdName;
  address?: string;
  credits_count?: string;
  credits_count_non_geo?: string;
  education_level?: IdName;
  language_id?: number;
  is_integrated?: boolean;
  region?: IdName;
  district?: IdName;
  program_duration?: string;
  program_duration_non_geo?: string;
  description?: string;
  partner?: string;
  video_url?: string | null;
  is_eligible?: boolean | null;
  registered?: RegistereCount;
  gallery?: string[] | null;
  /**
   * partners
   * Relations of partners
   */
  partners?: ProgramPartner[];
  organisation?: object;
  admission?: Admission;
  isced?: Isced;
}

export interface MediaItem {
  /** @example "/uploads/1/sample-Document.pdf"," */
  url?: string;
  /** @example "Sample Document.pdf" */
  name: string;
  /** @example "application/pdf" */
  mime_type?: string;
  /** @example "1000" */
  size?: number;
  /** @example "1" */
  order_column?: number;
}

export interface MenuItem {
  /** @example "1" */
  id: number;
  /** @example "Top menu" */
  name: string;
}

export interface MinAllowed {
  name?: string;
}

export interface NonFormal {
  id?: number;
  isced?: string;
  isced_code?: string;
  registration_is_progress?: boolean;
  /** Details of the organisation */
  organisation?: {
    /**
     * Organisation ID
     * @example 10
     */
    id?: number;
    /**
     * Organisation name
     * @example "Example Organisation"
     */
    name?: string;
    /**
     * Organisation email
     * @example "test@gmail.com"
     */
    email?: string;
    /**
     * Organisation phone
     * @example "1131243213"
     */
    phone?: string;
    /**
     * Organisation website
     * @example "test.com"
     */
    website?: string;
    /**
     * Organisation address
     * @example "test address"
     */
    address?: string;
  };
}

export interface NonFormalShow {
  id?: number;
  isced?: string;
  isced_code?: string;
  announced_isced_code?: string;
  announced_isced_title?: string;
  gallery?: string[] | null;
  /** Details of the organisation */
  organisation?: {
    /**
     * Organisation ID
     * @example 10
     */
    id?: number;
    /**
     * Organisation name
     * @example "Example Organisation"
     */
    name?: string;
    /**
     * Organisation email
     * @example "test@gmail.com"
     */
    email?: string;
    /**
     * Organisation phone
     * @example "1131243213"
     */
    phone?: string;
    /**
     * Organisation website
     * @example "test.com"
     */
    website?: string;
    /**
     * Organisation address
     * @example "test address"
     */
    address?: string;
  };
  /**
   * registration
   * Registration details
   */
  registration?: {
    /**
     * mixed>
     * @format date
     * @example "2025-03-26"
     */
    start_date?: string;
    /**
     * mixed>
     * @format date
     * @example "2025-04-26"
     */
    end_date?: string;
    /**
     * mixed>
     * @format float
     * @example 150
     */
    price?: number;
    /**
     * mixed>
     * @format date
     * @example "2025-03-30"
     */
    payment_deadline?: string;
  };
  /**
   * consultation
   * Consultation details
   */
  consultation?: {
    /**
     * mixed>
     * @format date
     * @example "2025-05-01"
     */
    start_date?: string;
    /**
     * mixed>
     * @format date
     * @example "2025-05-15"
     */
    end_date?: string;
    /**
     * mixed>
     * @format float
     * @example 200
     */
    price?: number;
    /**
     * mixed>
     * @format date
     * @example "2025-05-10"
     */
    payment_deadline?: string;
    /**
     * mixed>
     * @example "long text"
     */
    document?: string;
  };
  /**
   * evidence
   * Evidence submission details
   */
  evidence?: {
    /**
     * mixed>
     * @format date
     * @example "2025-06-01"
     */
    submission_deadline?: string;
    /**
     * mixed>
     * @format float
     * @example 50
     */
    submission_price?: number;
    /**
     * mixed>
     * @format date
     * @example "2025-06-05"
     */
    submission_payment_deadline?: string;
    /**
     * mixed>
     * @example "evidence.pdf"
     */
    document?: string;
  };
  general_rules?: string;
  note?: string;
  video_url?: string;
  result_type?: string;
  status?: string;
}

export interface OpenhouseCollection {
  id?: number;
  title?: string;
  description?: string;
  media?: string[] | null;
  phone?: string;
  email?: string;
  website?: string;
}

export interface OpenhouseResource {
  id?: number;
  title?: string;
  description?: string;
  start_at?: string;
  end_at?: string;
  max_attendees?: number;
  video_url?: string;
  /** User model */
  user?: User;
  media?: string[] | null;
}

export interface Organisation {
  id?: number;
  name?: string;
  region?: Region;
}

export interface Overall {
  space_count?: number;
  registered_count?: number;
  spec_registered_count?: number;
}

export interface Page {
  slug?: string;
  type?: string;
  /** Array of collections */
  collection?: Collection[];
  /**
   * Page title
   * @example "Contact us"
   */
  title?: string;
  /**
   * Page meta title
   * @example "Contact us"
   */
  meta_title?: string;
  content?: string;
  /** Page meta description */
  meta_description?: string;
  /** MPage main banner/poster */
  image?: string;
  /** Page index for ordering purposes */
  position?: number;
  /** Parent page ID */
  parent_id?: number;
  /** Page creation date time */
  created_at?: string;
  /**
   * Menus
   * Relations of menus
   */
  menus?: MenuItem[];
  /**
   * Medias
   * Relations of attachments
   */
  media?: MediaItem[];
  children?: Page[];
}

export interface Partner {
  id?: number;
  ident_no?: string;
  company_name?: string;
  company_legal_address?: string;
  website_url?: string;
  logo?: string;
}

export interface ProgramPartner {
  id?: number;
  name?: string;
  size?: string;
  sector?: string;
}

export interface ProgramWithCommission {
  id?: number;
  path?: string;
  program_name?: string;
  type?: string;
  program_id?: number;
  specialization_code?: string;
  specialization_name?: string;
  qualification_name?: string;
  program_code?: string;
  program_kind?: number;
  address?: string;
  credits_count?: string;
  credits_count_non_geo?: string;
  education_level?: number;
  language_id?: number;
  is_integrated?: boolean;
  region_id?: number;
  district_id?: number;
  program_duration?: string;
  program_duration_non_geo?: string;
  description?: string;
  partner?: string;
  /** | null */
  video_url?: string | null;
  gallery?: string[] | null;
  /**
   * Commission members
   * Relations of admission
   */
  commission_members?: User[];
}

export interface Region {
  id?: number;
  name?: string;
}

export interface RegistereCount {
  spec_count?: number;
  count?: number;
}

export interface Result {
  /** @format float */
  score?: number;
  data?: ResultData[];
}

export interface ResultData {
  /** @format float */
  score?: number;
  address?: string;
  start_at?: string;
  sector?: string;
}

export interface ResultReview {
  score?: number;
  max?: number;
}

export interface Schedule {
  id?: number;
  /** User model */
  user?: User;
  program?: LongTerm;
  selections?: Selection[];
  spec_edu?: boolean;
  spec_env?: string[];
  rofficer?: string;
  rofficer_doc?: string;
  select?: boolean;
  pass_level?: boolean;
  status?: string;
  canSelectStatus?: boolean;
  canSelectNextLevel?: boolean;
}

export interface ScheduleSelection {
  /** @format float */
  score?: number;
  address?: string;
  start_at?: string;
  name?: string;
}

export interface Selection {
  method?: SelectionMethod;
  max_evaluation_score?: number;
  min_competence_threshold?: number;
  passing_score?: number;
  scoring_percentage?: number;
  result?: Result;
}

export interface SelectionMethod {
  id?: number;
  name?: string;
  category?: string;
  provider?: string;
  reviewer?: string;
}

export interface Selections {
  selection?: Selection;
}

export interface ShortProgram {
  id?: number;
  program_name?: string;
  isced_code?: string;
  isced_description?: string;
  employs_area?: string;
  program_kind?: IdName;
  education_level?: IdName;
  region?: IdName;
  program_duration?: string;
  /**
   * organisation
   * Organisation
   */
  organisation?: {
    /**
     * mixed>
     * @example 1
     */
    id?: number;
    /**
     * mixed>
     * @format string
     * @example "test"
     */
    name?: string;
  };
  selection_methods?: string[] | null;
  isced?: Isced;
}

export interface ShortProgramAdmission {
  /**
   * The ID of the program admission
   * @example 1
   */
  id?: number;
  /** Details of the program */
  program?: {
    /**
     * Program ID
     * @example 1
     */
    id?: number;
    /**
     * Program name
     * @example "Short Program Example"
     */
    name?: string;
    /** The type/kind of the program */
    program_kind?: {
      /**
       * Program kind name
       * @example "პროფესიული მომზადება"
       */
      name?: string;
      /**
       * Program kind ID
       * @example 1
       */
      id?: number;
    };
    /** Details of the organisation */
    organisation?: {
      /**
       * Organisation ID
       * @example 10
       */
      id?: number;
      /**
       * Organisation name
       * @example "Example Organisation"
       */
      name?: string;
      /**
       * Organisation email
       * @example "test@gmail.com"
       */
      email?: string;
      /**
       * Organisation phone
       * @example "1131243213"
       */
      phone?: string;
      /**
       * Organisation website
       * @example "test.com"
       */
      website?: string;
      /**
       * Organisation address
       * @example "test address"
       */
      address?: string;
      /** Details of the region */
      region?: {
        /**
         * Region ID
         * @example 10
         */
        id?: number;
        /**
         * Region name
         * @example "Example Region"
         */
        name?: string;
      };
    };
  };
  /**
   * The start date for registration
   * @format date
   * @example "2023-01-01"
   */
  registration_start_date?: string;
  /**
   * The end date for registration
   * @format date
   * @example "2023-01-31"
   */
  registration_end_date?: string;
  /**
   * The start date for the study program
   * @format date
   * @example "2023-02-01"
   */
  study_start_date?: string;
  /** Eligibility information */
  is_eligible?: {
    /**
     * Indicates if the user is eligible
     * @example true
     */
    is_eligible?: boolean;
    /**
     * Reason code if not eligible
     * @example "1013"
     */
    reason?: string;
  };
}

export interface ShortProgramApplication {
  /**
   * The ID of the program application
   * @example 1
   */
  id?: number;
  /** The status details of the application */
  status?: {
    /**
     * Status name
     * @example "რეგისტრირებული"
     */
    name?: string;
    /**
     * Status date value
     * @format date
     * @example "2025-07-01"
     */
    value?: string;
  };
  /**
   * user ability to delete the application
   * @example true
   */
  can_delete?: boolean;
  programAdmission?: ShortProgramAdmission;
}

export interface ShortProgramApplicationForOrganisation {
  /**
   * The ID of the program application
   * @example 1
   */
  id?: number;
  /** The status details of the application */
  status?: {
    /**
     * Status name
     * @example "რეგისტრირებული"
     */
    name?: string;
    /**
     * Status date value
     * @format date
     * @example "2025-07-01"
     */
    value?: string;
  };
  /** The user belongs to the application */
  user?: {
    /**
     * Name
     * @example "john doe"
     */
    name?: string;
    /**
     * Email
     * @example "john_doe@example.com"
     */
    email?: string;
    /**
     * Phone
     * @example "599999999"
     */
    phone?: string;
    /**
     * pid
     * @example "12345678912"
     */
    pid?: string;
  };
}

export interface ShortProgramShow {
  id?: number;
  program_name?: string;
  isced_code?: string;
  isced_description?: string[] | null;
  employs_area?: string[] | null;
  goal?: string;
  program_kind?: IdName;
  education_level?: IdName;
  region?: IdName;
  program_duration?: string;
  /**
   * organisation
   * Organisation
   */
  organisation?: {
    /**
     * mixed>
     * @example 1
     */
    id?: number;
    /**
     * mixed>
     * @format string
     * @example "test"
     */
    name?: string;
    /**
     * mixed>
     * @format string
     * @example "test@gmail.com"
     */
    email?: string;
    /**
     * mixed>
     * @format string
     * @example "0322121212"
     */
    phone?: string;
    /**
     * mixed>
     * @format string
     * @example "test address"
     */
    address?: string;
    /**
     * mixed>
     * @format string
     * @example "https://example.com"
     */
    website?: string;
  };
  path?: string;
  type?: string;
  program_id?: number;
  specialization_code?: string;
  specialization_name?: string;
  qualification_name?: string;
  program_code?: string;
  address?: string;
  email?: string;
  responsible_person_phone?: string;
  language_id?: number;
  is_integrated?: boolean;
  district?: IdName;
  description?: string;
  partner?: string;
  video_url?: string | null;
  is_eligible?: boolean | null;
  registered?: RegistereCount;
  gallery?: string[] | null;
  /**
   * partners
   * Relations of partners
   */
  partners?: ProgramPartner[];
  /**
   * Admission
   * Relations of admission
   */
  admissions?: Admission[];
  /**
   * requirements
   * requirements
   */
  requirements?: {
    /** mixed> */
    min_age?: string | null;
    /**
     * mixed>
     * @format string
     */
    min_allowed_education?: string;
    /**
     * mixed>
     * @format string
     */
    other_requirements?: string;
  };
  selection_methods?: string[] | null;
  isced?: Isced;
}

export interface Specialisation {
  id?: string;
  title?: string;
  image?: string;
}

/**
 * User
 * User model
 */
export interface User {
  /**
   * ID
   * ID
   * @format int32
   * @example 1
   */
  id?: number;
  /**
   * Personal ID
   * Personal ID of the user
   * @example "01000000000"
   */
  pid?: string;
  /**
   * Username
   * Username
   * @example "01000000000"
   */
  username?: string;
  /**
   * Name
   * Fullname of the user
   * @example "John Doe"
   */
  name?: string;
  /**
   * First name
   * First name of the user
   * @example "John"
   */
  firstName?: string;
  /**
   * Last name
   * Last name of the user
   * @example "Doe"
   */
  lastName?: string;
  /**
   * Gender
   * gender of the user
   * @example "Male"
   */
  gender?: string;
  /**
   * Birth date
   * Birth date of the user
   * @format date
   * @example "1999-12-31"
   */
  birthDate?: string;
  /**
   * Residential
   * Residential of the user
   * @example "GE"
   */
  residential?: string;
  /**
   * Region
   * Region object of the user
   */
  region?: IdName | null;
  /**
   * District
   * District object of the user
   */
  district?: IdName | null;
  /**
   * Address
   * Address of the user
   * @example "Robert Robertson, 1234"
   */
  address?: null | string;
  /**
   * phone
   * Phone of the user
   * @example "555123456"
   */
  phone?: null | string;
  /**
   * Alternative phone
   * Alternative phone of the user
   * @example "555123456"
   */
  altPhone?: null | string;
  /**
   * Email
   * Email of the user
   * @format email
   * @example "example@example.com"
   */
  email?: null | string;
  /**
   * Photo
   * Photo of the user
   * @example "/users/photos/qwertyuio.jpg"
   */
  photo?: null | string;
  /**
   * Is active
   * Is active user
   * @format bool
   * @example false
   */
  isActive?: boolean;
  /**
   * Block reason
   * Block reason of user
   * @example "Some reason"
   */
  blockReason?: null | string;
  /**
   * Created at
   * Created at
   * @format datetime
   * @example "2024-01-27 17:50:45"
   */
  created_at?: string;
  /**
   * Deleted at
   * Deleted at
   * @format datetime
   * @example "null"
   */
  deletedAt?: null | string;
}

export interface UserRatings {
  pass?: boolean;
  /** @format float */
  score?: number;
  position?: number;
}

export interface VacancyCollection {
  id?: number;
  position?: string;
  modules?: number[];
  programs?: number[];
  district?: number;
  institution?: string;
  status?: number;
  publish_date?: string;
  deadline_date?: string;
  is_favorite?: boolean;
}

export interface VacancyResource {
  /** @example 1 */
  id?: number;
  /** @example "სასწავლებლის სახელი" */
  institution?: string;
  /** @example "მასწავლებელი" */
  position?: string;
  /** @example [1,2,3] */
  modules?: number[];
  /** @example [1,2,3] */
  programs?: number[];
  /** @example "2025-04-21T13:07:24+04:00" */
  start_date?: string;
  /** @example 100 */
  hourly_pay_from?: string;
  /** @example 100 */
  hourly_pay_to?: string;
  /** @example "09:00" */
  hourly_workload_from?: string;
  /** @example "17:00" */
  hourly_workload_to?: string;
  /** @example [1,2,3] */
  selection_stages?: number[];
  /** @example 100 */
  vacant_places?: number;
  /** @example 1 */
  work_format?: number;
  /** @example "სტანდარტული" */
  responsibilities?: string;
  /** @example "სტანდარტული" */
  basic_requirements?: string;
  /** @example "სტანდარტული" */
  essential_requirements?: string;
  /** @example "სტანდარტული" */
  optional_requirements?: string;
  /** @example "სტანდარტული" */
  additional_information?: string;
  /** @example 1 */
  contact_person?: number;
  /** @example "2025-04-21T13:07:24+04:00" */
  publish_date?: string;
  /** @example "2025-04-21T13:07:24+04:00" */
  deadline_date?: string;
  /** @example "სტანდარტული" */
  address?: string;
  /** @example true */
  is_favorite?: boolean;
  /** @example {"id":1,"name":"Tbilisi"} */
  district?: any;
  /** @example 1 */
  status?: number;
  /** @example true */
  teaching_professional_programs?: boolean;
  /** @example true */
  teaching_short_term_programs?: boolean;
  /** @example true */
  obtaining_authorization?: boolean;
}

export interface ApplicationReq {
  positions?: number[];
  regions?: number[];
  institutions?: number[];
  fields?: number[];
  allow_email_notifications?: boolean;
  allow_review_personal_page?: boolean;
  file?: any;
}

export interface LoginRequestBody {
  pid: string;
  password: string;
}

export interface VacancyReq {
  position_type?: number;
  position?: string;
  region_id?: number;
  district_id?: number;
  institution?: string;
  /** @format date */
  publish_date?: string;
  /** @format date */
  deadline_date?: string;
  teaching_professional_programs?: boolean;
  teaching_short_term_programs?: boolean;
  modules?: number[];
  programs?: number[];
  address?: string;
  contact_person?: number;
  hourly_pay_from?: number;
  hourly_pay_to?: number;
  hourly_workload_from?: string;
  hourly_workload_to?: string;
  /** @format date */
  start_date?: string;
  selection_stages?: number[];
  vacant_places?: number;
  work_format?: number;
  responsibilities?: string;
  basic_requirements?: string;
  essential_requirements?: string;
  optional_requirements?: string;
  additional_information?: string;
  obtaining_authorization?: boolean;
}

export interface ValidateCodeRequestBody {
  token: string;
  code: string;
}

/** Admission Resource */
export interface AdmissionRes {
  data?: AdmissionReq;
}

/** Admissions Resource */
export interface AdmissionsRes {
  data?: AdmissionReq[];
  links?: {
    /** Pagination links. */
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    /**
     * Pagination metadata.
     * @example 1
     */
    current_page?: number;
    /** @example 1 */
    from?: number;
    /** @example 1 */
    last_page?: number;
    links?: {
      url?: string | null;
      /** @example "1" */
      label?: string;
      /** @example true */
      active?: boolean;
    }[];
    path?: string;
    /** @example 15 */
    per_page?: number;
    /** @example 1 */
    to?: number;
    /** @example 1 */
    total?: number;
  };
}

export interface ApplicantCollectionRes {
  data?: ApplicantCollection;
}

export interface ApplicationResourceRes {
  data?: ApplicationResource;
}

/** Page Resource */
export interface CardDataRes {
  status?: boolean;
  msg?: string;
  /** Page Resource */
  data?: CardRes;
}

/** Page Resource */
export interface CardRes {
  /** User model */
  user?: User;
  programs?: CardProgramsType;
}

/**
 * collectionItemResource
 * Collection items resource
 */
export interface CollectionItemsRes {
  /**
   * Data
   * Data wrapper
   */
  data?: CollectionItem[];
}

/** Admissions Resource */
export interface FinalResultRes {
  /** User model */
  user?: User;
  programs?: LongTerm;
  selection?: Selection;
  result?: UserRatings;
}

/** Admissions Resource */
export interface FinalResultsRes {
  data?: FinalResultRes[];
}

/** Page Resource */
export interface LongTermRes {
  data?: LongTerm;
}

/** Page Resource */
export interface LongTermsRes {
  data?: LongTerm[];
  links?: {
    /** Pagination links. */
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    /**
     * Pagination metadata.
     * @example 1
     */
    current_page?: number;
    /** @example 1 */
    from?: number;
    /** @example 1 */
    last_page?: number;
    links?: {
      url?: string | null;
      /** @example "1" */
      label?: string;
      /** @example true */
      active?: boolean;
    }[];
    path?: string;
    /** @example 15 */
    per_page?: number;
    /** @example 1 */
    to?: number;
    /** @example 1 */
    total?: number;
  };
  filters?: {
    /**
     * Filters applied to admissions.
     * @example "text"
     */
    type?: string;
    /** @example null */
    selected?: string | null;
    /** @example "program_name" */
    key?: string;
    /** @example "*" */
    values?: string;
  }[];
}

/** Page Resource */
export interface MyCommissionReviewRes {
  data?: ProgramWithCommission[];
}

/** Page Resource */
export interface NonFormalRes {
  data?: NonFormalShow;
}

/** Page Resource */
export interface NonFormalsRes {
  data?: NonFormal[];
  links?: {
    /** Pagination links. */
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    /**
     * Pagination metadata.
     * @example 1
     */
    current_page?: number;
    /** @example 1 */
    from?: number;
    /** @example 1 */
    last_page?: number;
    links?: {
      url?: string | null;
      /** @example "1" */
      label?: string;
      /** @example true */
      active?: boolean;
    }[];
    path?: string;
    /** @example 15 */
    per_page?: number;
    /** @example 1 */
    to?: number;
    /** @example 1 */
    total?: number;
  };
}

export interface OpenhouseCollectionRes {
  data?: OpenhouseCollection[];
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    /** @example 1 */
    current_page?: number;
    /** @example 1 */
    from?: number;
    path?: string;
    /** @example 15 */
    per_page?: number;
    /** @example 1 */
    to?: number;
  };
}

export interface OpenhouseResourceRes {
  data?: OpenhouseResource;
}

/** Page Resource */
export interface OrganisationRes {
  code?: string;
  name?: string;
  address?: string;
  district_id?: number;
  region_id?: number;
  zip?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  manager?: string;
  manager_hone?: string;
  responsible_person?: string;
  responsible_person_phone?: string;
  website?: string;
  legal_form?: string;
  org_type?: number;
  created_at?: string;
  updated_at?: string;
  institution_type_id?: number;
  establishment_date?: string;
  is_authorized?: boolean;
  has_nf_programs?: boolean;
  has_retraining_programs?: boolean;
  legal_address?: string;
  video_url?: string;
  lat?: string;
  lng?: string;
  properties?: string[];
  partners?: string[];
  region?: object;
  district?: object;
}

/** Page Resource */
export interface PagesRes {
  data?: Page[];
}

/** Page Resource */
export interface PartnerRes {
  data?: Partner[];
}

/** Page Resource */
export interface ProgramShortAdmissionRes {
  data?: ShortProgramAdmission[];
  links?: {
    /** Pagination links. */
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    /**
     * Pagination metadata.
     * @example 1
     */
    current_page?: number;
    /** @example 1 */
    from?: number;
    /** @example 1 */
    last_page?: number;
    links?: {
      url?: string | null;
      /** @example "1" */
      label?: string;
      /** @example true */
      active?: boolean;
    }[];
    path?: string;
    /** @example 15 */
    per_page?: number;
    /** @example 1 */
    to?: number;
    /** @example 1 */
    total?: number;
  };
}

/** Page Resource */
export interface ProgramShortApplicationForOrganisationRes {
  data?: ShortProgramApplicationForOrganisation[];
}

/** Page Resource */
export interface ProgramShortApplicationRes {
  data?: ShortProgramApplication[];
}

/** Page Resource */
export interface ProgramsWithCommissionsRes {
  data?: ProgramWithCommission[];
}

/** Page Resource */
export interface ScheduleRes {
  data?: Schedule[];
  links?: {
    /** Pagination links. */
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    /**
     * Pagination metadata.
     * @example 1
     */
    current_page?: number;
    /** @example 1 */
    from?: number;
    /** @example 1 */
    last_page?: number;
    links?: {
      url?: string | null;
      /** @example "1" */
      label?: string;
      /** @example true */
      active?: boolean;
    }[];
    path?: string;
    /** @example 15 */
    per_page?: number;
    /** @example 1 */
    to?: number;
    /** @example 1 */
    total?: number;
  };
  filters?: {
    /**
     * Filters applied to admissions.
     * @example "text"
     */
    type?: string;
    /** @example null */
    selected?: string | null;
    /** @example "program_name" */
    key?: string;
    /** @example "*" */
    values?: string;
  }[];
}

/** Page Resource */
export interface ShortProgramRes {
  data?: ShortProgram[];
  links?: {
    /** Pagination links. */
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    /**
     * Pagination metadata.
     * @example 1
     */
    current_page?: number;
    /** @example 1 */
    from?: number;
    /** @example 1 */
    last_page?: number;
    links?: {
      url?: string | null;
      /** @example "1" */
      label?: string;
      /** @example true */
      active?: boolean;
    }[];
    path?: string;
    /** @example 15 */
    per_page?: number;
    /** @example 1 */
    to?: number;
    /** @example 1 */
    total?: number;
  };
  filters?: {
    /**
     * Filters applied to admissions.
     * @example "text"
     */
    type?: string;
    /** @example null */
    selected?: string | null;
    /** @example "program_name" */
    key?: string;
    /** @example "*" */
    values?: string;
  }[];
}

/** Page Resource */
export interface ShortProgramShowRes {
  data?: ShortProgramShow;
}

/** Page Resource */
export interface StatRes {
  data?: LongTerm[];
  overall?: Overall;
  organisations?: IdName[];
}

export interface UserLogin2FaResponseBody {
  status: boolean;
  msg: string;
  phone_mask: string;
  token: string;
}

export interface UserLoginResponseBody {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
}

/**
 * UserResource
 * User resource
 */
export interface UserRes {
  /** User model */
  data?: User;
}

/**
 * UserResource
 * User resource
 */
export interface UsersRes {
  /**
   * Data
   * Data wrapper
   */
  data?: User[];
}

export interface VacancyCollectionRes {
  data?: VacancyResource[];
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    /** @example 1 */
    current_page?: number;
    /** @example 1 */
    from?: number;
    path?: string;
    /** @example 15 */
    per_page?: number;
    /** @example 1 */
    to?: number;
  };
}

export interface VacancyResourceRes {
  data?: VacancyResource;
}

/**
 * User request
 * User request body data
 */
export interface UserReq {
  /**
   * Personal Id
   * Personal Id of project
   * @example "01000000000"
   */
  pid: string;
  /**
   * Phone
   * Phone number
   * @example "555123456"
   */
  phone: string;
  /**
   * First name
   * First name of the user
   * @example "John"
   */
  first_name: string;
  /**
   * English first name
   * English First name of the user
   * @example "John"
   */
  first_name_en?: string;
  /**
   * Last name
   * Last name of the user
   * @example "Doe"
   */
  last_name: string;
  /**
   * English last name
   * English last name of the user
   * @example "Doe"
   */
  last_name_en?: string;
  /**
   * Gender
   * gender of the user
   * @example "male"
   */
  gender: null | string;
  /**
   * Birth date
   * Birth date of the user
   * @format date
   * @example "1999-12-31"
   */
  birth_date: string;
  /**
   * Residential
   * Residential of the user
   * @example "GE"
   */
  residential: string;
  /**
   * Region
   * Region of the user
   * @example "Tbilisi"
   */
  region?: null | string;
  /**
   * City
   * City of the user
   * @example "Tbilisi"
   */
  city?: null | string;
  /**
   * Address
   * Address of the user
   * @example "Robert Robertson, 1234"
   */
  address?: null | string;
  /**
   * Alternative phone
   * Alternative phone of the user
   * @example "555123456"
   */
  alt_phone?: null | string;
  /**
   * Email
   * Email of the user
   * @format email
   * @example "example@example.com"
   */
  email?: null | string;
  /**
   * Sms code
   * 2fa code of the user
   * @example "1234"
   */
  sms_code?: null | string;
  /**
   * Photo
   * Photo of the user
   * @example "base64 string"
   */
  photo?: null | string;
}

/**
 * User update request
 * User update request body data
 */
export interface UserUpdateReq {
  /**
   * Personal Id
   * Personal Id of project
   * @example "01000000000"
   */
  pid?: string;
  /**
   * Phone
   * Phone number
   * @example "555123456"
   */
  phone?: string;
  /**
   * First name
   * First name of the user
   * @example "John"
   */
  first_name?: string;
  /**
   * First name EN
   * First name EN of the user
   * @example "John"
   */
  first_name_en?: string;
  /**
   * Last name
   * Last name of the user
   * @example "Doe"
   */
  last_name?: string;
  /**
   * Last name EN
   * Last name EN of the user
   * @example "Doe"
   */
  last_name_en?: string;
  /**
   * Gender
   * gender of the user
   * @example "male"
   */
  gender?: null | string;
  /**
   * Birth date
   * Birth date of the user
   * @format date
   * @example "1999-12-31"
   */
  birth_date?: string;
  /**
   * Residential
   * Residential of the user
   * @example "GE"
   */
  residential?: string;
  /**
   * Region
   * Region of the user
   * @example "Tbilisi"
   */
  region?: null | string;
  /**
   * City
   * City of the user
   * @example "Tbilisi"
   */
  city?: null | string;
  /**
   * Address
   * Address of the user
   * @example "Robert Robertson, 1234"
   */
  address?: null | string;
  /**
   * Alternative phone
   * Alternative phone of the user
   * @example "555123456"
   */
  alt_phone?: null | string;
  /**
   * Email
   * Email of the user
   * @format email
   * @example "example@example.com"
   */
  email?: null | string;
  /**
   * Sms code
   * 2fa code of the user
   * @example "1234"
   */
  sms_code?: null | string;
  /**
   * Password
   * Password of the user
   * @example "password"
   */
  password?: null | string;
  /**
   * Password confirmation
   * Password confirmation
   * @example "password"
   */
  password_confirmation?: null | string;
  /**
   * Photo
   * Photo of the user
   * @example "base64 string"
   */
  photo?: null | string;
}
