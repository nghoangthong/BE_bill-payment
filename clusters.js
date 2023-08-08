/**
 * Configuring parallel processing using cluster module
 * @author Long Pham
 * @type {*|start}
 */

var cluster = require ("cluster");
var os = require ("os");

const CPUS = os.cpus ();
if (cluster.isMaster) {

  CPUS.forEach (function () {
    // fork workers
    cluster.fork ()
  });

  console.log ("\n");
  cluster.on ("listening", function (worker) {
    console.log ("Cluster %d connected", worker.process.pid);
  });
  cluster.on ("disconnect", function (worker) {
    console.log ("Cluster %d disconnected", worker.process.pid);
  });
  cluster.on ("exit", function (worker) {
    console.log ("Cluster %d is dead", worker.process.pid);
    // Ensuring a new cluster will start if an old one dies
    cluster.fork ();
  });
} else {
  // default cluster.isWorker
  require ("./app.js");
}
