import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared/utils';

@Injectable({ providedIn: 'root' })
export class OrganisationsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of organisations * * @tags Organisations
   * @name Organisations
   * @summary Returns list of organisations
   * @request GET:/organisations */

  organisations = (
    query?: {
      /** Filter by name,code,address, manager */
      'filters[search]'?: string;
      /** Filter by id */
      'filters[id]'?: number;
      /** Filter by name */
      'filters[name]'?: string;
      /** Filter by region id */
      'filters[region]'?: string;
      /** Filter by region id */
      'filters[district]'?: string;
      /** Filter by org type */
      'filters[org_type]'?: string;
      /** Filter by org institution_type_id */
      'filters[institution_type_id]'?: string;
      /** Page number for pagination */
      per_page?: number;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<{
      data?: {
        /** @example 1 */
        id?: number;
        /** @example "Mathematics Standard" */
        name?: string;
        phone?: string | null;
        email?: string | null;
        website?: string | null;
        /** @example "test" */
        org_type?: string;
        /** @example "კერძო" */
        institution_type_id?: string;
        main_image?: string;
        /** @example false */
        is_authorized?: boolean;
        /** @example false */
        has_nf_programs?: boolean;
        /** @example false */
        has_retraining_programs?: boolean;
      }[];
      links?: {
        /** @example "http://example.com?page=1" */
        first?: string;
        /** @example "http://example.com?page=10" */
        last?: string;
        /** @example null */
        prev?: string | null;
        /** @example "http://example.com?page=2" */
        next?: string | null;
      };
      meta?: {
        /** @example 1 */
        current_page?: number;
        /** @example 1 */
        from?: number;
        /** @example 10 */
        last_page?: number;
        links?: {
          url?: string | null;
          /** @example "1" */
          label?: string;
          /** @example true */
          active?: boolean;
        }[];
        /** @example "http://example.com" */
        path?: string;
        /** @example 15 */
        per_page?: number;
        /** @example 15 */
        to?: number;
        /** @example 150 */
        total?: number;
      };
    }>(`${this.baseUrl}/organisations`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Returns detailed information about a specific organisation * * @tags Organisations
   * @name ShowOrganisation
   * @summary Show organisation details
   * @request GET:/organisations/{organisation} */

  showOrganisation = (organisation: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        /** @example 1 */
        id?: number;
        /** @example "სატესტო დასახელება" */
        name?: string;
        /** @example "599000000" */
        phone?: string | null;
        /** @example "https://test.com" */
        website?: string | null;
        /** @example "test@test.edu.ge" */
        email?: string | null;
        /** @example "test" */
        org_type?: string;
        /** @example "კერძო" */
        institution_type_id?: string;
        /** @example "236098851" */
        code?: string;
        /** @example "სატესტო მისამართი" */
        address?: string;
        /** @example "სახელი გვარი" */
        manager?: string;
        /** @example null */
        manager_hone?: string | null;
        /** @example "საჯარო სამართლის იურიდიული პირი" */
        legal_form?: string;
        /**
         * @format date
         * @example null
         */
        establishment_date?: string | null;
        /** @example false */
        is_authorized?: boolean;
        /** @example false */
        has_nf_programs?: boolean;
        /** @example false */
        has_retraining_programs?: boolean;
        /** @example null */
        legal_address?: string | null;
        /** @example null */
        video_url?: string | null;
        coordinates?: {
          /**
           * @format float
           * @example null
           */
          lat?: number | null;
          /**
           * @format float
           * @example null
           */
          lng?: number | null;
        };
        field_of_activities?: {
          /** @example "სოფლის, სატყეო და თევზის მეურნეობა" */
          section_name?: string;
          /** @example "მემცენარეობა და მეცხოველეობა, ნადირობა და აღნიშნულ სფეროებში მომსახურების გაწევა" */
          division_name?: string;
        }[];
        gallery?: string[];
      };
    }>(`${this.baseUrl}/organisations/${organisation}`, options);
  };
}
