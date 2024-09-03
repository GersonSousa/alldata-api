const app = require('./src/app/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`O servidor está rodando na url http://localhost:${PORT}/api/v1`);
});
