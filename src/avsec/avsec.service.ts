import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';

const avsecUrl = 'https://www.avsec365.or.kr/';
const apiSearchUrl = 'https://www.avsec365.or.kr/avsc/airsforbid/list.do?searchCnd=ALL&searchWrd=';
const imgSearchUrl = 'https://www.avsec365.or.kr/etc/file/list.do';
const imgUrl = 'https://www.avsec365.or.kr/etc/file/image.do?fileNo=';

// 금지물품 이름 가져오기
function parseItemName($: CheerioAPI, elem) {
  var korName;
  var engName;
  $(elem).find('span').map((i, elem) => {
    if(i==0) korName = $(elem).text().trim();
    if(i==1) engName = $(elem).text().trim();
  });
  return [korName, engName];
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

// 물품 이미지 가져오기
async function parseExampleImg($: CheerioAPI, elem): Promise<any> {
  var forbidNo;
  var fileId;
  var exampleImg = [];

  [forbidNo, fileId] = $(elem).find('[id^="sampleId_"]').find('script').text().match(/\d+/g);
  const response = await axios.post(imgSearchUrl, 
    new URLSearchParams({
      fileId : fileId,
    }));
  const fileList = response.data.fileList
  if (fileList) {
    fileList.forEach((data)=>{
      exampleImg.push(imgUrl + data.fileNo)});
  }
  
  return exampleImg;
}

async function parseForbidInfo(urlWithId: string): Promise<any> {
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
    var imgSrc = [];
    var forbidRule = [];
    var specialRule;
    var exampleImg

    [korName, engName] = parseItemName($, elem);
    imgSrc = parseForbidImg($, elem);
    forbidRule = parseForbidRule($, elem);
    specialRule = parseSpecialRule($, elem);
    exampleImg = await parseExampleImg($, elem);

    // 금지물품 정보 담은 결과 생성
    result.push({
      korName,
      engName,
      imgSrc,
      forbidRule,
      specialRule,
      exampleImg,
    })
  };
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

  async test() {
    const urlWithId = `${apiSearchUrl}치약`;
    try {
      return parseForbidInfo(urlWithId);
    } catch (error) {
      console.log(error);
      return new Error('웹페이지를 가져오지 못했습니다.');
    }
  }
}