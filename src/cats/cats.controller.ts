import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { AllExceptionsFilter } from '../http-exception.filter';

@Controller('cats')
@UseFilters(AllExceptionsFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post('/create')
  @HttpCode(200)
  create(@Body() createCatDto: CreateCatDto): object {
    this.catsService.create(createCatDto);
    return {
      data: '',
      message: 'ok',
    };
  }

  @Get('/all')
  findAll(): Cat[] {
    return this.catsService.findAll();
  }

  @Get('/error')
  getError(): any {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }
}
