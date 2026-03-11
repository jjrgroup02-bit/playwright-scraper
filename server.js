const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/", (req, res) => {
  res.send("Playwright scraper funcionando");
});

app.get("/consultar-osiptel", async (req, res) => {

  const numero = req.query.numero;

  if (!numero) {
    return res.json({ error: "Falta el número" });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {

    await page.goto("https://consulta.portabilidad.pe/");

    await page.fill("#hf-number", numero);

    await page.click("button[type=submit]");

    await page.waitForTimeout(5000);

    const resultado = await page.evaluate(() => {

      const datos = {};
      const filas = document.querySelectorAll("table tr");

      filas.forEach(fila => {
        const columnas = fila.querySelectorAll("td");

        if (columnas.length === 2) {
          datos[columnas[0].innerText.trim()] = columnas[1].innerText.trim();
        }
      });

      return datos;
    });

    await browser.close();

    res.json({
      numero,
      resultado
    });

  } catch (error) {

    await browser.close();

    res.json({
      error: "Error consultando OSIPTEL",
      detalle: error.toString()
    });

  }

});

app.listen(3000, () => {
  console.log("Servidor Playwright corriendo en puerto 3000");
});
