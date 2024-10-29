const app = require('./src/app/app');

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/api/v1`);
});
