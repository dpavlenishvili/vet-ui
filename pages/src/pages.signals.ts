import { computed, effect, Signal } from '@angular/core';
import { usePages } from './pages.resources';
import { getCurrentSlug, getMatchedPage, getMatchedPageList } from './pages.utils';
import { useCurrentUrl } from '@vet/shared';
import { Page } from '@vet/backend';
import { Meta } from '@angular/platform-browser';

export function useMatchedPage() {
  const url = useCurrentUrl();
  const pages$ = usePages();

  return computed(() => {
    const pages = pages$.value();

    if (!pages) {
      return;
    }

    const slug = getCurrentSlug(url());
    const page = getMatchedPage(slug, pages);

    return page;
  });
}

export function useMatchedPageList() {
  const url = useCurrentUrl();
  const pages$ = usePages();

  return computed(() => {
    const pages = pages$.value();

    if (!pages) {
      return [];
    }

    const slug = getCurrentSlug(url());
    const matched = getMatchedPageList(slug, pages);

    // console.log('matched', slug, matched, pages);

    return matched;
  });
}

export function useMenuPages(menu: string) {
  const pages$ = usePages();
  const menuLower = menu.toLowerCase();

  return computed(() => {
    return pages$.value().filter((page) => page.menus?.map((m) => m.name.toLowerCase()).includes(menuLower));
  });
}

export function usePageMetadataUpdater(meta: Meta, page: Signal<Page | null | undefined>) {
  effect(() => {
    const _page = page();

    if (!_page || !meta) {
      return;
    }

    if (_page.meta_title) {
      meta.updateTag({
        name: 'og-title',
        content: _page.meta_title,
      });
    }

    if (_page.meta_description) {
      meta.updateTag({
        name: 'og-description',
        content: _page.meta_description,
      });
    }
  });
}
