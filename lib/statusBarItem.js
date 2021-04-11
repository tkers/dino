"use babel";

export class StatusBarItem {
  constructor() {
    this.element = document.createElement("div");
    this.element.className = "dino-status-tile inline-block";
    this.clearLabel();
  }

  clearLabel() {
    this.element.classList.remove("text-success");
    this.element.innerHTML = `<span class="icon icon-circuit-board"></span> Dino`;
  }

  setLabel(label) {
    this.element.innerHTML = `<span class="icon icon-circuit-board"></span> ${label}`;
    this.element.classList.add("text-success");
  }

  onClick(callback) {
    this.element.addEventListener("click", callback);
  }

  onRightClick(callback) {
    this.element.addEventListener("contextmenu", callback);
  }
}

export const createStatusBarItem = () => new StatusBarItem();
