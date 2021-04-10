"use babel";

export const getFqbn = () => atom.config.get("dino.fqbn");
export const setFqbn = (fqbn) => atom.config.set("dino.fqbn", fqbn);

export const getPort = () => atom.config.get("dino.port");
export const setPort = (port) => atom.config.set("dino.port", port);
