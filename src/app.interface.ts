export interface GuestUser {
  readonly domainVisited: string;
  readonly ipAddress: string | any;
  readonly createdAt?: Date;
  readonly userAgent: string;
}
