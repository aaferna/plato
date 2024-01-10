const axios = require('axios').default;
const https = require('https');

exports.enviar = (title, cuerpo = {}, url = "") => {
  try {

    let body = {};

    if (cuerpo.type === "text") {

      body = {
        '@context': 'https://schema.org/extensions',
        '@type': 'MessageCard',
        themeColor: cuerpo.color,
        title: title,
        summary: title,
        text: cuerpo.text,
      };

    } else if (cuerpo.type === "table") {

      body = {
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        themeColor: cuerpo.color,
        title: title,
        summary: title,
        sections: [
          {
            activityTitle: cuerpo.detail,
            markdown: true,
          }
        ],
      };

      if (Array.isArray(cuerpo.data)) {
        const columns = Object.keys(cuerpo.data[0]);
        const rows = cuerpo.data.map(obj => Object.values(obj));
        
        const tableHeader = `<thead><tr style='background-color: #0076D7; color: #FFFFFF;'>${columns.map(column => `<th style='padding: 10px; border: 1px solid #000000;'>${column}</th>`).join('')}</tr></thead>`;

        const tableBody = `<tbody>${rows.map(row => `<tr>${row.map(cell => `<td style='padding: 10px; border: 1px solid #000000;'>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
        
        const tableHTML = `<table style='border-collapse: collapse; width: 100%;'>${tableHeader}${tableBody}</table>`;

        body.sections.push({
          startGroup: true,
          text: tableHTML,
        });

      } else {
        const tableHeader = `<thead><tr style='background-color: #0076D7; color: #FFFFFF;'>${cuerpo.columns.map(column => `<th style='padding: 10px; border: 1px solid #000000;'>${column}</th>`).join('')}</tr></thead>`;

        const tableBody = `<tbody>${cuerpo.rows.map(row => `<tr>${row.map(cell => `<td style='padding: 10px; border: 1px solid #000000;'>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
        
        const tableHTML = `<table style='border-collapse: collapse; width: 100%;'>${tableHeader}${tableBody}</table>`;


        body.sections.push({
          startGroup: true,
          text: tableHTML,
        });

      }
      
    }

    axios.post(url, body, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
      .then((response) => {
        log("info", `Notificación "${title}" enviada`, "Teams");
      })
      .catch((error) => {
        log("info", error, "Teams");
      });

  } catch (error) {
    log("info", `Existe un problema al ejecutar el envío a Teams: ${error}`, "Teams");
  }
};
