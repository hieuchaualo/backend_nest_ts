import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, VerifiedCallback, Strategy } from 'passport-jwt';
import { AccountsService } from './accounts.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly accountsService: AccountsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any, callback: VerifiedCallback): Promise<any> {
    const account = await this.accountsService.checkByPayload(payload);
    if (!account) return callback(new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED))
    return callback(null, account, payload); 
  }
} 