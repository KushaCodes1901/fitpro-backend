const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`FitPro backend running on port ${env.port}`);
});
