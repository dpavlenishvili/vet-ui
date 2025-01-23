import { Type } from '@angular/core';

import type { Page } from 'backend';

const PageTypeToPageComponent: Record<string, () => Promise<Type<unknown>>> = {
  collection: () =>
    import('../collection/collection-page/collection-page.component').then((m) => m.CollectionPageComponent),
  default_static: () => import('../static-page/static-page.component').then((m) => m.StaticPageComponent),
};

export function resolvePageComponent(page: Page): () => Promise<Type<unknown>> {
  const resolvedCmpLoader = PageTypeToPageComponent[page.type as string];
  if (resolvedCmpLoader) {
    return resolvedCmpLoader;
  }
  throw new Error(`No component for page type ${page.type}`);
}
