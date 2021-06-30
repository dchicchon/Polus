const mix = require("laravel-mix");

mix.js("src/js/index.js", "dist/js").vue().version()
  .js("src/js/popup.js", "dist/js").vue().version()
  .js("src/js/background.js", "dist/js").version()
  .sass("src/css/main.scss", "dist/css")
  .sass("src/css/popup.scss", "dist/css")
  .copy("src/assets", "dist/assets")
  .copy("src/html", "dist/html")
  .copy("src/manifest.json", "dist")
  .setPublicPath("./")
  .options({ processCssUrls: false });
