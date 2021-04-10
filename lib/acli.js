"use babel";

const { exec } = require("child_process");

const FQBN = "arduino:avr:uno";
const PORT = "/dev/cu.usbmodem144101";

export function uploadSketch(fname) {
  exec(
    `arduino-cli upload -b ${FQBN} -p ${PORT} ${fname}`,
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
  exec(`arduino-cli compile -b ${FQBN} ${fname}`, (err, stdout, stderr) => {
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
  });
}

export function runSketch(fname) {
  exec(
    `arduino-cli compile -b ${FQBN} -u -p ${PORT} ${fname}`,
    (err, stdout, stderr) => {
      if (err) {
        atom.notifications.addError("Failed to run sketch", { detail: stderr });
      } else {
        atom.notifications.addSuccess("Successfully running sketch!");
      }
    }
  );
}
