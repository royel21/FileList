const path = require("path");

module.exports = (sequelize, { INTEGER, DATE, STRING, VIRTUAL, DOUBLE }) => {
  const File = sequelize.define(
    "Files",
    {
      Id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: STRING,
        allowNull: false,
      },
      Dir: { type: STRING, allowNull: false },
      Path: {
        type: VIRTUAL,
        get() {
          return path.join(this.Dir, this.Name);
        },
      },
      Size: {
        type: INTEGER,
        defaultValue: 0,
      },
      LastModified: {
        type: DATE,
      },
      Extension: {
        type: VIRTUAL,
        get() {
          return this.Name.split(".").pop();
        },
      },
      Pos: {
        type: DOUBLE(6, 2),
        defaultValue: 0,
      },
      Duration: {
        type: DOUBLE(6, 2),
        defaultValue: 0,
      },
      DirectoryId: {
        type: INTEGER,
      },
    },
    {
      uniqueKeys: {
        Uniq_File: {
          fields: ["Name", "Dir"],
        },
      },
    }
  );
  return File;
};
