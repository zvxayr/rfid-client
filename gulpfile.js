const gulp      = require('gulp')
const nodemon   = require('gulp-nodemon')

gulp.task('default', ['nodemon'])

gulp.task('nodemon', () => {
    nodemon({
        script: 'client.js',
        watch: ['client.js'],
        env: { 'NODE_ENV': 'development' }
    })
})