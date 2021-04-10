"use babel";

import { CompositeDisposable } from "atom";
import {
  autoSelectBoard,
  compileSketch,
  uploadSketch,
  runSketch,
} from "./acli";

export default {
  config: {
    fqbn: {
      title: "FQBN",
      description: "Fully Qualified Board Name",
      type: "string",
      default: "arduino:avr:uno",
    },
    port: {
      title: "Port",
      description: "The port your board is connected to (used for uploading)",
      type: "string",
      default: "/dev/xxxx",
    },
  },

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
      }),
      atom.commands.add("atom-workspace", {
        "dino:auto-select-board": () => autoSelectBoard(),
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },
};
