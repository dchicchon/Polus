const mix = require("laravel-mix")

mix.js("src/js/index.js", 'dist/js')
    .js('src/js/background.js', 'dist/js')
    .js('src/js/popup.js', 'dist/js')
    .sass('src/css/main.scss', 'dist/css')
    .sass('src/css/popup.scss', 'dist/css')
    .copy('src/assets', 'dist/assets')
    .options({ processCssUrls: false })