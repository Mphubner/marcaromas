import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Marc Aromas rodando na porta ${PORT}`);
});
