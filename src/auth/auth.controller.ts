import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic_token.guard';
import { RefreshTokenGuard } from './guard/bearer_token.guard';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  // 카카오 로그인
  @Get('login/kakao')
  async signInWithKakao(
    @Res() res,
  ): Promise<void> {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.get('REST_API_KEY')}&redirect_uri=${this.configService.get('REDIRECT_URI')}`
    res.redirect(url);
  }

  @Get('oauth')
  @UseGuards(AuthGuard())
  async oauthWithKakao(
    @Req() req,
    @Res() res,
  ) {
    const { accessToken, refreshToken } = await this.authService.getTokenWithKakao(
      req.user.user,
    );
    res.cookie('kakaoToken', req.user.kakaoToken, { httpOnly: true });
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.redirect('http://trippy.kr/check');
  }

  // 회원가입
  @Post('register/email')
  createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signUpUser(name, email, password);
  }

  // 로그인
  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  async loginWithEmail(
    @Req() req,
    @Res() res,
  ) {
    const { accessToken, refreshToken } = await this.authService.getToken(
      req.user,
    );
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return res.send({
      message: 'success'
    });
  }

  // jwt 토큰 없애기
  @Get('logout')
  logout(
    @Req() req,
    @Res() res,
  ) {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });

    // const kakaoToken = req.cookies.kakaoToken;

    // if (kakaoToken) {
    //   this.authService.signOutWithKakao(kakaoToken);
    //   res.cookie('kakaoToken', '', {maxAge: 0});
    // }

    return res.send({
      message: 'success'
    })
  }

  // access 토큰 재발급
  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(
    @Req() req,
    @Res() res,
  ) {
    const token = req.token;

    const newToken = this.authService.rotateToken(token, false);

    console.log('access token rotated');

    res.cookie('accessToken', newToken, { httpOnly: true });
    return res.send({
      message: 'success'
    });
  }

  // refresh 토큰 재발급
  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(
    @Req() req,
    @Res() res,
  ) {
    const token = req.token;

    const newToken = this.authService.rotateToken(token, true);

    console.log('refresh token rotated');

    res.cookie('refreshToken', newToken, { httpOnly: true });
    return res.send({
      message: 'success'
    });
  }
}
