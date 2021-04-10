"use babel";

const { exec } = require("child_process");

const arduinoCli = (args, cb) =>
  new Promise((resolve, reject) => {
    exec(`arduino-cli ${args}`, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });

const arduinoCliJson = (args, cb) =>
  arduinoCli(args).then((stdout) => JSON.parse(stdout));

export const listBoards = () =>
  arduinoCliJson("board list --format=json").then((list) =>
    list
      .filter((x) => x.boards && x.boards.length === 1)
      .map((x) => ({
        port: x.address,
        name: x.boards[0].name,
        fqbn: x.boards[0].fqbn,
      }))
  );

export const listAllBoards = () => {
  arduinoCliJson("board listall --format=json").then((list) =>
    list.boards.map((x) => ({ name: x.name, fqbn: x.fqbn }))
  );
};

export const upload = (sketch, fqbn, port) =>
  arduinoCli(`upload -b ${fqbn} -p ${port} ${sketch}`);

export const compile = (sketch, fqbn, port) =>
  port
    ? arduinoCli(`compile -b ${fqbn} -u -p ${port} ${sketch}`)
    : arduinoCli(`compile -b ${fqbn} ${sketch}`);
