import { useState, useEffect, useRef } from "react";
import { getConfig, getFiles } from "./Utils/db";
import FileContextMenu from "./Components/FileContextMenu";
import Pager from "./Components/Pager";
import { shell, fs, listIcons, clipboard } from "./Utils/utils";
import ModalBrowser from "./Components/ModalBrowser";
import prettyBytes from "pretty-bytes";
import Input from "./Components/Input";

const List = ({ filter, setFilter }) => {
  const filterRef = useRef({ filter });
  const [showM, setShowM] = useState();
  const [showBrw, setShowBrw] = useState();
  const [datas, setDatas] = useState({
    files: [],
    page: 0,
    totalPages: 0,
    count: 0,
  });

  const load = async (ftl, page) => {
    const result = await getFiles(ftl, page);
    setFilter(ftl);
    filterRef.current.filter = ftl;
    setDatas({ ...result });
  };

  const onFilter = ({ target: { value } }) => load(value, 0);

  const clear = () => onFilter({ target: { value: "" } });

  const loadPage = ({ page }) => {
    document.querySelector("#files-list")?.scrollTo(0, 0);
    load(filter, page);
  };

  const itemClick = async (f, { target }) => {
    if (fs.existsSync(f.Path) && !target.classList.contains("fas")) {
      shell.openExternal("file-manager://file=" + f.Path);
    }
  };

  const showMenu = (e, f) => setShowM({ file: f, y: e.pageY, x: e.pageX });

  const removeRecent = (f) => {
    try {
      fs.removeSync(f.Path);
    } catch (error) {
      console.error(error);
    }
    f.destroy().then(() => {
      reload();
    });
  };

  const reload = async () => load(filter, datas.page);
  const hide = () => showM && setShowM(false);

  const select = ({ target }) => {
    const li = target.tagName === "LI" ? target : target.closest("li");
    document.querySelectorAll("li").forEach((el) => {
      if (el === li) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });
  };

  const paste = () => {
    const text = clipboard.readText();
    if (text) {
      setFilter(text);
      load(text, 0);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getFiles(filterRef.current.filter, 0).then((result) => {
      if (isMounted) {
        setDatas(result);
      }
    });

    return () => (isMounted = false);
  }, []);

  return (
    <div id="list">
      {showBrw && <ModalBrowser hide={() => setShowBrw()} current={filter} setFilter={(flt) => load(flt, 0)} />}
      {showM && <FileContextMenu data={showM} hide={hide} reload={reload} favs={true} files={datas.files} />}
      <div id="files-list" onClick={hide} onWheel={hide}>
        <ul>
          {datas.files.length ? (
            datas.files.map((f, i) => (
              <li
                key={"r-" + i}
                onDoubleClick={(e) => itemClick(f, e)}
                className="popup-msg"
                tabIndex="0"
                data-msg={prettyBytes(f.Size) + " - " + f.Path}
                onContextMenu={(e) => showMenu(e, f)}
                onClick={select}
              >
                <span id="f-index">{(++i + datas.page * getConfig().itemPerPage + "").padStart(3, "0")}</span>
                <i className="fas fa-trash-alt" onClick={(e) => removeRecent(f, e)}></i>
                <i
                  className={"mr-1 fas fa-" + listIcons(f.Extension)}
                  onClick={() => shell.openExternal(f.Path)}
                ></i>{" "}
                {f.Name}
              </li>
            ))
          ) : (
            <li className="empty">No Files</li>
          )}
        </ul>
      </div>
      <div id="list-control">
        <div className="filter">
          <span className="search-icon" onClick={paste}>
            <i className="fas fa-paste"></i>
          </span>
          <Input value={filter} placeholder="Write to Filter" onChange={onFilter} required={true} />
          <span className="clear-icon fas fa-times-circle" onClick={clear}></span>
        </div>
        <Pager data={datas} setData={loadPage} />
        <span id="count">{datas.count}</span>
      </div>
    </div>
  );
};

export default List;
