FROM node:18-alpine
RUN mkdir -p /home/Sapp 
COPY . /home/Sapp
RUN apk update && \
    apk add --no-cache nmap
CMD ["node","/home/Sapp/Scanner/src/app.js"]