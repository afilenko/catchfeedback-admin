import { createAction } from "@reduxjs/toolkit";
import { AuthUser } from "typings/entities";

export const setAuthUser = createAction<AuthUser | null>("auth/setUser");
