import { Injectable } from '@nestjs/common';
import { Supabase } from 'src/common/supabase/supabase';

const RECOMMEND = 'RECOMMEND_ITEM_TB';

@Injectable()
export class RecommendService {
    constructor(private readonly supabase: Supabase) {}

    async getRecommend(nationName) {
        const {data, error} = await this.supabase.getClient()
        .from(RECOMMEND)
        .select('*')
        .eq('nationName', nationName)
        .order('likeCount', {ascending: false})
        .limit(10);

        if (error) console.log(error);

        return data;
    }

    async updateLikeCount(recommendId, likeCount) {
        const {data, error} = await this.supabase.getClient()
        .from(RECOMMEND)
        .update({likeCount})
        .eq('id', recommendId).select();

        if (error) console.log(error);

        return data;
    }
}
