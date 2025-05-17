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

export interface Admission {
  admission_id?: number;
  min_allowed_education_level_id?: number;
  min_allowed_age?: string;
  program_fee?: string;
  student_fee?: string;
  has_college_exam?: boolean;
  financing_type_id?: number;
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
  /**
   * Selection
   * Relations of selection
   */
  selection?: Selection[];
}

export interface AdmissionPrograms {
  select?: boolean;
  status?: string;
  program?: LongTerm;
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

export interface CardPrograms {
  programs?: LongTerm;
  start_at?: string;
  address?: string;
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
  comission_member?: User;
  scores?: CommissionScore[];
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
  reviews?: CommissionReviews[];
  result?: ResultReview;
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
  /** | null */
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

export interface NonFormal {
  id?: number;
  isced?: string;
  legal_name?: string;
  isced_code?: string;
  gallery?: string[] | null;
  organisation?: Organisation;
}

export interface NonFormalShow {
  id?: number;
  isced?: string;
  isced_code?: string;
  gallery?: string[] | null;
  organisation?: Organisation;
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
  /** Attached collection */
  collection_id?: number;
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

export interface ResultReview {
  score?: number;
  max?: number;
}

export interface Schedule {
  id?: number;
  /** User model */
  user?: User;
  program?: LongTerm;
  selections?: Selections[];
  spec_edu?: boolean;
  spec_env?: string[];
  rofficer?: string;
  rofficer_doc?: string;
  select?: number;
  status?: string;
  canSelectStatus?: boolean;
}

export interface Selection {
  method?: SelectionMethod;
  max_evaluation_score?: number;
  min_competence_threshold?: number;
  passing_score?: number;
  scoring_percentage?: number;
}

export interface SelectionMethod {
  id?: number;
  name?: string;
  category?: string;
  provider?: string;
}

export interface Selections {
  selection?: Selection;
  /** @format float */
  score?: number;
  start_at?: string;
  address?: string;
}

export interface ShortProgram {
  id?: number;
  program_name?: string;
  isced_code?: string;
  isced_description?: string;
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
}

export interface ShortProgramShow {
  id?: number;
  program_name?: string;
  isced_code?: string;
  isced_description?: string;
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
  path?: string;
  type?: string;
  program_id?: number;
  specialization_code?: string;
  specialization_name?: string;
  qualification_name?: string;
  program_code?: string;
  address?: string;
  language_id?: number;
  is_integrated?: boolean;
  district?: IdName;
  description?: string;
  partner?: string;
  /** | null */
  video_url?: string | null;
  is_eligible?: boolean | null;
  registered?: RegistereCount;
  gallery?: string[] | null;
  /**
   * partners
   * Relations of partners
   */
  partners?: ProgramPartner[];
  admission?: Admission;
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

export interface LoginRequestBody {
  pid: string;
  password: string;
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
  programs?: CardPrograms[];
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
export interface PagesRes {
  data?: Page[];
}

/** Page Resource */
export interface PartnerRes {
  data?: Partner[];
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
   * Last name
   * Last name of the user
   * @example "Doe"
   */
  last_name: string;
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
   * Last name
   * Last name of the user
   * @example "Doe"
   */
  last_name?: string;
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
