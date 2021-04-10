"use babel";

import { listBoards, compile, upload } from "./cli";
import { getFqbn, getPort, setFqbn, setPort } from "./config";

export const autoSelectBoard = (init) =>
  listBoards()
    .then((boards) => {
      if (boards.length > 0) {
        const { name, fqbn, port } = boards[0];
        setFqbn(fqbn);
        setPort(port);
        atom.notifications.addSuccess(`Selected ${name} at ${port}`);
      } else if (!init) {
        atom.notifications.addError("No Arduino boards connected");
      }
    })
    .catch((stderr) => {
      if (!init) {
        atom.notifications.addError("Failed to detect Arduino boards", {
          detail: stderr,
        });
      }
    });

export const uploadSketch = (fname) =>
  upload(fname, getFqbn(), getPort())
    .then(() =>
      atom.notifications.addSuccess("Successfully uploaded sketch to board!")
    )
    .catch((stderr) =>
      atom.notifications.addError("Failed to upload sketch", {
        detail: stderr,
      })
    );

export const compileSketch = (fname) =>
  compile(fname, getFqbn())
    .then(() => {
      {
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
    })
    .catch((stderr) =>
      atom.notifications.addError("Failed to compile sketch", {
        detail: stderr,
      })
    );

export const runSketch = (fname) =>
  compile(fname, getFqbn(), getPort())
    .then(() => atom.notifications.addSuccess("Successfully running sketch!"))
    .catch((stderr) =>
      atom.notifications.addError("Failed to run sketch", { detail: stderr })
    );
