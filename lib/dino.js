"use babel";

import { CompositeDisposable } from "atom";
import { compileSketch, uploadSketch, runSketch } from "./acli";

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      atom.commands.add("atom-workspace", {
        "dino:compile-sketch": () =>
          compileSketch(atom.project.rootDirectories[0].getPath()),
      }),
      atom.commands.add("atom-workspace", {
        "dino:upload-sketch": () =>
          uploadSketch(atom.project.rootDirectories[0].getPath()),
      }),
      atom.commands.add("atom-workspace", {
        "dino:run-sketch": () =>
          runSketch(atom.project.rootDirectories[0].getPath()),
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },
};
