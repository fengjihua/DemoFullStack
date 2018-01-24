Lesson 1 reference: https://zhuanlan.zhihu.com/p/33123924

Lesson 2 reference: https://zhuanlan.zhihu.com/p/33249503

Server:

* RestfulAPI: Restful API for Paw
* RestfulAPI_swagger: Restful API for Swagger UI v2.\*
* Server/\*: Go Server files

Install some libraries first:

> go get github.com/gin-gonic/gin # Restful Web Server
> go get github.com/op/go-logging # Log API
> go get gopkg.in/mgo.v2 # Mongodb API

Client:

1: Please put the files on a server or local host to preview.

then preview:  
http://localhost/src/

2: Use Grunt and Bower

install node.js
go to the app root ./Client

> npm install -g grunt-cli

> npm install

> bower install

> npm start

> grunt build:dist

to build the 'dist' folder
