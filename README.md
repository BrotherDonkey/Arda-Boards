#Arda Boards

A server, API, and website for the discussion of Tolkien's lore and the magical universe of Arda. This site uses Pug (formerly Jade) templates, MongoDB, and Express server framework for NodeJS. Built mostly on Cloud9's IDE.

###Helpful links:

##Express and Mongo on Cloud9

http://stackoverflow.com/questions/15087953/running-hello-world-using-node-js-express-in-cloud-9ide

https://community.c9.io/t/setting-up-mongodb/1717

run mongod:

```
mongod --smallfiles (works)
mongod --nojournal (this works)
or: mongod --nojournal --smallfiles
```

Current Problem with conditional on login
I wonder if this is the source: 
http://mongoosejs.com/docs/promises.html

Problem involving a bad shutdown:
https://docs.mongodb.com/manual/tutorial/recover-data-following-unexpected-shutdown/

Integrating Angular into Pug templates:
https://codepen.io/khilnani/pen/GKcwD
https://glebbahmutov.com/blog/angularjs-inside-jade-templates/