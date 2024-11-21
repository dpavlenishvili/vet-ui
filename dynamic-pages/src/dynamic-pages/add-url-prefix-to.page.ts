import { Page } from 'backend';

import { ApplicationPage } from './application.page.type';
import { dynamicUrlPrefix } from './dynamic-url.prefix';

export function addUrlPrefixToPage(page: Page): ApplicationPage {
    return {
        ...page,
        url: [dynamicUrlPrefix, ...(page.slug || '').split('/')],
        children: (page.children || []).map(addUrlPrefixToPage),
    };
}
