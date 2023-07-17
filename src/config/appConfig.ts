import { validate, IsNotEmpty } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
class AppConfig {
  @IsNotEmpty()
  port: string;

  @IsNotEmpty()
  dbUrl: string;
  
  @IsNotEmpty()
  crossOrigins: string[];
}

const appConfig = new AppConfig();
appConfig.port = process.env.PORT;
appConfig.dbUrl = process.env.MONGODB_URL;
appConfig.crossOrigins = process.env.CORS_ORIGIN.split(',');

(async () => {
  const errors = await validate(appConfig);
  if (errors && errors.length) {
    throw new InternalServerErrorException('Missing appConfig!');
  }
})();

export default appConfig;
