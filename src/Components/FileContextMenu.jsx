import { useState, useEffect } from "react";
import { clipboard, shell } from "../Utils/utils";
import ContextFavList from "./ContextFavList";
import ModalRename from "./ModalRename";

const FileContextMenu = ({ data, hide, reload, favs, files }) => {
  const [showRename, setShowRename] = useState();
  const { file, x, y } = data;
  const [offsetY, setOffsetY] = useState(5);
  const [offsetX, setOffsetX] = useState(0);

  const cpName = () => {
    const name = file.Name.split(".");
    name.pop();
    clipboard.writeText(name.join("."));
  };

  const onClick = async (e) => {
    const ctxCommands = {
      open: () => shell.openExternal(file.Path),
      "open-ex": () => shell.showItemInFolder(file.Path),
      "cp-name": cpName,
      "cp-path": () => clipboard.writeText(file.Path),
      rename: () => setShowRename(true),
    };

    const action = ctxCommands[e.target.id];

    action && action();
    e.target.id !== "rename" && hide();
  };

  const onElLoad = (el) => {
    if (el) {
      if (y + el.offsetHeight > window.innerHeight) {
        setOffsetY(el.offsetHeight * -1);
      } else {
        setOffsetY(5);
      }

      if (x + el.offsetWidth > window.innerWidth) {
        setOffsetX(el.offsetWidth * -1);
      } else {
        setOffsetX(0);
      }
    }
  };

  useEffect(() => {
    document.body.onmouseleave = () => !showRename && hide();

    return () => (document.body.mouseleave = null);
  }, [showRename]);

  return (
    <>
      {showRename ? (
        <ModalRename file={file} hide={hide} reload={reload} />
      ) : (
        <div id="contextm" ref={onElLoad} style={{ top: `${y + offsetY}px`, left: `${x + offsetX}px` }}>
          <ul>
            <li id="open" onClick={onClick}>
              Open In Default
            </li>
            <li id="open-ex" onClick={onClick}>
              Open In Explorer
            </li>
            {file.Name?.includes("mp4") && (
              <li id="show-prewview" onClick={onClick}>
                Open In Preview
              </li>
            )}
            {favs && (
              <>
                <li id="add-fav" className="add-fav">
                  Favorites <span style={{ float: "right" }}>&#62;</span>
                  <ContextFavList key="fav" {...{ hide, file }} />
                </li>
                <li id="add-all-afv" className="add-fav">
                  All to Favorites <span style={{ float: "right" }}>&#62;</span>
                  <ContextFavList key="all-fav" {...{ hide, file: files }} all={true} />
                </li>
              </>
            )}
            <li id="cp-name" onClick={onClick}>
              Copy Name
            </li>
            <li id="cp-path" onClick={onClick}>
              Copy Path
            </li>
            <li id="rename" onClick={onClick}>
              Rename
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default FileContextMenu;
