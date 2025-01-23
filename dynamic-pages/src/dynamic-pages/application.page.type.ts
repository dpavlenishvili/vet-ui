import type { Page } from 'backend';

export type ApplicationPage = Page & {
  url: string[];
  children?: ApplicationPage[];
};
export type GroupedPages = Record<number, ApplicationPage[]>;
