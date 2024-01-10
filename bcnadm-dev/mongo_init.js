function createDbUser(dbName) {
  db = db.getSiblingDB(dbName)
  user = db.getUser("root")
  if (!user) {
    db.createUser({
      user: "root",
      pwd: "root",
      roles: ["readWrite", "dbOwner"]
    })
  }
}

dbList = ['filedb', 'sequence', 'user', 'building', 'retrospective', 'monitor', 'trilat']
dbList.forEach(createDbUser)
