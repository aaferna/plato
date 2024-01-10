require("dotenv").config();
const { PrismaClient } = require('./prisma/plato/client');
const schedule = require('node-schedule');
const prisma = new PrismaClient();
const dirFunc = "./functions/";
global.codePath = __dirname;

global.fs = require("fs");
global.log = require("./modules/log4j").log;
global.paq = {};
global.functions = {};

// Cargar funciones
try {
  let funfiles = fs.readdirSync(dirFunc);
  if (funfiles.length == 0) {
    log("info", `No hay Funciones para inicializar`);
  }
  funfiles.forEach(filename => {
    if (filename.endsWith(".js")) {
      const functionName = filename.replace(".js", "");
      functions[functionName] = require(dirFunc + filename);
    }
  });
} catch (error) {
  log("warn", `PID ${process.pid} :: Existe un error al importar una funcion :: ${error}`);
}

const runFunctions = (nombre) => {
  try {
    log("info", `Ejecutando la tarea: ${nombre}`, "Scheduler");
    paq[nombre].job();
  } catch (error) {
    log("error", `Existe un error al momento de ejecutar el Job ${nombre} > ${error}`, "Scheduler");
  }
};

const consultarTareas = async () => {
  try {

    let tareas = await prisma.tarea.findMany({
      where: { activo: 1 },
      select: {
        nombre: true,
        paq_funcion: true,
        tiempo_ejecucion: true,
        activo: true,
        date: true
      }
    });

    tareas.forEach(({ nombre, paq_funcion, tiempo_ejecucion, activo, date }) => {

      if(activo) {

        if (!paq.hasOwnProperty(nombre)) {
          paq[nombre] = {
            job: eval(paq_funcion),
            date: date
          };
        }

        let tareaProgramada = schedule.scheduledJobs[nombre];

        if (!tareaProgramada) {

          schedule.scheduleJob(nombre, tiempo_ejecucion, () => runFunctions(nombre));
          log("info", `La Tarea ${nombre} fue programada para ejecutar cada ${tiempo_ejecucion}`, "Scheduler");

        } else if (paq[nombre].date.toString() !== date.toString()) {

          tareaProgramada.cancel();
          paq[nombre] = {
            job: eval(paq_funcion),
            date: date
          };
          schedule.scheduleJob(nombre, tiempo_ejecucion, () => runFunctions(nombre));
          log("info", `La Tarea ${nombre} fue re-programada y se ejecutara cada ${tiempo_ejecucion}`, "Scheduler");

        }

      } else {

        const tareaProgramada = schedule.scheduledJobs[nombre];

        if (tareaProgramada) {
          tareaProgramada.cancel();
          log("info", `La Tarea ${nombre} fue desactivada`, "Scheduler");
        }

      }

    });

  } catch (error) {
    log("error", ` ${error}`, "Scheduler");
  }
};

log("info", `Scheduler Iniciado`, "Scheduler");
consultarTareas();
// setInterval(consultarTareas, 1 * 60 * 1000);
setInterval(consultarTareas, 1000);
