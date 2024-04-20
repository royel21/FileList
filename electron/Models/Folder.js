module.exports = (sequelize, { INTEGER, STRING }) => {
  const Folder = sequelize.define("Folders", {
    Id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: STRING(255),
      allowNull: false,
    },
    Path: {
      type: STRING(255),
      unique: true,
      allowNull: false,
    },
    DirectoryId: {
      type: INTEGER,
    },
    Count: {
      type: INTEGER,
      default: 0,
    },
  });
  return Folder;
};
