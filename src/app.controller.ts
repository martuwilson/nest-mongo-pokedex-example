import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  getHome(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'public', 'index.html'));
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'Pokédex API is running!',
      timestamp: new Date().toISOString(),
    };
  }
}
