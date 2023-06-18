export function getSwaggerUiHtml(url: string, options: SwaggerUiOptions = {}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI" />
    <title>${options.title || 'SwaggerUI'}</title>
    <link href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.15.5/swagger-ui.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.17.0/favicon-32x32.png" rel="icon" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => { window.ui = SwaggerUIBundle({ url: ${JSON.stringify(url)}, dom_id: '#swagger-ui' }) }
    </script>
  </body>
</html>`
}

export interface SwaggerUiOptions {
  title?: string
}
