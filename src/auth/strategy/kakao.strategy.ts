import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-kakao";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get('REST_API_KEY'),
            clientSecret: '',
            callbackURL: `${configService.get('REDIRECT_URI')}`,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void,
    ) {
        try {
            const { _json } = profile;
            const user = {
                kakaoId: _json.id,
                email: _json.kakao_account.email,
                name: _json.kakao_account.profile.nickname,
            };
            const kakaoToken = accessToken
            const tokenUser = {
                kakaoToken,
                user,
            }

            done(null, tokenUser);

        } catch (error) {
            done(error);
        }
    }
}