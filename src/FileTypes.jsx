import { useState } from "react";
import { getConfig, saveConfig } from "./Utils/db";
import { getTypes, saveTypes } from "./Utils/utils";

import "./config.css";

const tagStyle = {
  color: "white",
  textAlign: "center",
  margin: 0,
};

const FileTypes = () => {
  const [types, setTypes] = useState({ t: getTypes() });
  const [type, setType] = useState("");
  const [config, setConfig] = useState(getConfig());

  const removeType = (ty) => {
    const index = types.t.findIndex((t) => t === ty);
    if (index > -1) {
      types.t.splice(index, 1);
      setTypes({ ...types });
      saveTypes();
    }
  };

  const configChange = ({ target: { name, value } }) => {
    const newConfig = { ...config, [name]: value };
    saveConfig(newConfig);
    setConfig(newConfig);
  };

  const addType = () => {
    if (type && !types.t.includes(type)) {
      types.t.push(type);
      setTypes({ ...types });
      saveTypes();
      setType("");
    }
  };

  return (
    <div id="list">
      <h2 style={tagStyle}>Page Config</h2>
      <div id="app-config">
        <label htmlFor="">Item Per Page</label>
        <input type="number" name="itemPerPage" value={config.itemPerPage} onChange={configChange} />
      </div>
      <div id="app-f-list">
        <h2 style={tagStyle}>File Types</h2>
        <div id="files-list">
          <ul>
            {types.t.map((t, i) => (
              <li key={"f-" + i}>
                <i className="fas fa-trash-alt" onClick={(e) => removeType(t, e)}></i> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="list-control">
        <input
          type="text"
          value={type}
          onChange={({ target: { value } }) => setType(value)}
          onKeyDown={({ keyCode }) => keyCode === 13 && addType()}
          placeholder="Write the type and press enter"
        />
        <span className="add-icon" onClick={addType}>
          <i className="fas fa-plus-square"></i>
        </span>
      </div>
    </div>
  );
};

export default FileTypes;
