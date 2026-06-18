import { createApp } from "./app";
import { PORT, APP_DOMAIN } from "./config";

const app = createApp();

app.listen(PORT, () => {
  console.log(`[sema-api] online na porta ${PORT} (domínio: ${APP_DOMAIN})`);
});
