import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    // 카카오 유저 로그인
    async validateKakaoUser(user) {
        const verifiedUser = await this.loginWithEmail(user.email, user.name + user.kakaoId);
        if (!verifiedUser) {
            const createdUser = await this.userService.signUpUserWithKakao(user.name, user.email, user.kakaoId);
            return createdUser;
        }
        return verifiedUser;
    }

    // 카카오 로그아웃
    // async signOutWithKakao(access_token) {

    //     if (!access_token) {
    //         return false;
    //     }

    //     const tokenHeaders = {
    //         'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    //         'Authorization': `Bearer ${access_token}`,
    //     };

    //     const kakao_logout_url = 'https://kapi.kakao.com/v1/user/logout';

    //     const response = this.httpService.post(kakao_logout_url, '', {
    //         headers: tokenHeaders,
    //     });

    //     const res = await firstValueFrom(response);

    //     return true;
    // }

    // 이메일 유저 로그인
    async loginWithEmail(email, password) {
        const verifiedUser = await this.userService.signInUserWithEmail(email, password);
        return verifiedUser;
    }

    // 회원가입
    async signUpUser(name, email, password) {
        const user = await this.userService.signUpUser(
            name,
            email,
            password,
        );

        if (!user) throw new UnauthorizedException('이미 존재하는 이메일입니다');

        return user;
    }

    // jwt 토큰 발급
    signToken(user, isRefreshToken: boolean) {
        const { email } = user;
        const payload = {
            email,
            type: isRefreshToken ? 'refresh' : 'access',
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: isRefreshToken ? 3600 : 300,
        });
    }

    async getToken(user) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        }
    }

    async getTokenWithKakao(user) {
        const verifiedUser = await this.validateKakaoUser(user);
        return this.getToken(verifiedUser);
    }


    // 토큰 검증
    extractTokenFromHeader(header: string, isBearer: boolean) {
        const splitToken = header.split(' ');
        const prefix = isBearer ? 'Bearer' : 'Basic';
        if (splitToken.length !== 2 || splitToken[0] !== prefix) {
            throw new UnauthorizedException('잘못된 토큰');
        }
        const token = splitToken[1];
        return token;
    }

    decodeBasicToken(base64String: string) {
        const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

        const split = decoded.split(':');
        if (split.length !== 2) {
            throw new UnauthorizedException('잘못된 유형의 토큰');
        }

        const email = split[0];
        const password = split[1];

        return {
            email,
            password
        }
    }

    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
        } catch (e) {
            throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다');
        }
    }

    // 토큰 재발급
    rotateToken(token: string, isRefreshToken: boolean) {
        const decoded = this.jwtService.verify(token, {
            secret: this.configService.get('JWT_SECRET'),
        });

        if (decoded.type !== 'refresh') {
            throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다');
        }

        return this.signToken({
            ...decoded,
        }, isRefreshToken);
    }

}
