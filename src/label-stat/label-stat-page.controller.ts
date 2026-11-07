import {Controller,Get,Render} from '@nestjs/common';
import { LabelStatService } from './label-stat.service';
import { PublicAccess } from '../infrastructure/auth/decorators/public-access.decorator';

@PublicAccess()
@Controller()
export class LabelStatPageController {
    constructor(private readonly labelStatService: LabelStatService) {}

    @Get('stats')
    @Render('stats')
    async showStats() {
        const labelStats = await this.labelStatService.findAll();

        return { labelStats };
    }
}
