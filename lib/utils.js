"use babel";

export const getProjectDirectory = () =>
  atom.project.rootDirectories[0].getPath();
