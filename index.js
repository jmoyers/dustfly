var consolidate = require('consolidate')
  , fs = require('fs')
  , findit = require('findit')
  , path = require('path')
  , resolve = path.resolve
  , rel = path.join.bind(null, __dirname)
  , diff = path.relative
  , dir = path.dirname
  , base = path.basename;


module.exports = function (app, name, options) {
  var viewDir = options.views || rel('views')
    , engine = require('dustjs-linkedin')//consolidate[name]
    , namespace = options.namepsace || false
    , templates = [];

  findit
    .find(viewDir)
    .on('file', function (file, stat) {
      fs.readFile(file, function(err, contents){
        var directories = dir(diff(viewDir, file)).split(path.sep);

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
      });
    })
    .on('end', function () {
      console.log(templates); 
    })
    .on('error', function (err) {
      console.error(err);
    });
};

module.exports(null, 'dust', {
  views: resolve(rel('test', 'views')),
  namespace: '.'
});