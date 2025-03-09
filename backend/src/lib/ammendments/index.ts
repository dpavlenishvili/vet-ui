import type { RolesService } from "../generated";
import {Observable} from "rxjs";

export type UserRole = ReturnType<RolesService['roles']> extends Observable<Array<infer U>> ? U : never;
