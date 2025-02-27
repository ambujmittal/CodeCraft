/// <reference types="vite/client" />

import { CompilerSliceStateType } from "./redux/slices/compilerSlice";

//users types
interface userInfoType {
  username: string;
  email: string;
  savedCodes: Array<string>;
}

interface loginCredentialsType {
  userId: string;
  password: string;
}

interface signupCredentialsType {
  username: string;
  email: string;
  password: string;
}

interface codeType {
  fullCode?: CompilerSliceStateType["fullCode"];
  title: string;
  ownerName: string;
  _id?: string;
}
