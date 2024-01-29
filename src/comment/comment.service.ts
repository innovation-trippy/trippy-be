import { Injectable } from '@nestjs/common';
import { Supabase } from 'src/common/supabase/supabase';

const COMMENT = 'ITEM_COMMENT_TB';

@Injectable()
export class CommentService {
    constructor(
        private readonly supabase: Supabase,
    ) {}

    async getComment(itemId) {
        const {data, error} = await this.supabase.getClient()
        .from(COMMENT)
        .select('*')
        .eq('itemId', itemId);

        if(error) console.log(error)

        return data;
    }

    async createComment(userEmail, itemId, content) {
        const {data, error} = await this.supabase.getClient()
        .from(COMMENT)
        .insert([{userEmail, itemId, content}])
        .select();

        if (error) console.log(error)

        return data;
    }

    async updateComment(userEmail, commentId, itemId, content?) {
        const {data, error} = await this.supabase.getClient()
        .from(COMMENT)
        .update({content})
        .eq('id', commentId)
        .eq('userEmail', userEmail)
        .eq('itemId', itemId).select();

        if (error) console.log(error)

        return data;
    }

    async deleteComment(userEmail, commentId) {
        const {data, error} = await this.supabase.getClient()
        .from(COMMENT)
        .delete()
        .eq('id', commentId)
        .eq('userEmail', userEmail);

        console.log(data)
        console.log(error)
        return data;
    }
}
