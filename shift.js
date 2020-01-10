conn = new Mongo()
db = conn.getDB("budget")
db.auth({
  user:"budgetdbuser",
  pwd:"BudgeT123456",
  mechanism:"SCRAM-SHA-1"
})

db.entries.updateMany({'type':'expense','period':null,$or:[{'paid':null},{'paid':false}],'date':{$gt:new Date(new Date().setDate(new Date().getMonth()-1)), $lt: new Date()}},{$set:{'date':new Date()}})
