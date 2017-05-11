# Arda Boards
--------------
A site devoted to discussing Arda, the mythical world imagine and popularized by J.R.R. Tolkien.

#### Specs
Arda, soon to be a welcoming community for fantasy-lit lovers, is also pretty MEAN. It's an ExpressJS server for both routes and API. On the front end Arda Boards enlists some old school Angular, Bootstrap, and Jade templating magic. It was built mostly on Cloud9's sweet online IDE.

## Roadmap
The trek to Mordor didn't happen in a day.

#### General Todos
+ Connect POST routes to individual topics (singleTopic.pug)
+ Connect voting API to comments on /rivendell and singleTopic.pug.
+ Connect DELETE routes to front end.
+ Connect PUT routes to front end.
+ Created voting verification system
    - Array of trimmed userIDs, binary search to verify.
+ Find a better way to update state without reloading.
+ Expand user schema and profile to include more information.
+ Create routes to user profiles via /:username.


#### Possible bugs:
+ Current Problem with conditional logic on login. I wonder if this is the source: http://mongoosejs.com/docs/promises.html


## Helpful links:
Helpful for me, at least.
#### Setup on Cloud9
+ [Running Node on C9](http://stackoverflow.com/questions/15087953/running-hello-world-using-node-js-express-in-cloud-9ide)
+ [Setting up mongo on C9](https://community.c9.io/t/setting-up-mongodb/1717)


## Notes:
#### running mongod on c9:
Because of file size restraints, Mongo needs a little massaging.
```
mongod --smallfiles (works)
mongod --nojournal (works)
<!--Both together-->
mongod --nojournal --smallfiles
```
This also fixes a problem involving a [bad shutdown --> Mongo Docs](https://docs.mongodb.com/manual/tutorial/recover-data-following-unexpected-shutdown/).

#### Angular and Pug
Great article on [integrating Angular into Pug](https://codepen.io/khilnani/pen/GKcwD https://glebbahmutov.com/blog/angularjs-inside-jade-templates/). Hint, it's just like you'd think!

#### Mongoose Schema Type
See [their docs](http://mongoosejs.com/docs/2.7.x/docs/schematypes.html)