const Sequelize = require("sequelize");
const os = require("os");
const path = require("path");
const fs = require("fs-extra");

const baseDir = path.join(os.homedir(), ".rc-studio", "db-common");

if (!fs.existsSync(baseDir)) fs.mkdirsSync(baseDir);

const storage = process.env.local ? "../files.db" : path.join(baseDir, "files.db");

const DataTypes = Sequelize.DataTypes;
const sequelize = new Sequelize(null, null, null, {
  logging: false,
  dialect: "sqlite",
  storage,
  define: {
    timestamps: false,
  },
});

const db = {};

db.Op = Sequelize.Op;
db.sqlze = sequelize;

db.Directory = require("./Directory")(sequelize, DataTypes);
db.Folder = require("./Folder")(sequelize, DataTypes);
db.File = require("./File")(sequelize, DataTypes);
db.Favorite = require("./Favorite")(sequelize, DataTypes);
db.FavoriteFile = require("./FavoriteFiles")(sequelize, DataTypes);
db.FavoriteFolder = require("./FavoriteFolders")(sequelize, DataTypes);

db.Directory.hasMany(db.Folder, { foreignKey: "DirectoryId", onDelete: "CASCADE", constraints: true });

db.Directory.hasMany(db.File, { foreignKey: "DirectoryId", onDelete: "CASCADE", constraints: true });

db.Folder.belongsTo(db.Directory);

db.Favorite.belongsToMany(db.File, {
  as: "Files",
  foreignKey: "FavoriteId",
  otherKey: "FileId",
  through: db.FavoriteFile,
  foreignKeyConstraint: true,
});

db.Favorite.belongsToMany(db.Folder, {
  as: "Folders",
  foreignKey: "FavoriteId",
  otherKey: "FolderId",
  through: db.FavoriteFolder,
  foreignKeyConstraint: true,
});

db.init = async (force = false) => {
  await sequelize.sync({ force });
};

module.exports = db;
