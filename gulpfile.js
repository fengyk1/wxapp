const gulp = require("gulp");
const clean = require("gulp-clean");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const ts = require("gulp-typescript");

const projectConfig = require("./package.json");

const tsProject = ts.createProject("tsconfig.json");

const copyPath = [
  "src/**/*.*",
  "!src/**/*.less",
  "!src/**/*.sass",
  "!src/**/*.scss",
  "!src/**/*.ts",
];

const tsPath = ["src/**/*.ts","app.ts"];
const sassPath = ["src/**/*.scss"];

let dependencies = projectConfig?.dependencies || {};

let nodeModulesCopyPath = Object.keys(dependencies).map(
  (key) => `node_modules/${key}/**/*`
);

gulp.task("copyNodeModules", () => {
  return gulp.src(nodeModulesCopyPath,{
    base: '.',
    allowEmpty:true
  }).pipe(gulp.dest("./dist"));
});

gulp.task("scss", () => {
  return gulp
    .src(sassPath)
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(rename((path) => (path.extname = ".wxss")))
    .pipe(gulp.dest("./dist"));
});

gulp.task("clear", () => {
  return gulp.src("dist/**/*", { read: false }).pipe(clean());
});
gulp.task("tsCompile", () => {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist"));
});

gulp.task("copy", () => {
  return gulp
    .src(copyPath, {
      base: "src/",
      allowEmpty: true,
    })
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", () => {
  gulp.watch(copyPath, gulp.series("copy"));
  gulp.watch(tsPath, gulp.series("tsCompile"));
  gulp.watch(sassPath, gulp.series("scss"));
  gulp.watch(copyPath, gulp.series("copy"));
  gulp.watch(nodeModulesCopyPath, gulp.series("copyNodeModules"));
});

gulp.task("default", async () => {
  gulp.series(
    gulp.parallel("tsCompile", "scss", "copy")
  );
});
