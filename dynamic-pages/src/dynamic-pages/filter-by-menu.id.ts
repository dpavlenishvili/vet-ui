import { ApplicationPage } from './application.page.type';

export function filterByMenuId(pages: ApplicationPage[], menuId: number): ApplicationPage[] {
  return pages.reduce((acc: ApplicationPage[], page) => {
    if (page.menus && page.menus.some((menu) => menu.id === menuId)) {
      acc.push({
        ...page,
        children: filterByMenuId(page.children || [], menuId),
      });
    }
    return acc;
  }, []);
}
