"use babel";

import { compile, upload } from "./cli";

export const uploadSketch = (fname, board) => {
  atom.notifications.addInfo("Uploading sketch...");
  return upload(fname, board.fqbn, board.port)
    .then(() =>
      atom.notifications.addSuccess(`Uploaded sketch to ${board.name}!`)
    )
    .catch((stderr) =>
      atom.notifications.addError("Failed to upload sketch", {
        detail: stderr,
      })
    );
};

export const compileSketch = (fname, board) => {
  atom.notifications.addInfo("Compiling sketch...");
  return compile(fname, board.fqbn)
    .then(() => {
      {
        atom.notifications.addSuccess("Compiled sketch!");
      }
    })
    .catch((stderr) =>
      atom.notifications.addError("Failed to compile sketch", {
        detail: stderr,
      })
    );
};

export const runSketch = (fname, board) => {
  atom.notifications.addInfo("Running sketch...");
  return compile(fname, board.fqbn, board.port)
    .then(() =>
      atom.notifications.addSuccess(`Sketch running on ${board.name}!`)
    )
    .catch((stderr) =>
      atom.notifications.addError("Failed to run sketch", { detail: stderr })
    );
};
