dustfly
=======

* Capable of precompiling a directory of dust templates recursively
* Capable of creating a set of routes for Express 3 that...
    * Serve a whole directory of templates, precompiled as one file
    * Specific subdirectories, serving templates from that point and deeper
    * Specific precompiled templates
* Optionally minify, namespace, filter input files
* Mount any route as the base

Example usage:

    var dustfly = require('dustfly'),
      app = require('express')();

    dustfly(app, {
      root: 'views',                    // Default: ./views
      mount: 'templates',               // Default: templates
      namespace: false,                 // Default: false
      min: true,                        // Default: false
      filter: function(file){           // Default: none
        return ~file.indexOf('.public')
      }
    });

    app.listen(3000);


Given a directory structure:

    views/
        relative/
            deep/
                deep_child_view.dust
                deep_parent_view.dust
            relative_child_view.dust
            relative_parent_view.dust
          child_view.dust
          parent_view.dust