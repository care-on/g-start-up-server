# Base image
FROM python:3.8.19

# 작업 디렉토리 설정 (원하는 경로로 변경 가능)
WORKDIR /app

# 필요한 파일 복사 (requirements.txt 등)
COPY . .

RUN pip install flask
RUN pip install flask_cors
RUN pip install Flask-RestX
RUN pip install openai
# 필요한 패키지 설치


# 애플리케이션 파일 복사

# 애플리케이션 실행 (원하는 명령어로 변경 가능)
CMD ["python", "app.py"]

