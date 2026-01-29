import { app, BrowserWindow, dialog } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { spawn, ChildProcess } from "child_process";
import { autoUpdater } from "electron-updater";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Configure auto-updater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.logger = console;

// Configure update server
if (app.isPackaged) {
  autoUpdater.setFeedURL({
    provider: "github",
    owner: "banx9x",
    repo: "face-attendance-electron",
  });
}

// Auto-updater events
autoUpdater.on("checking-for-update", () => {
  console.log("=== Checking for updates...");
  console.log("Current version:", app.getVersion());
  console.log("Feed URL:", autoUpdater.getFeedURL());
});

autoUpdater.on("update-available", (info) => {
  console.log("=== Update available:", JSON.stringify(info, null, 2));
  dialog
    .showMessageBox({
      type: "info",
      title: "Cập nhật có sẵn",
      message: `Phiên bản ${info.version} đã có sẵn. Bạn có muốn tải về và cài đặt không?`,
      buttons: ["Có", "Để sau"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on("update-not-available", (info) => {
  console.log("=== No updates available");
  console.log("Latest version checked:", JSON.stringify(info, null, 2));
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  console.log(log_message);
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Cập nhật đã sẵn sàng",
      message:
        "Cập nhật đã được tải xuống. Ứng dụng sẽ được cài đặt khi bạn khởi động lại.",
      buttons: ["Khởi động lại ngay", "Để sau"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
});

autoUpdater.on("error", (error) => {
  console.error("=== Error in auto-updater:");
  console.error("Error message:", error.message);
  console.error("Error stack:", error.stack);

  // Show error dialog for debugging
  dialog.showMessageBox({
    type: "error",
    title: "Lỗi kiểm tra cập nhật",
    message: `Không thể kiểm tra cập nhật: ${error.message}`,
    buttons: ["OK"],
  });
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(
      __dirname,
      process.platform === "win32"
        ? "./client/assets/icon.ico"
        : "./client/assets/icon.icns",
    ),
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools only in development
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    stopPythonServer();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Bootstrap python server
let pythonProcess: ChildProcess | null = null;

function getPythonExecutablePath(): string {
  const isDev = !app.isPackaged;

  if (isDev) {
    // Use conda environment instead of venv
    const homeDir = process.env.HOME || process.env.USERPROFILE || "";
    if (process.platform === "win32") {
      return path.join(homeDir, "anaconda3", "envs", "face", "python.exe");
    } else {
      return path.join(homeDir, "anaconda3", "envs", "face", "bin", "python");
    }
  } else {
    return path.join(process.resourcesPath, "server", "server");
  }
}

function bootstrapPythonServer() {
  const isDev = !app.isPackaged;

  console.log("Starting Python server...");
  console.log("Environment:", isDev ? "Development" : "Production");

  if (isDev) {
    // Development: Use conda environment with uvicorn
    const pathToPython = getPythonExecutablePath();
    const pathToScript = path.join(process.cwd(), "src", "server", "app.py");

    console.log("Python path:", pathToPython);
    console.log("Script path:", pathToScript);

    pythonProcess = spawn(
      pathToPython,
      [
        "-m",
        "uvicorn",
        "app:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8000",
        "--reload",
      ],
      {
        cwd: path.join(process.cwd(), "src", "server"),
        stdio: "inherit",
      },
    );
  } else {
    // Production: Use PyInstaller executable
    const serverExecutable =
      process.platform === "win32"
        ? path.join(process.resourcesPath, "server", "server.exe")
        : path.join(process.resourcesPath, "server", "server");

    console.log("Server executable:", serverExecutable);
    console.log("Resource path:", process.resourcesPath);

    // Run the server executable which contains uvicorn
    pythonProcess = spawn(
      serverExecutable,
      ["--host", "0.0.0.0", "--port", "8000"],
      {
        stdio: "inherit",
      },
    );
  }

  pythonProcess.on("error", (error) => {
    console.error("Failed to start Python server:", error);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python server exited with code ${code}`);
  });
}

function stopPythonServer() {
  if (pythonProcess) {
    console.log("Stopping Python server...");
    pythonProcess.kill();
    pythonProcess = null;
  }
}

app.whenReady().then(() => {
  bootstrapPythonServer();

  // Check for updates (only in production)
  if (!app.isPackaged) {
    console.log("=== Development mode: Skipping update check");
  } else {
    console.log("=== Production mode: Will check for updates in 3 seconds");
    console.log("=== App version:", app.getVersion());
    console.log("=== App path:", app.getAppPath());

    // Check for updates after 3 seconds
    setTimeout(() => {
      console.log("=== Starting update check now...");
      autoUpdater.checkForUpdates().catch((err) => {
        console.error("=== Failed to check for updates:", err);
      });
    }, 3000);
  }
});

// Cleanup: Stop Python server when app is quitting
app.on("will-quit", () => {
  stopPythonServer();
});

// Also stop server when all windows are closed (before quitting)
app.on("before-quit", () => {
  stopPythonServer();
});
