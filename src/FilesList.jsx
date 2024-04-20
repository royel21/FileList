import { useState } from "react";

import List from "./List";
import ScanList from "./ScanList";
import TabItem from "./Components/TabItem";
import ToolBar from "./Components/Toolbar";
import FileTypes from "./FileTypes";
import FavList from "./FavList";
import usePopup from "./Hooks/usePopup";

const getTab = (p) => ({
  list: <List {...p} />,
  favs: <FavList {...p} />,
  scanlist: <ScanList />,
  ex: <FileTypes />,
});

const FilesList = () => {
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState("list");
  const selectTab = ({ target: { id } }) => setTab(id.replace("tab-", ""));

  const p = { filter, setFilter };

  usePopup();

  return (
    <>
      <ToolBar />
      <div id="navbar">
        <TabItem id="tab-list" checked={tab === "list"} onChange={selectTab}>
          <i className="fas fa-file"></i> <span>Files</span>
        </TabItem>
        <TabItem id="tab-favs" checked={tab === "favs"} onChange={selectTab}>
          <i className="fas fa-star"></i> <span>Favorites</span>
        </TabItem>
        <TabItem id="tab-scanlist" checked={tab === "scanlist"} onChange={selectTab}>
          <i className="fas fa-folder"></i> <span>Scan Directories</span>
        </TabItem>
        <TabItem id="tab-ex" checked={tab === "ex"} onChange={selectTab}>
          <i className="fas fa-photo-video"></i> <span>File Types</span>
        </TabItem>
      </div>
      {getTab(p)[tab]}
    </>
  );
};

export default FilesList;
