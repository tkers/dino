"use babel";

import { CompositeDisposable, Disposable } from "atom";
import { createStatusBarItem } from "./statusBarItem";
import { createBoardSelector } from "./boardSelector";
import { getProjectDirectory } from "./utils";
import { compileSketch, uploadSketch, runSketch } from "./dino";
import { listBoards } from "./cli";

let subscriptions;
let detectedBoards = [];
let currentBoard = null;
let statusBarItem;
let boardSelector;

const setCurrentBoard = (board) => {
  currentBoard = board;
  if (statusBarItem) {
    statusBarItem.setBoard(currentBoard);
  }
  if (boardSelector) {
    boardSelector.setActive(currentBoard);
  }
};

const refreshBoards = () =>
  listBoards().then((boards) => {
    detectedBoards = boards;
    if (boardSelector) {
      boardSelector.setItems(detectedBoards);
    }
  });

const autoSelectBoard = () => {
  refreshBoards().then(() => {
    setCurrentBoard(detectedBoards.length > 0 ? detectedBoards[0] : null);
  });
};

export default {
  activate(state) {
    autoSelectBoard();
    subscriptions = new CompositeDisposable(
      atom.commands.add("atom-workspace", {
        "dino:compile-sketch": () =>
          compileSketch(getProjectDirectory(), currentBoard),
        "dino:upload-sketch": () =>
          uploadSketch(getProjectDirectory(), currentBoard),
        "dino:run-sketch": () => runSketch(getProjectDirectory(), currentBoard),
        "dino:show-board-selector": async (event) => {
          if (!boardSelector) {
            boardSelector = createBoardSelector(
              detectedBoards,
              currentBoard,
              setCurrentBoard
            );
            subscriptions.add(new Disposable(() => boardSelector.destroy()));
          } else {
            boardSelector.reset();
          }
          refreshBoards();
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

    statusBarItem.setBoard(currentBoard);

    const tile = statusBar.addRightTile({ item: statusBarItem, priority: 200 });
    subscriptions.add(new Disposable(() => tile.destroy()));
  },
};
