import { BadRequestException, Controller, Get, Inject, Param, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ShortLongMapService } from './short-long-map.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ShortLongMapService)
  private shortLongMapService: ShortLongMapService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('short-url')
  getShortUrl(@Query('url') longUrl: string) {
    return this.shortLongMapService.generate(longUrl);
  }

  @Get(':code')
  @Redirect()
  async jump(@Param('code') shortUrl) {
    const longUrl = await this.shortLongMapService.getLongUrl(shortUrl);
    if(!longUrl) {
      throw new BadRequestException('短链不存在');
    }
    return {
      url: longUrl,
      statusCode: 302,
    }
  }
}
