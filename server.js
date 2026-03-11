const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/", (req, res) => {
  res.send("Playwright scraper funcionando");
});

app.get("/consultar-osiptel", async (req, res) => {

  const numero = req.query.numero;

  if (!numero) {
    return res.json({ error: "Debes enviar ?numero=" });
  }

  try {

    const browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    const page = await browser.newPage();

    await page.goto("https://consulta.portabilidad.pe/", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.fill("input[type='tel']", numero);

    await page.click("button[type='submit']");

    await page.waitForTimeout(5000);

    const html = await page.content();

    await browser.close();

    res.send(html);

  } catch (error) {

    res.json({
      error: "Error consultando OSIPTEL",
      detalle: error.toString()
    });

  }

});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
