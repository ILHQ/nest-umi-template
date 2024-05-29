
FROM node:16-slim

LABEL author="zlfront"

ENV ARRANGE_PATH=/home/admin/source

WORKDIR $ARRANGE_PATH

COPY ./object-modeling_0.0.1.zip ./
RUN apt-get update && apt-get install unzip
RUN unzip ./object-modeling_0.0.1.zip
RUN rm ./object-modeling_0.0.1.zip
RUN npm config set registry https://registry.npmmirror.com && npm install pm2@latest -g
WORKDIR $ARRANGE_PATH/object-modeling_0.0.1/bin

EXPOSE 3000

CMD ["pm2-runtime", "start", "start.sh", "--name", "object-modeling_0.0.1"]
    