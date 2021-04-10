"use babel";

import { CompositeDisposable } from "atom";
import config from "./config-schema.json";
import { getProjectDirectory } from "./utils";
import {
  compileSketch,
  uploadSketch,
  runSketch,
  autoSelectBoard,
} from "./dino";

let subscriptions;

export default {
  config,
  activate(state) {
    autoSelectBoard(true);
    subscriptions = new CompositeDisposable(
      atom.commands.add("atom-workspace", {
        "dino:compile-sketch": () => compileSketch(getProjectDirectory()),
        "dino:upload-sketch": () => uploadSketch(getProjectDirectory()),
        "dino:run-sketch": () => runSketch(getProjectDirectory()),
        "dino:auto-select-board": () => autoSelectBoard(false),
      })
    );
  },
  deactivate() {
    subscriptions.dispose();
  },
};
