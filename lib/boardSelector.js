"use babel";

import SelectListView from "atom-select-list";
import { listBoards } from "./cli";

export const createBoardSelector = (onConfirm) => {
  let modalPanel;
  const boardListview = new SelectListView({
    items: [],
    emptyMessage: "No Arduino boards detected",
    filterKeyForItem: (item) => item.fqbn,
    didConfirmSelection: (item) => {
      onConfirm(item);
      modalPanel.hide();
    },
    didCancelSelection: () => {
      modalPanel.hide();
    },
    elementForItem: (item) => {
      const elem = document.createElement("li");
      elem.innerHTML = `${item.name} <div class="pull-right" style="opacity: 0.5">${item.port}</div>`;
      return elem;
    },
  });

  const refreshBoards = () => {
    listBoards().then((boards) => {
      boardListview.update({ items: boards });
    });
  };
  refreshBoards();

  modalPanel = atom.workspace.addModalPanel({
    item: boardListview,
  });

  boardListview.focus();

  return {
    destroy: () => {
      boardListview.destroy();
      modalPanel.destroy();
      modalPanel = null;
    },
    reset: () => {
      refreshBoards();
      boardListview.reset();
      modalPanel.show();
      boardListview.focus();
    },
  };
};
