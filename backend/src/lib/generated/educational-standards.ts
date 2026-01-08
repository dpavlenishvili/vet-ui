import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class EducationalStandardsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns a paginated list of educational standards * * @tags Educational standards
   * @name EducationalStandardsIndex
   * @summary List of educational standards
   * @request GET:/educational-standards */

  educationalStandardsIndex = (
    query?: {
      /** Filter by nqf code */
      code?: string;
      /** Page number for pagination */
      page?: number;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<{
      data?: {
        /** @example 1 */
        id?: number;
        /** @example "Mathematics Standard" */
        name?: string;
        /** @example "ბიზნესი, ადმინისტრირება და სამართალი" */
        nqf_name?: string;
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
    }>(`${this.baseUrl}/educational-standards`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Returns list of educational standard categories * * @tags Educational standards
   * @name EducationalStandardsCategories
   * @summary List of educational standard categories
   * @request GET:/educational-standards/categories */

  educationalStandardsCategories = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        title?: string;
        code?: string;
      }[];
    }>(`${this.baseUrl}/educational-standards/categories`, options);
  };
  /**
   * @description Downloads the file associated with the specified educational standard * * @tags Educational standards
   * @name EducationalStandardsDownloadFile
   * @summary Download educational standard file
   * @request GET:/educational-standards/{educationalStandard}/download-file */

  educationalStandardsDownloadFile = (educationalStandard: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<void>(
      `${this.baseUrl}/educational-standards/${educationalStandard}/download-file`,
      options,
    );
  };
}
