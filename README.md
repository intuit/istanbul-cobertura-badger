istanbul-cobertura-badger
=========================

Create a [coverage | 100%] badge by reading the Cobertura coverage report from node-istanbul.

Requirements
========

I started to work with Node a few months ago, and I recently stumble upon many different badges on GitHub pages,
including code coverage. I posted a question on Stackoverflow about it:

http://stackoverflow.com/questions/26028024/how-to-make-a-gulp-code-coverage-badge

I want to be able to generate the coverage report after code coverage runs by any Node.js build system like
Gulp or Grunt.

Use
=========

var coberturaBadger = require('istanbul-cobertura-badger');

```
coverageBadger("docs/tests/cobertura-coverage.xml", path.join(process.env.PWD, "docs/tests"), function() {
process.exit();
});
```

Full example
=========

```
gulp.task('test', function() {
  gulp.src('src/**/*.js')
    .pipe(istanbul()) // coverying files
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha({reporter: 'spec'})) // different reporters at http://visionmedia.github.io/mocha/#reporters
        .pipe(istanbul.writeReports({
          reporters: ['cobertura', 'text-summary', 'html'], // https://www.npmjs.org/package/gulp-istanbul#reporters
          reportOpts: { dir: './docs/tests' }
        }))
        .on('end', function() {

           coverageBadger("docs/tests/cobertura-coverage.xml", path.join(process.env.PWD, "docs/tests"), function() {
             process.exit();
           });

        });
    });
});
```
