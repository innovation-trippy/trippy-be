import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';

const avsecUrl = 'https://www.avsec365.or.kr/';
const apiSearchUrl = 'https://www.avsec365.or.kr/avsc/airsforbid/list.do?searchCnd=ALL&searchWrd=';


// 금지물품 이름 가져오기
function parseItemName($: CheerioAPI, elem): string {
  var name;
  $(elem).find('span').each((index, elem) => {
    if (index == 0) name = $(elem).text();
  });
  return name;
}

// 이미지 태그에서 금지 이미지와 규칙 가져오기 
function parseImg($: CheerioAPI, elem, parse) {
  var parseThings = [];
  $(elem).find('img').each((index, elem) => {
    if (index > 0) parseThings = parse($, index, elem);
  });
  return parseThings;
} 

// 금지 이미지 가져오기
function parseForbidImg($: CheerioAPI, elem) {
  var imgSrc = [];
  parseImg($, elem, ($, index, elem) => {
    imgSrc[index - 1] = avsecUrl + $(elem).attr('src');
  })
  return imgSrc;
}

// 금지 규칙 가져오기
function parseForbidRule($: CheerioAPI, elem) {
  var imgAlt = [];
  parseImg($, elem, ($, index, elem) => {
    imgAlt[index - 1] = $(elem).attr('alt');
  })
  return imgAlt;
}

// 특별 규정 가져오기
function parseSpecialRule($: CheerioAPI, elem) {
  var specialRule;
  $(elem).find('.gap10').each((index, elem) => {
    specialRule = $(elem).find('p').text();
  });
  return specialRule;
}

async function parseForbidInfo(urlWithId: string): Promise<any> {
  let result = [];

  // 금지물품 id를 검색하는 avsec 페이지 가져오기 
  const response = await axios.get(urlWithId);

  // cheerio를 통해 웹페이지 가져오기
  var $ = load(response.data)

  // 금지물품 정보 가져오기
  const trElement = $('[id^="tr_"]');
  trElement.each(function (i, elem) {
    var name;
    var imgSrc = [];
    var forbidRule = [];
    var specialRule;

    name = parseItemName($, elem);
    imgSrc = parseForbidImg($, elem);
    forbidRule = parseForbidRule($, elem);
    specialRule = parseSpecialRule($, elem);

    // 금지물품 정보 담은 결과 생성
    result[i] = {
      name,
      imgSrc,
      forbidRule,
      specialRule,
    }
  });
  return result;
}

@Injectable()
export class AvsecService {
  constructor() { }

  async getForbidInfo(id: string): Promise<any> {
    const urlWithId = `${apiSearchUrl}${id}`;
    try {
      return parseForbidInfo(urlWithId);
    } catch (error) {
      console.log(error);
      return new Error('웹페이지를 가져오지 못했습니다.');
    }
  }
}