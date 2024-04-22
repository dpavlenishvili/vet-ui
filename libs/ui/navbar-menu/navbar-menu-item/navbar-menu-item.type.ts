export interface NavbarMenuItemType {
    url: string[];
    title?: string; // Optional, just because it's optional in the original Page type
    children?: NavbarMenuItemType[];
}
