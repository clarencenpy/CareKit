Messages = new Mongo.Collection('messages')
Meteor.startup(() => {
  return
  //noinspection UnreachableCodeJS
  Messages.update({name: ''}, {
    name: '',
    contents: {/* insert document here */}
  }, {upsert: true})
})
