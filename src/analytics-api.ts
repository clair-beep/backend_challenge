import { Injectable } from '@nestjs/common';
import { ClickEventData, GuestUser } from './app.interface';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class TrackingService {
  constructor(private readonly httpService: HttpService) {}
  async trackPageview(params: GuestUser): Promise<any> {
    console.log(
      `--> Tracking Pageview: ${params.domainVisited} from IP: ${params.ipAddress} that was visited at: ${params.createdAt} and this is the user agent: ${params.userAgent}`,
    );

    const { data } = await firstValueFrom(
      this.httpService.post<any>('http://localhost:3000/pageview', params).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  async trackEvent(guestUser: GuestUser, clickEventData: ClickEventData): Promise<any> {
    console.log(
      `--> Tracking Event: ${guestUser.domainVisited} from IP: ${guestUser.ipAddress} that was visited at: ${guestUser.createdAt} and this is the user agent: ${guestUser.userAgent}`,
    );

    console.log(`Related to the click event: ${clickEventData.clickedElementId}, ${clickEventData.clickedElementText}, ${clickEventData.name}, ${clickEventData.version}`)


    const { data } = await firstValueFrom(
      this.httpService.post<any>('http://localhost:3000/event', { guestUser, clickEventData }).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
