import { Injectable, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  getTestMessage(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): {
    page_variant: number;
  } {
    const page_variant = this.getGuestUserCookies(response, request);

    this.getAnalyticsApi();

    return {
      page_variant: page_variant,
    };
  }

  private getGuestUserCookies(response: Response, request: Request): number {
    const existingCookie = request.cookies['guestUserId'];
    let page_variant: number;

    if (existingCookie) {
      page_variant = request.cookies['page_variant_assigned'];
    } else {
      // Choose a random page variant
      page_variant = Math.round(Math.random());

      // Generate a guest user ID
      const guestUserId = uuidv4();

      // Set cookies
      response.cookie('page_variant_assigned', page_variant);
      response.cookie('guestUserId', guestUserId);
    }

    return page_variant;
  }

  private getAnalyticsApi(): any {
    console.log(`getAnalyticsApi`);
  }
}
