import {coerceNumberProperty} from "@angular/cdk/coercion";

export const vetCoerceNumberProperty = coerceNumberProperty as (val: string | number | `${number}`) => number;
