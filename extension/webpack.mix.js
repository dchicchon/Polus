const mix = require("laravel-mix");

// mix.override((config) =>  {
//   delete config.watchOptions
// })

mix
  .js("src/js/app/app.js", "dist/js")
  .vue()
  .version()
  .js("src/js/popup/popup.js", "dist/js")
  .vue()
  .version()
  .js("src/js/background.js", "dist")
  .version()
  // .sass("src/css/popup.scss", "dist/css")
  .sass("src/css/main.scss", "dist/css")
  .copy("src/assets", "dist/assets")
  .copy("src/html", "dist/html")
  .copy("src/manifest.json", "dist")
  .setPublicPath("./")
  .options({ processCssUrls: false });
