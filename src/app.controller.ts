import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Version,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { ClickEventData } from './app.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version('1')
  @Get('/')
  @Render('index')
  async getIndex(@Req() request: Request, @Res() response: Response) {
    console.log(`getTest`, request.cookies);
    const { pageVariant } = this.appService.getTestMessage(response, request);
    return { pageVariant };
  }

  @Version('1')
  @Get('/signup')
  async getSignUp(): Promise<any> {
    return 'Fake signup endpoint';
  }

  @Version('1')
  @Post('/pageview')
  async postPageViews(): Promise<any> {
    return 'Fake tracker for the pageviews';
  }

  @Version('1')
  @Post('/event')
  async postClickEvent(): Promise<any> {
    return 'Fake tracker for the click event';
  }

  @Version('1')
  @Post('/clickEvent')
  getGuestUserClickEvent(
    @Req() request: Request,
    @Res() response: Response,
    @Body() clickEventData: ClickEventData,
  ) {
    this.appService.getGuestUserClickEvent(response, request, clickEventData);
  }
}
