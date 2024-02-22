import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import { ForbidService } from 'src/forbid/forbid.service';

const avsecUrl = 'https://www.avsec365.or.kr/';
const apiSearchUrl = 'https://www.avsec365.or.kr/avsc/airsforbid/list.do?searchCnd=ALL&searchWrd=';
const imgSearchUrl = 'https://www.avsec365.or.kr/etc/file/list.do';
const imgUrl = 'https://www.avsec365.or.kr/etc/file/image.do?fileNo=';

@Injectable()
export class AvsecService {
  constructor(
    private readonly forbidService: ForbidService,
  ) { }

  // 금지물품 이름 가져오기
  parseItemName($: CheerioAPI, elem) {
    var korName;
    var engName;
    $(elem).find('span').map((i, elem) => {
      if (i == 0) korName = $(elem).text().trim();
      if (i == 1) engName = $(elem).text().trim();
    });
    return [korName, engName];
  }

  // 이미지 태그에서 금지 이미지와 규칙 가져오기 
  parseImg($: CheerioAPI, elem, parse) {
    var parseThings = [];
    $(elem).find('img').each((index, elem) => {
      if (index > 0) parseThings = parse($, index, elem);
    });
    return parseThings;
  }

  // 금지 이미지 가져오기
  parseForbidImg($: CheerioAPI, elem) {
    var imgSrc = [];
    this.parseImg($, elem, ($, index, elem) => {
      imgSrc[index - 1] = avsecUrl + $(elem).attr('src');
    })
    return imgSrc;
  }

  // 금지 규칙 가져오기
  parseForbidRule($: CheerioAPI, elem) {
    var imgAlt = [];
    this.parseImg($, elem, ($, index, elem) => {
      imgAlt[index - 1] = $(elem).attr('alt');
    })
    return imgAlt;
  }

  // 특별 규정 가져오기
  parseSpecialRule($: CheerioAPI, elem) {
    var specialRule;
    $(elem).find('.gap10').each((index, elem) => {
      specialRule = $(elem).find('p').text();
    });
    return specialRule;
  }

  // 물품 이미지 가져오기
  async parseExampleImg($: CheerioAPI, elem): Promise<any> {
    var forbidNo;
    var fileId;
    var exampleImg = [];

    [forbidNo, fileId] = $(elem).find('[id^="sampleId_"]').find('script').text().match(/\d+/g);
    const response = await axios.post(imgSearchUrl,
      new URLSearchParams({
        fileId: fileId,
      }));
    const fileList = response.data.fileList
    if (fileList) {
      fileList.forEach((data) => {
        exampleImg.push(imgUrl + data.fileNo)
      });
    }

    return exampleImg;
  }

  async parseForbidInfo(urlWithId: string): Promise<any> {
    let result = [];

    // 금지물품 id를 검색하는 avsec 페이지 가져오기 
    const response = await axios.get(urlWithId);

    // cheerio를 통해 웹페이지 가져오기
    var $ = load(response.data)

    // 금지물품 정보 가져오기
    const trElement = $('[id^="tr_"]');
    for (const elem of trElement) {
      var korName;
      var engName;
      var forbidImg = [];
      var forbidRule = [];
      var specialRule;
      var exampleImg

      [korName, engName] = this.parseItemName($, elem);
      forbidImg = this.parseForbidImg($, elem);
      forbidRule = this.parseForbidRule($, elem);
      specialRule = this.parseSpecialRule($, elem);
      exampleImg = await this.parseExampleImg($, elem);

      // 금지물품 정보 담은 결과 생성
      result.push({
        korName,
        engName,
        forbidImg,
        forbidRule,
        specialRule,
        exampleImg,
      })
    };
    return result;
  }

  async getForbidInfo(item: string): Promise<any> {
    const urlWithId = `${apiSearchUrl}${item}`;
    try {
      return await this.parseForbidInfo(urlWithId);
    } catch (error) {
      console.log(error);
      return new Error('웹페이지를 가져오지 못했습니다.');
    }
  }

  // async saveForbidInfo(item: string) {
  //   const urlWithId = `${apiSearchUrl}${item}`;
  //   try {
  //     const forbidItemInfo = await this.parseForbidInfo(urlWithId);
      
  //     for (const elem of forbidItemInfo) {
  //       try {
  //         this.forbidService.createForbidItem(elem);
  //       } catch(e) {
  //         throw new Error('데이터 저장에 실패했습니다.');
  //       }
  //     }
      
  //     return forbidItemInfo;
  //   } catch (error) {
  //     console.log(error);
  //     return new Error('웹페이지를 가져오지 못했습니다.');
  //   }
  // }

  // async saveUsForbidInfo() {
  //   // const urlWithId = `${apiUsSearchUrl}`;
  //   const urlWithId = 'https://www.tsa.gov/travel/security-screening/whatcanibring/all-list';
  //   try {
  //     const response = await axios.get(urlWithId);
  //     const $ = load(response.data);
  //     const trElements = $('.view-content > table > tbody > tr');
  //     var i = 0
  //     for (const elem of trElements) {
  //       const engName = $(elem).find('strong').text().trim();
  //       const specialRule = $(elem).find('p').text().trim();

  //       const forbidRule = [];
  //       const nationName = 'Canada';
  //       $(elem).find('td > span').each((i, el) => {
  //         const forbid = (i == 0) ? '기내휴대' : '위탁수하물';

  //         const rules = $(el).text().trim();
  //         if (rules) {
  //           const checkForbid = rules.split(' ');

  //           const rule = checkForbid[0] == 'No' ? ' X' : ' O';
  //           forbidRule.push(forbid + rule);

  //           if (checkForbid.length == 3 &&
  //             checkForbid[1] + ' ' + checkForbid[2] == '(Special Instructions)') {

  //             if (!forbidRule.includes('특별조항')) {
  //               forbidRule.push('특별조항');
  //             }
  //           }
  //         }
  //         else {
  //           forbidRule.push($(el).text().trim())
  //         }
  //       })
  //       const data = { korName:'', engName, forbidImg:[],forbidRule, specialRule, exampleImg:[], nationName };
  
  //       this.forbidService.createForbidItem(data);
  //     }
  //     return response.data
  //   } catch (error) {
  //     console.log(error);
  //     return new Error('웹페이지를 가져오지 못했습니다.');
  //   }
  // }


  async test() {
    const urlWithId = `${apiSearchUrl}치약`;
    try {
      return this.parseForbidInfo(urlWithId);
    } catch (error) {
      console.log(error);
      return new Error('웹페이지를 가져오지 못했습니다.');
    }
  }
}