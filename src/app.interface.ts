export interface GuestUser {
  readonly domainVisited: string;
  readonly ipAddress: string | any;
  readonly createdAt?: Date;
  readonly userAgent: string;
  readonly pageVariant: string;
}

export interface ClickEventData {
  readonly clickedElementId: string;
  readonly clickedElementText: string;
  readonly name: string;
  readonly version: number;
}
