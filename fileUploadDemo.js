YourFileCollection = new FS.Collection("yourFileCollection", {
  stores: [new FS.Store.FileSystem("yourFileCollection", {path: "~/meteor_uploads"})]
});
YourFileCollection.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  download: function (userId, doc) {
    return true;
  }
});

if (Meteor.isClient) {
  Meteor.subscribe("fileUploads");
  Template.fileList.helpers({
    theFiles: function () {
      return YourFileCollection.find();
    }
  });

  Template.fileList.events({
    'click #deleteFileButton ': function (event) {
      console.log("deleteFile button ", this);
      YourFileCollection.remove({_id: this._id});
    },
    'change .your-upload-class': function (event, template) {
      console.log("uploading...")
      FS.Utility.eachFile(event, function (file) {
        console.log("each file...");
        var yourFile = new FS.File(file);
        YourFileCollection.insert(yourFile, function (err, fileObj) {
          console.log("callback for the insert, err: ", err);
          if (!err) {
            console.log("inserted without error");
          }
          else {
            console.log("there was an error", err);
          }
        });
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("fileUploads", function () {
    console.log("publishing fileUploads");
    return YourFileCollection.find();
  });
}
