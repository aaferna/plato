-- CreateTable
CREATE TABLE "Tarea" (
    "idtarea" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "paq_funcion" TEXT NOT NULL,
    "tiempo_ejecucion" TEXT NOT NULL,
    "activo" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntero" TEXT
);
