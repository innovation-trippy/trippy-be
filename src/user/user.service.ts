import { Injectable } from '@nestjs/common';
import { Supabase } from 'src/common/supabase/supabase';

@Injectable()
export class UserService {
    constructor(
        private readonly supabase: Supabase,
    ) { }

    async signInUserWithEmail(email, password) {
        const { data, error } = await this.supabase.getClient().auth.signInWithPassword({
            email, password,
        });

        const existingUser = data.user;

        return existingUser;
    }

    async signUpUserWithKakao(name, email, kakaoId) {
        const password = name + kakaoId
        const createdUser = await this.signUpUser(name, email, password);
        return createdUser;
    }

    async signUpUser(name, email, password) {
        const { data, error } = await this.supabase.getClient().auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                }
            },
        });

        const createdUser = data.user;

        return createdUser;
    }

}
