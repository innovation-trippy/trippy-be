# build stage
# 사용하는 node 버전 (alpine은 클라우드 환경을 고려한 가벼운 리눅스 이미지)
FROM node:18-alpine

# RUN,CMD의 명령이 실행될 디렉토리 경로
WORKDIR /usr/src/app

# COPY (복사할 파일 경로) (이미지에서 파일이 위치할 경로)
COPY package*.json ./

# 이미지 실행 시 사용될 명령어
RUN npm install
COPY . .

# FROM에서 설정한 이미지 위에서 스크립트 혹은 명령을 실행
RUN npm run build

# Start the server using the production build
CMD [ "npm", "start:prod" ]