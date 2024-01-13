import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getTest(@Req() request: Request, @Res() response: Response) {
    console.log(request.cookies);
    const { page_variant } = this.appService.getTestMessage(response, request);
    return { page_variant };
  }
}
