module.exports = (sequelize, { INTEGER }) => {
  const FavoriteFiles = sequelize.define(
    "FavoriteFiles",
    {
      Id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      FavoriteId: { type: INTEGER },
      FileId: { type: INTEGER },
    },
    {
      uniqueKeys: {
        FavFile_Unique: {
          fields: ["FavoriteId", "FileId"],
        },
      },
    }
  );
  return FavoriteFiles;
};
