"use babel";

import { CompositeDisposable, Disposable } from "atom";
import config from "./config-schema.json";
import { getFqbn, setFqbn, setPort } from "./config";
import { createStatusBarItem } from "./statusBarItem";
import { createBoardSelector } from "./boardSelector";
import { getProjectDirectory } from "./utils";
import {
  compileSketch,
  uploadSketch,
  runSketch,
  autoSelectBoard,
} from "./dino";

let subscriptions;
let statusBarItem;
let boardSelector;

export default {
  config,
  activate(state) {
    autoSelectBoard(true).then(() => {
      if (statusBarItem) {
        statusBarItem.setLabel(getFqbn());
      }
    });
    subscriptions = new CompositeDisposable(
      atom.commands.add("atom-workspace", {
        "dino:compile-sketch": () => compileSketch(getProjectDirectory()),
        "dino:upload-sketch": () => uploadSketch(getProjectDirectory()),
        "dino:run-sketch": () => runSketch(getProjectDirectory()),
        "dino:auto-select-board": () => {
          autoSelectBoard(false).then(() => {
            const fqbn = getFqbn();
            if (fqbn) {
              statusBarItem.setLabel(fqbn);
            }
          });
        },
        "dino:show-board-selector": async (event) => {
          if (!boardSelector) {
            boardSelector = createBoardSelector((item) => {
              const { fqbn, port } = item;
              setFqbn(fqbn);
              setPort(port);
              statusBarItem.setLabel(fqbn);
            });
            subscriptions.add(new Disposable(() => boardSelector.destroy()));
          } else {
            boardSelector.reset();
          }
        },
      })
    );
  },
  deactivate() {
    subscriptions.dispose();
  },
  consumeStatusBar(statusBar) {
    statusBarItem = createStatusBarItem();
    statusBarItem.onClick((ev) => {
      atom.commands.dispatch(
        atom.views.getView(atom.workspace),
        "dino:show-board-selector"
      );
    });

    const fqbn = getFqbn();
    if (fqbn) {
      statusBarItem.setLabel(fqbn);
    }

    const tile = statusBar.addRightTile({ item: statusBarItem, priority: 200 });
    subscriptions.add(new Disposable(() => tile.destroy()));
  },
};
