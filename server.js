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

  const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});
  const page = await browser.newPage();

  try {

    await page.goto("https://consulta.portabilidad.pe/", { waitUntil: "domcontentloaded" });

    await page.fill("input[type='tel']", numero);

    await page.click("button[type=submit]");

    await page.waitForTimeout(5000);

    const html = await page.content();

    await browser.close();

    res.send(html);

  } catch (error) {

    await browser.close();

    res.json({
      error: "Error consultando OSIPTEL",
      detalle: error.toString()
    });

  }

});

app.listen(3000, () => {
  console.log("Playwright scraper corriendo");
});
