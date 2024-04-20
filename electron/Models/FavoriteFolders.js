module.exports = (sequelize, { INTEGER }) => {
  const FavoriteFolders = sequelize.define(
    "FavoriteFolders",
    {
      Id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      FavoriteId: { type: INTEGER },
      FolderId: { type: INTEGER },
    },
    {
      uniqueKeys: {
        FavFolder_Unique: {
          fields: ["FavoriteId", "FolderId"],
        },
      },
    }
  );
  return FavoriteFolders;
};
