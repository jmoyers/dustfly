var consolidate = require('consolidate')
  , fs = require('fs')
  , findit = require('findit')
  , path = require('path')
  , resolve = path.resolve
  , rel = path.join.bind(null, __dirname)
  , diff = path.relative
  , dir = path.dirname
  , base = path.basename
  , _ = require('lodash')
  , express = require('express')
  , uglify = require('uglify-js');


module.exports = function (app, options) {
  var viewDir = options.views || rel('views')
    , engineName = options.engineName || 'dust'
    , engine = require('dustjs-linkedin')//consolidate[engineName]
    , namespace = options.namespace || false
    , mount = options.mount || 'templates'
    , filter = options.filter || function(){return true;}
    , min = options.min || false
    , templates = []
    , fileCount = 0
    , readCount = 0
    , finalCount = -1;

  findit
    .find(viewDir)
    .on('file', function (file, stat) {
      if (!filter(file)) return;

      fileCount++;

      fs.readFile(file, function(err, contents){
        readCount++;

        var directories = dir(diff(viewDir, file)).split(path.sep);

        if (!~directories.indexOf('.')) {
          directories = ['.'].concat(directories);
        }

        //console.log(directories);

        var name = '';

        if (namespace === false) {
          name = base(file);
        } else {
          name = diff(viewDir, file).replace(path.sep, namespace);
        }
        
        templates.push({
          name: name,
          compiled: engine.compile(contents.toString(), name),
          paths: directories
        });

        if (readCount == finalCount) {
          buildRoutes(templates);
        }
      });
    })
    .on('end', function () {
      finalCount = fileCount; 
    })
    .on('error', function (err) {
      console.error(err);
    });

  function buildRoutes(){
    var routes = [];
    //if (!app) return;

    templates.forEach(function (template) {
      
      var deep = _.reduce(template.paths, function (route, tpath) {
        routes[route] = routes[route] || '';
        routes[route] += template.compiled;

        route += (tpath == '.' ? '' : '/' + tpath );
        
        return route;
      }, '/' + mount);

      
      if ('/' + mount !== deep) {
        routes[deep] = routes[deep] || '';
        routes[deep] += template.compiled;
      }

      routes[deep + '/' + template.name] = template.compiled;
    });

    Object.keys(routes).forEach(function (route) {
      var output = routes[route];
      
      if (min) {
        var ast = uglify.parser.parse(output);
        ast = uglify.uglify.ast_mangle(ast);
        ast = uglify.uglify.ast_squeeze(ast);
        output = uglify.uglify.gen_code(ast);
      }

      var handler = function (req, res) {
        res.header('Content-Type', 'application/javascript');
        res.end(output)
      };
        
      app.get(route, handler);
      app.get(route + '.js', handler);
    });
  }
};

var app = express();

module.exports(app, {
  views: resolve(rel('test', 'views')),
  min: true
});

app.listen(3000);