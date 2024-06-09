# Base image
FROM python:3.8.19

# 작업 디렉토리 설정 (원하는 경로로 변경 가능)
WORKDIR /app

# 필요한 파일 복사 (requirements.txt 등)
COPY . .

RUN pip install beautifulsoup4
RUN pip install pymysql



CMD ["./pyscript.sh"]

