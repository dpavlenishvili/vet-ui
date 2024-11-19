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
  pid: string;
  password: string;
  code: string;
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
export interface PagesRes {
  data?: Page[];
}

export interface UserLogin2FaResponseBody {
  status: boolean;
  msg: string;
  phone_mask: string;
}

export interface UserLoginResponseBody {
  access_token: string;
  token_type: string;
  expires_in: number;
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
  photo?: null | string;
  /**
   * Photo
   * Photo of the user
   * @example "base64 string"
   */
  password_confirmation?: null | string;
}
