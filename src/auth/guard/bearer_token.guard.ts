import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        
        const rawToken = req.headers['authorization'];

        if(!rawToken) {
            throw new UnauthorizedException('토큰이 없습니다.');
        }
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const result = await this.authService.verifyToken(token);

        req.token = token;
        req.tokenType = result.type;
        req.email = result.email;

        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        const req = context.switchToHttp().getRequest();

        return req.user;
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();
        
        if (req.tokenType !== 'refresh') {
            throw new UnauthorizedException('Refresh Token이 아닙니다.')
        }

        return true;
    }
}