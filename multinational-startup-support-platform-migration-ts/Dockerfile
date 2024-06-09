# Node.js ê¸°ë°<98> ?<9d>´ë¯¸ì??ë¥? ê°?? ¸?<98>µ?<8b><88>?<8b>¤.
FROM node:20

# ?<95>± ?<94><94>? <89>?<86> ë¦¬ë?? ?<83><9d>?<84>±?<95><98>ê³? ?<9e><91>?<97><85> ?<94><94>? <89>?<86> ë¦¬ë¡<9c> ?<84>¤? <95>?<95>©?<8b><88>?<8b>¤.
WORKDIR /usr/src/app
# ?<95>± ì¢<85>ì<86><8d>?<84>± ?<84>¤ì¹?
COPY package*.json ./
RUN npm i
RUN npm i ts-node -g
RUN npm i pm2 -g
RUN npm i bcrypt @types/bcrypt
# ?<95>± ?<86><8c>?<8a>¤ ë³µì<82>¬
COPY . .

# ?<95>± ?<8b>¤?<96><89>
# pm2 start --interpreter ts-node app.ts
CMD ["ts-node", "server.ts"]
#CMD ["pm2","start","--interpreter","ts-node","server.ts"]
