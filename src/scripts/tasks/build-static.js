var Metalsmith = require('metalsmith'),
    gulp = require('gulp'),
    collections = require('metalsmith-collections'),
    layouts = require('metalsmith-layouts'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    drafts = require('metalsmith-drafts'),
    ignore = require('metalsmith-ignore'),
    assets = require('metalsmith-assets'),
    fs = require('fs'),
    path = require('path'),
    partials = require('./../plugins/partials.js'),
    metadata = require('/content/metadata.json'),
    url = process.env.URL || '/';

    metadata.url = metadata.url || url;
// Build
gulp.task('build-static', function (cb) {
  console.time('[metalsmith] build finished');
  var metalsmith = Metalsmith(__dirname+'/../../');

      metalsmith
      .metadata(metadata)
      .source('/content/posts')
      // .use(assets({
      //   source: './assets', // relative to the working directory
      //   destination: './assets' // relative to the build directory
      // }))
      .use(collections({
         articles: {
            pattern: '*.md',
            sortBy: 'date',
            reverse: true
          }
      }))
      .use(markdown({}))
      .use(require('./../plugins/setFilePath.js'))
      .use(drafts({}))
      .use(ignore([
          '/content/_drafts/*',
          '/content/posts/index.md'
      ]))
      .use(permalinks({'pattern': ':title', 'relative': false}))
      .use(layouts({
        engine: 'handlebars',
        partials: partials(metalsmith, '/content/layouts', 'partials'),
        relative_path: require('./../plugins/getPath.js'),
        directory: '/content/layouts'
      }))
      .clean(false)
      .destination(process.env.WWW);

      metalsmith.build(function (err) {
          if (err) { throw err; }
          console.timeEnd('[metalsmith] build finished');
          cb();
      });
});

gulp.task('watch:static', function(){
    gulp.watch(['/content/posts/**/*.md', './layouts/**/*.html'], ['build']);
});
