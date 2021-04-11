"use babel";

export class StatusBarItem {
  constructor() {
    this.element = document.createElement("div");
    this.element.className = "dino-status-tile inline-block";
    this.setBoard(null);
  }

  setBoard(board) {
    if (board) {
      this.element.innerHTML = `<span class="icon icon-circuit-board"></span> ${board.name}`;
      this.element.classList.add("text-success");
    } else {
      this.element.classList.remove("text-success");
      this.element.innerHTML = `<span class="icon icon-circuit-board"></span> Dino`;
    }
  }

  onClick(callback) {
    this.element.addEventListener("click", callback);
  }

  onRightClick(callback) {
    this.element.addEventListener("contextmenu", callback);
  }
}

export const createStatusBarItem = () => new StatusBarItem();
