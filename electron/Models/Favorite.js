module.exports = (sequelize, { INTEGER, STRING }) => {
  const Favorite = sequelize.define("Favorites", {
    Id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: { type: STRING },
    Type: { type: STRING, allowNull: false, defaultValue: "Files" },
  });
  return Favorite;
};
