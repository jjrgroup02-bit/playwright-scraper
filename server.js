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
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled"
      ]
    });

    const page = await browser.newPage();

    // Simular navegador real
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    });

    await page.goto("https://consulta.portabilidad.pe/", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    // esperar que cargue javascript
    await page.waitForTimeout(8000);

    // buscar input del número
    await page.waitForSelector("input", { timeout: 60000 });

    await page.fill("input", numero);

    await page.click("button");

    // esperar resultado
    await page.waitForTimeout(6000);

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
