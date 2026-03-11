const express = require("express");

const app = express();

// Ruta principal
app.get("/", (req, res) => {
  res.send("Playwright scraper funcionando");
});

// Ruta de prueba para consulta
app.get("/consultar-osiptel", (req, res) => {

  const numero = req.query.numero;

  if (!numero) {
    return res.json({
      error: "Debes enviar ?numero="
    });
  }

  res.json({
    estado: "servidor funcionando",
    numero: numero,
    mensaje: "endpoint funcionando correctamente"
  });

});

// Puerto del servidor
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
