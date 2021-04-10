"use babel";

const { exec } = require("child_process");

const getFqbn = () => atom.config.get("dino.fqbn");
const getPort = () => atom.config.get("dino.port");

export function getConnectedBoards(cb) {
  exec("arduino-cli board list --format=json", (err, stdout, stderr) => {
    if (err) {
      cb(stderr);
    } else {
      const list = JSON.parse(stdout);
      const boards = list.filter((x) => x.boards && x.boards.length === 1);
      const res = boards.map((x) => ({
        port: x.address,
        name: x.boards[0].name,
        fqbn: x.boards[0].fqbn,
      }));
      cb(null, res);
    }
  });
}

export function autoSelectBoard(init) {
  getConnectedBoards((err, res) => {
    if (err) {
      if (!init) {
        atom.notifications.addError("Failed to detect Arduino boards", {
          detail: err,
        });
      }
    } else if (res.length === 0) {
      if (!init) {
        atom.notifications.addError("No Arduino boards connected");
      }
    } else {
      const { name, fqbn, port } = res[0];
      atom.config.set("dino.fqbn", fqbn);
      atom.config.set("dino.port", port);
      atom.notifications.addSuccess(`Selected ${name} at ${port}`);
    }
  });
}

export function uploadSketch(fname) {
  exec(
    `arduino-cli upload -b ${getFqbn()} -p ${getPort()} ${fname}`,
    (err, stdout, stderr) => {
      if (err) {
        atom.notifications.addError("Failed to upload sketch", {
          detail: stderr,
        });
      } else {
        atom.notifications.addSuccess("Successfully uploaded sketch to board!");
      }
    }
  );
}

export function compileSketch(fname) {
  exec(
    `arduino-cli compile -b ${getFqbn()} ${fname}`,
    (err, stdout, stderr) => {
      if (err) {
        atom.notifications.addError("Failed to compile sketch", {
          detail: stderr,
        });
      } else {
        const noti = atom.notifications.addSuccess(
          "Successfully compiled sketch!",
          {
            dismissable: true,
            buttons: [
              {
                text: "Upload to board!",
                onDidClick: () => {
                  noti.dismiss();
                  uploadSketch(fname);
                },
              },
            ],
          }
        );
        setTimeout(() => noti.dismiss(), 5000);
      }
    }
  );
}

export function runSketch(fname) {
  exec(
    `arduino-cli compile -b ${getFqbn()} -u -p ${getPort()} ${fname}`,
    (err, stdout, stderr) => {
      if (err) {
        atom.notifications.addError("Failed to run sketch", { detail: stderr });
      } else {
        atom.notifications.addSuccess("Successfully running sketch!");
      }
    }
  );
}
