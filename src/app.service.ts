import { Injectable, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TrackingService } from './analytics-api';
import { ClickEventData, GuestUser } from './app.interface';

@Injectable()
export class AppService {
  private readonly pageVariantCookieName = 'pageVariantAssigned';
  private readonly guestUserIdCookieName = 'guestUserId';

  constructor(private trackingService: TrackingService) {}
  getTestMessage(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): { pageVariant: number } {
    const pageVariant = this.getGuestUserCookies(response, request);

    this.postAnalyticsApi(response, request);

    return {
      pageVariant,
    };
  }

  private getGuestUserCookies(response: Response, request: Request): number {
    const existingCookie = request.cookies[this.guestUserIdCookieName];
    let pageVariant: number;

    if (existingCookie) {
      pageVariant = request.cookies[this.pageVariantCookieName];
    } else {
      // Choose a random page variant
      pageVariant = Math.round(Math.random());

      // Generate a guest user ID
      const guestUserId = uuidv4();

      // Set cookies
      this.setCookies(response, guestUserId, pageVariant);
    }

    return pageVariant;
  }

  private setCookies(
    response: Response,
    guestUserId: string,
    pageVariant: number,
  ): void {
    response.cookie(this.pageVariantCookieName, pageVariant);
    response.cookie(this.guestUserIdCookieName, guestUserId);
  }

  private postAnalyticsApi(response: Response, request: Request): any {
    const getGuestUserNetworkInfo: GuestUser = this.getGuestUserInfo(
      response,
      request,
    );

    this.trackingService.trackPageview(getGuestUserNetworkInfo);
  }

  private postAnalyticsApiEvents(
    response: Response,
    request: Request,
    clickEventData: ClickEventData,
  ): any {
    const getGuestUserNetworkInfo: GuestUser = this.getGuestUserInfo(
      response,
      request,
    );

    this.trackingService.trackEvent(getGuestUserNetworkInfo, clickEventData);
  }

  private getGuestUserInfo(response: Response, request: Request): GuestUser {
    const domainVisited = 'https://ab-testing.adaptable.app';
    const ipAddress = request.socket.remoteAddress;
    const createdAt = new Date();
    const userAgent = request.headers['user-agent'] || 'empty';
    const pageVariant =
      request.cookies[this.pageVariantCookieName] === '1'
        ? 'testVariation'
        : 'controlVariation';

    return {
      domainVisited,
      ipAddress,
      createdAt,
      userAgent,
      pageVariant,
    };
  }

  getGuestUserClickEvent(
    response: Response,
    @Req() request: Request,
    clickEventData: ClickEventData,
  ) {
    this.postAnalyticsApiEvents(response, request, clickEventData);
  }
}
