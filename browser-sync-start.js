const browserSync = require('browser-sync').create();

const WATCH_FILES = [
  'views/**/*.ejs',
  'public/stylesheets/**/*.css',
  'public/javascripts/**/*.js',
  'routes/**/*.js',
];

browserSync.init({
  proxy: 'http://localhost:3000',
  files: WATCH_FILES,
  server: false,
  open: true,
  notify: false,
  ignore: ['node_modules', 'bin/www', 'package.json'],
});

console.log('BrowserSync está escuchando en http://localhost:3001');
