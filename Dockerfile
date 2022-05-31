FROM node:14.15.4-slim

#usuario do container 
RUN usermod -u 268651330 node

USER node

WORKDIR /home/node/app

CMD [ "sh", "-c", "npm install && tail -f /dev/null" ]