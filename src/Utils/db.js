import { basePath, path, remote, mainWindow, fs, getTypes, ipc } from "./utils";
export const db = window.require(path.join(basePath, "Models"));

let appConfig;

const { and, or, like } = db.Op;

export const getConfig = () => {
  if (!appConfig) {
    appConfig = { itemPerPage: "200" };

    let tconfig = localStorage.getItem("appConfig");
    if (tconfig) {
      tconfig = JSON.parse(tconfig);
      if (tconfig.itemPerPage) {
        appConfig = tconfig;
      }
    }
  }

  return appConfig;
};

export const saveConfig = (config) => {
  for (let key in config) {
    appConfig[key] = config[key];
  }
  localStorage.setItem("appConfig", JSON.stringify(config));
};

const getFilters = (splt, filter) => {
  return {
    [splt === "&" ? and : or]: filter.split(splt).map((s) => ({
      [or]: {
        Name: {
          [like]: "%" + s.trim() + "%",
        },
        Dir: {
          [like]: "%" + s.trim() + "%",
        },
      },
    })),
  };
};

export const getFiles = async (filter = "", page = 0) => {
  const offset = page * getConfig().itemPerPage;
  let filters = getFilters(filter.includes("&") ? "&" : "|", filter);

  let data = {
    files: [],
    page: 0,
    totalPages: 0,
    filter,
    count: 0,
  };

  try {
    const { rows, count } = await db.File.findAndCountAll({
      order: ["Name"],
      where: filters,
      offset,
      limit: appConfig.itemPerPage,
    });
    data = { files: rows, page, totalPages: Math.ceil(count / appConfig.itemPerPage), filter, count };
  } catch (error) {
    console.log(error);
  }

  return data;
};
/****************************Scan Dir********************************************/
export const getDirectories = async () => {
  return await db.Directory.findAll();
};

const jobs = [];

export const getJobs = () => {
  if (!ipc._events["removeJob"]) {
    ipc.on("removeJob", (e, j) => {
      const index = jobs.indexOf(j);
      jobs.splice(index, 1);
      console.log("remove job", j);
    });

    ipc.on("all-jobs-done", () => {
      jobs.slice(0, jobs.length);
      console.log("all-jobs-done");
    });
  }
  return jobs;
};

export const addDirectory = async (d) => {
  let isNew = false;
  try {
    let directory = await db.Directory.findOne({ where: { Path: d.Path } });
    if (fs.readdirSync(d.Path).length || directory) {
      if (!directory) {
        directory = await db.Directory.create(d);
        isNew = true;
      }

      await AddJob(directory.Id);

      return { directory, isNew };
    }
  } catch (error) {
    console.log(error);
  }
  return { isNew: false };
};

let Worker;
const show = false;
export const AddJob = async (job) => {
  if (!jobs.includes(job)) {
    jobs.push(job);
  }
  const queryData = { Id: job, winId: mainWindow.id, types: getTypes() };

  if (!Worker) {
    Worker = new remote.BrowserWindow({
      show,
      webPreferences: { nodeIntegration: true, webSecurity: false, contextIsolation: false, enableRemoteModule: true },
    });
    Worker.setMenu(null);
    Worker.loadURL("file://" + path.join(basePath, "Workers", "worker.html"));
    Worker.once("ready-to-show", () => {
      Worker.webContents.send("new-job", queryData);
    });
    if (show) {
      Worker.webContents.openDevTools();
    }
    Worker.on("close", () => {
      Worker = null;
    });
  } else {
    Worker.webContents.send("new-job", queryData);
  }

  return Worker;
};
