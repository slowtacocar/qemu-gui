import { spawn } from "child_process";

const processes = {
  processes: {},
  kill: function (key) {
    if (this.processes[key]) {
      for (let i = 0; i < this.processes[key].length - 1; i++) {
        this.processes[key][i].kill();
      }
      this.processes[key][this.processes[key].length - 1] = false;
    }
  },
  running: function (key) {
    return !!(
      this.processes[key] && this.processes[key][this.processes[key].length - 1]
    );
  },
  spawn: function (key, command, args, logs) {
    const process = spawn(command, args);
    process.stdout.on("data", (data) => {
      logs += data;
    });
    process.stderr.on("data", (data) => {
      logs.logs += data;
    });
    process.on("close", () => {
      this.kill(key);
    });
    this.processes[key].push(process);
  },
  newProcess: function (key, commandArgs) {
    this.processes[key] = [];
    for (const [command, args, logs] of commandArgs) {
      this.spawn(key, command, args, logs);
    }
    this.processes[key].push(true);
  },
};

export default processes;
