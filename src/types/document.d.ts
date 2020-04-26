import { FaunaRef, FaunaTime } from './fauna';

export interface DocumentGroup {
  _name: string;
}

export interface DocumentAuthAccountProfile {
  email?: string;
}

export interface OpenIDUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: JSON;
  updated_at?: number;
}

export interface DocumentAuthAccount {
  provider: string;
  id: string;
  profile?: DocumentAuthAccountProfile;
  userInfo?: OpenIDUserInfo;
}

export interface DocumentAuth {
  email?: string;
  accounts?: DocumentAuthAccount[];
}

export interface DocumentMembership {
  public?: boolean;
  owner?: FaunaRef;
  assignees?: FaunaRef[];
  roles?: FaunaRef[];
}

export interface DocumentValidity {
  deleted: boolean;
  expires_at: FaunaTime;
}

export type DocumentActionName =
  | 'register'
  | 'login'
  | 'login_fail'
  | 'logout'
  | 'logout_everywhere'
  | 'insert'
  | 'update'
  | 'replace'
  | 'forget'
  | 'delete'
  | 'expire'
  | 'restore'
  | 'remember'
  | 'credentials_change'
  | 'auth_email_change'
  | 'auth_accounts_change'
  | 'roles_change'
  | 'owner_change'
  | 'public_change'
  | 'assignees_change';

export interface DocumentActivity {
  auth_email_changed_by?: FaunaRef;
  auth_email_changed_at?: FaunaTime;

  auth_accounts_changed_by?: FaunaRef;
  auth_accounts_changed_at?: FaunaTime;

  roles_changed_by?: FaunaRef;
  roles_changed_at?: FaunaTime;

  assignees_changed_by?: FaunaRef;
  assignees_changed_at?: FaunaTime;

  owner_changed_by?: FaunaRef;
  owner_changed_at?: FaunaTime;

  credentials_changed_by?: FaunaRef;
  credentials_changed_at?: FaunaTime;

  inserted_by?: FaunaRef;
  inserted_at?: FaunaTime;

  updated_by?: FaunaRef;
  updated_at?: FaunaTime;

  replaced_by?: FaunaRef;
  replaced_at?: FaunaTime;

  expiration_by?: FaunaRef;
  expiration_at?: FaunaTime;

  deleted_by?: FaunaRef;
  deleted_at?: FaunaTime;

  restored_by?: FaunaRef;
  restored_at?: FaunaTime;

  forgotten_by?: FaunaRef;
  forgotten_at?: FaunaTime;

  remembered_by?: FaunaRef;
  remembered_at?: FaunaTime;
}
