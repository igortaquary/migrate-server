import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const DocLogin = () =>
  applyDecorators(
    ApiResponse({
      schema: { example: { access_token: 'd19hd2h3ndsdc982j3ensdsfs' } },
    }),
  );
