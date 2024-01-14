import {
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

  @Post('/pageview')
  async postPageViews(): Promise<any> {
    return 'Fake tracker for the pageviews';
  }
}
