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

  let browser;

  try {

    browser = await chromium.launch({
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

    await page.waitForTimeout(5000);

    await page.waitForSelector("#txtNumero", {
       timeout: 60000
    });

    await page.fill("#txtNumero", numero);

    await page.click("button[type='submit']");

    await page.waitForTimeout(5000);

    const html = await page.content();

    await browser.close();

    res.send(html);

  } catch (error) {

    if (browser) {
      await browser.close();
    }

    res.json({
      error: "Error consultando OSIPTEL",
      detalle: error.toString()
    });

  }

});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Playwright scraper corriendo en puerto 3000");
});
