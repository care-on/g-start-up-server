# Node.js 기�<98> ?<9d>�미�??�? �?? �?<98>�?<8b><88>?<8b>�.
FROM node:20

# ?<95>� ?<94><94>? <89>?<86> 리�?? ?<83><9d>?<84>�?<95><98>�? ?<9e><91>?<97><85> ?<94><94>? <89>?<86> 리�<9c> ?<84>�? <95>?<95>�?<8b><88>?<8b>�.
WORKDIR /usr/src/app
# ?<95>� �<85>�<86><8d>?<84>� ?<84>��?
COPY package*.json ./
RUN npm i
RUN npm i ts-node -g
RUN npm i pm2 -g
RUN npm i bcrypt @types/bcrypt
# ?<95>� ?<86><8c>?<8a>� 복�<82>�
COPY . .

# ?<95>� ?<8b>�?<96><89>
# pm2 start --interpreter ts-node app.ts
CMD ["ts-node", "server.ts"]
#CMD ["pm2","start","--interpreter","ts-node","server.ts"]
