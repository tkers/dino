"use babel";

import SelectListView from "atom-select-list";

export const createBoardSelector = (items, currentBoard, onConfirm) => {
  let modalPanel;
  let currentItem = currentBoard;

  const boardListview = new SelectListView({
    items: items,
    emptyMessage: "No Arduino boards detected",
    itemsClassList: "mark-active",
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
      if (
        currentItem &&
        item.fqbn === currentItem.fqbn &&
        item.port === currentItem.port
      ) {
        elem.classList.add("active");
      }
      return elem;
    },
  });

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
      boardListview.reset();
      modalPanel.show();
      boardListview.focus();
    },
    setItems: (boards) => boardListview.update({ items: boards }),
    setActive: (board) => {
      currentItem = board;
    },
  };
};
