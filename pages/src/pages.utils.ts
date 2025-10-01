import { Page } from '@vet/backend';

export function getCurrentSlug(path: string): string {
  return path.split('/').filter((_, i) => i > 1).join('/').split('?')[0] ?? '';
}

export function getMatchedPage(slug: string, pages: Page[]): Page | null {
  for (const page of pages) {
    if (page.slug === slug) {
      return page;
    }

    if (page.children?.length) {
      const matchedChild = getMatchedPage(slug, page.children);

      if (matchedChild) {
        return matchedChild;
      }
    }
  }

  return null;
}

export function getMatchedPageList(slug: string, pages: Page[]): Page[] {
  for (const page of pages) {
    if (page.slug === slug) {
      return [page];
    }

    if (page.children?.length) {
      const matchedChildren = getMatchedPageList(slug, page.children);

      if (matchedChildren.length > 0) {
        return [page, ...matchedChildren];
      }
    }
  }

  return [];
}
