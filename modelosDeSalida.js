exports.cone = () => {
    console.log("tabla")
    functions["teams"].enviar("Prueba desde Plano", {
            type: "table",
            color: "c6000f",
            detail: "Esta es una prueba de concepto de una tabla dinamica donde solo le paso las columnas y las filas junto con un detalle",
            columns: ["ERR29273", "ACCEPTED", "OK", "ERR3135", "ISE", "CAN"], 
            rows:  [
                ["Celda 1-1", "Celda 1-2", "Celda 1-3"],
                ["Celda 2-1", "Celda 2-2", "Celda 2-3"],
                ["Celda 3-1", "Celda 3-2", "Celda 3-3"]
            ]
        }
    )
}

exports.cone = () => {
    console.log("tabla")
    functions["teams"].enviar("Prueba desde Plano", {
            type: "table",
            color: "c6000f",
            detail: "Esta es una prueba de concepto de una tabla dinamica donde solo le paso las columnas y las filas junto con un detalle",
            data:[ 
                {
                    TRANS_CODE: 'FDBOLETIN',
                    TRANS_RESULT_CODE: 'ENVIADO',
                    FORMATTED_TS_BEGIN: '17/07 11:36',
                    TOTAL: 1
                }
            ]
        }
    )
}

exports.cone = () => {
    console.log("texto")
    functions["teams"].enviar("Prueba desde Plano", {
            type: "text",
            color: "c6000f",
            text: "Esta es una prueba de concepto de una tabla dinamica donde solo le paso las columnas y las filas junto con un detalle"
        }
    )
}

