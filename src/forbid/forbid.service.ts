import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Supabase } from 'src/common/supabase/supabase';

const FORBID = 'FORBID_ITEM_TB';
const COMMENT = 'ITEM_COMMENT_TB';
const EXAMPLE_IMG = 'ITEM_EXAMPLE_IMG_TB';
const FORBID_IMG = 'ITEM_FORBID_RULE_TB';

@Injectable()
export class ForbidService {
    constructor(private readonly supabase: Supabase) { }

    async getForbidItem(nation, item) {
        const { data, error } = await this.supabase.getClient()
            .from(FORBID)
            .select(`id, 
            korName, 
            engName, 
            specialRule,
            ${EXAMPLE_IMG}(*), 
            ${FORBID_IMG}(*),
            nationName`)
            .or(`korName.ilike.%${item}%,engName.ilike.%${item}%`)
            .eq('nationName', nation);

        if (error)  console.log(error);

        return data;
    }

    async createForbidItem({ korName, engName, forbidImg, forbidRule, specialRule, exampleImg, nationName }) {
        const { data, error } = await this.supabase.getClient().from(FORBID).insert([{
            korName, engName, specialRule, nationName
        }]).select();

        if (error) {
            if (error.code === '23505') console.log('중복 값이 들어왔습니다');
            return
        }

        const itemId = data[0].id;

        forbidRule.forEach(async (elem, index) => {
            const { error } = await this.supabase.getClient().from(FORBID_IMG).insert([{
                itemId, forbidImgUrl: forbidImg[index], forbidRule: elem,
            }]);
            if (error) {
                throw new NotAcceptableException(error.message)
            }
        });

        for (const exampleImgUrl of exampleImg) {
            const { error } = await this.supabase.getClient().from(EXAMPLE_IMG).insert([{
                itemId, exampleImgUrl,
            }]);
            if (error) {
                throw new NotAcceptableException(error.message)
            }
        }

        return data;
    }
}
