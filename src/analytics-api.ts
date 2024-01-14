import { Injectable } from '@nestjs/common';
import { ClickEventData, GuestUser } from './app.interface';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

class MockPageViewsEntryModel {
  aggregate(pipeline: any): any {
    return {
      exec: async () => {
        return [{ totalCount: 10 }];
      },
    };
  }
}

class MockClickEventsEntryModel {
  aggregate(pipeline: any): any {
    return {
      exec: async () => {
        return [{ totalCount: 20 }];
      },
    };
  }
}

@Injectable()
export class TrackingService {
  pageViewsEntryModel: any = new MockPageViewsEntryModel();
  clickEventsEntryModel: any = new MockClickEventsEntryModel();

  constructor(private readonly httpService: HttpService) {}
  async trackPageview(params: GuestUser): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<any>('https://ab-testing.adaptable.app/pageview', params)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  async trackEvent(
    guestUser: GuestUser,
    clickEventData: ClickEventData,
  ): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<any>('https://ab-testing.adaptable.app/event', {
          guestUser,
          clickEventData,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }

  /**
   * This method calculates the total number of unique page views by aggregating data
   * from the fictitious 'pageViewsEntryModel', which simulates a database collection
   * where each page view from an anonymous user is recorded. The collection is assumed
   * to store details such as IP address and user agent to identify unique users.
   *
   *

   */

  async getTotalPageViews(pageVariation: string): Promise<number> {
    try {
      const result = await this.pageViewsEntryModel
        .aggregate([
          {
            $match: {
              variationType: pageVariation, // Add your field and condition here
            },
          },
          {
            $group: {
              _id: { ipAddress: '$ipAddress', userAgent: '$userAgent' },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: null,
              totalCount: { $sum: '$count' },
            },
          },
        ])
        .exec();

      return result[0]?.totalCount || 0;
    } catch (error) {
      console.error('Error retrieving total page views:', error);
      throw error;
    }
  }

  /**
   * This method calculates the total number of unique click events by aggregating data
   * from the fictitious 'clickEventsEntryModel', which represents a database collection
   * simulating the storage of click event details, such as IP address and clicked element
   * ID. The collection is assumed to record each click event, and the method ensures that
   * clicks are counted as unique based on a combination of IP address and clicked element ID, and endpoint.
   **/
  async getTotalClickEvents(pageVariation: string) {
    try {
      const result = await this.clickEventsEntryModel
        .aggregate([
          {
            $match: {
              variationType: pageVariation,
            },
          },
          {
            $group: {
              _id: {
                ipAddress: '$ipAddress',
                clickedElementId: '$clickedElementId',
                domainVisited: '$domainVisited',
              },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: null,
              totalCount: { $sum: '$count' },
            },
          },
        ])
        .exec();

      return result[0]?.totalCount || 0;
    } catch (error) {
      console.error('Error retrieving total click events:', error);
      throw error;
    }
  }

  async getCtr() {
    try {
      const ctrControlVariation: number =
        await this.calculateCtrControlVariation();
      const ctrTestVariation: number = await this.calculateCtrTestVariation();

      const result = {
        ctrControlVariation,
        ctrTestVariation,
        message: 'CTR calculation successful',
      };

      return result;
    } catch (error) {
      console.error('Error calculating CTR:', error);
    }
  }

  async calculateCtrControlVariation(): Promise<number> {
    const totalPageViewsControlVariation: number =
      await this.getTotalPageViews('controlVariation');
    const totalClickEventsControlVariation: number =
      await this.getTotalClickEvents('controlVariation');

    // Calculate click-through rate (CTR) control variation
    const ctrControlVariation =
      totalClickEventsControlVariation / totalPageViewsControlVariation;

    return ctrControlVariation;
  }

  async calculateCtrTestVariation(): Promise<number> {
    const totalPageViewsTestVariation: number =
      await this.getTotalPageViews('testVariation');
    const totalClickEventsTestVariation: number =
      await this.getTotalClickEvents('testVariation');

    // Calculate click-through rate (CTR) test variation
    const ctrTestVariation =
      totalClickEventsTestVariation / totalPageViewsTestVariation;

    return ctrTestVariation;
  }
}
