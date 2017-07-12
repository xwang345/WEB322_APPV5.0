const mongoose = require('mongoose');
let Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var contentSchema = new Schema({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "postedDate": Date,
     "replies": {
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "authorText": String,
        "repliedDate": Date
     }
});
var Comment; // to be defined on new connection (see initialize)

var dbURI = "mongodb://xwang345:Xlxc101302#@ds151752.mlab.com:51752/web322_a6"

module.exports.initialize = () => {
    console.log("============================================");
    console.log("===                                      ===");
    console.log("===           MongoDB initialize         ===");
    console.log("===                                      ===");
    console.log("============================================");
    console.log("\n")
    console.log(">>> DB dbURI: " + dbURI + " <<<");
    console.log("\n")
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(dbURI);
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            Comment = db.model("contentSchema", contentSchema);
            resolve();
        });
    });
};

module.exports.addComment = (data) => {
    console.log("============================================");
    console.log("===                                      ===");
    console.log("===    This is addComment function       ===");
    console.log("===                                      ===");
    console.log("============================================");
    data.postedDate = Date.now;
    // console.log(data);
    return new Promise((resolve, reject) => {
        let newComment = new Comment({data});
        newComment.save((err) => {
            if(err) {
                reject("There was an error saving the comment: ${err}");
            } else {
                console.log(">>>>>>>>>>>> Object is saving in the database.");
                console.log(">>>>>>>>>>>> " + newComment._id);
                resolve(newComment._id);
            }
        });
    });
}

module.exports.getAllComments = () => {
    console.log("=============================================");
    console.log("===                                       ===");
    console.log("===     This is getAllComments function   ===");
    console.log("===                                       ===");
    console.log("=============================================");
    // console.log(Comment);
    return new Promise((resolve, reject) => {
        console.log(Comment);
    Comment.find().sort().exec().then(() => {
            if(!postedDate) {
                reject();
                console.log("No company could be found");
            } else {
                resolve();
            }
        // exit the program after saving
            // process.exit();
        }).catch((err) => {
            console.log('There was an error: ${err}');
        });
    });
}

module.exports.addReply = (data) => {
    console.log("=============================================");
    console.log("===                                       ===");
    console.log("===    This is addReply function          ===");
    console.log("===                                       ===");
    console.log("=============================================");
    data._id = data._id;
    data.repliedDate = Date.now();
    console.log(data);
    return new Promise((resolve, reject) => {
        // if ( data._id == data.comment_id) {
            resolve(Comment.update({ _id: data.comment_id},
            { $addToSet: { replies: data } },
            { multi: false }).exec());
        // }
    }).catch(() => {
        reject();
    })
}
