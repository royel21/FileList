import { useState, useEffect, useRef } from "react";
import { getFavoritesDB } from "./Utils/favorites";
import FavControl from "./Components/FavControl";
import FileContextMenu from "./Components/FileContextMenu";
import { showPreview } from "./Utils/Preview";
import ListItem from "./Components/ListItem";
import { fs, shell, sortByName } from "./Utils/utils";

const FavList = () => {
  const [showM, setShowM] = useState();
  const [datas, setDatas] = useState({
    current: { Files: [] },
    favs: [],
  });
  const index = useRef(localStorage.getItem("fav") || 0);

  const listRef = useRef();

  const hide = () => showM && setShowM(false);

  const removeDir = async (file) => {
    const i = datas.current.Files.indexOf(file);
    datas.current.Files.splice(i, 1)[0];
    await datas.current.removeFile(file);
    setDatas({ ...datas });
  };

  const openFile = (file, { target }) => {
    if (fs.existsSync(file.Path)) {
      if (fs.existsSync(file.Path) && !target.classList.contains("fas")) {
        shell.openExternal(`file-manager://fav=${datas.current.Id}&file=${file.Name}`);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    getFavoritesDB().then((result) => {
      if (isMounted) {
        setDatas({
          favs: result,
          current: result[index.current] || { Files: [] },
        });
      }
    });

    return () => {
      isMounted = false;
      localStorage.setItem("fav", index.current);
    };
  }, []);

  return (
    <div id="list">
      {showM && <FileContextMenu data={showM} hide={hide} />}
      <div ref={listRef} id="files-list" onClick={hide} onWheel={hide}>
        <ul>
          {datas.current.Files.sort(sortByName).map((f, i) => (
            <ListItem
              key={"f-" + i}
              openFile={openFile}
              file={f}
              onShowMemu={setShowM}
              onRemoveDir={removeDir}
              showPreview={showPreview}
            />
          ))}
        </ul>
      </div>
      <FavControl {...{ datas, setDatas }} />
    </div>
  );
};

export default FavList;
