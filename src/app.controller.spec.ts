import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('pages', () => {
    it('should provide data for the about page', () => {
      expect(appController.about()).toEqual({});
    });

    it('should provide data for the live feed page', () => {
      expect(appController.apiPosts()).toEqual({});
    });
  });
});
