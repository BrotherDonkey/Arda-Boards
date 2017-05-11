var TopicSchema = new Schema({
    title: {type: String, default: "title-less serf topic"},
    text: {type: String, default: "string not saved"},
    createdAt: {type: Date, default: Date.now },
    comments: [CommentSchema], //place Comment Schema as the only element in this array, as a signal to Mongo that they're related.
    author: {type: String, default: "anonymous"}
});


var exampleTopic = {
    "title": "This is the post title",
    "text": "This is the entire post of the topic right here, posted again and again. This is the entire post of the topic right here, posted again and again.This is the entire post of the topic right here, posted again and again.",
    "author": "The Author of the Topic"
}

