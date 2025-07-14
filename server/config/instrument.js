// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://04996cbd2353ec3476aba2884d9fa077@o4509644221644800.ingest.us.sentry.io/4509663679807488",
  integrations: [Sentry.mongooseIntegration(),
    Sentry.mongooseIntegration()
  ],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});