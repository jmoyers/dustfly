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

```js
var dustfly = require('dustfly')
  , app = require('express')();

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
```

Given a directory structure:

    views/
        child_view.dust
        parent_view.dust
        relative/
            relative_child_view.dust
            relative_parent_view.dust
            deep/
                deep_child_view.dust
                deep_parent_view.dust

`curl localhost:3000/templates` will contain:
* child_view.dust
* parent_view.dust
* relative_child_view.dust
* relative_parent_view.dust
* deep_child_view.dust
* deep_parent_view.dust

`curl localhost:3000/templates/parent_view.dust` will contain:
* parent_view.dust

`curl localhost:3000/templates/relative` will contain:
* relative_child_view.dust
* relative_parent_view.dust
* deep_child_view.dust
* deep_parent_view.dust

`curl localhost:3000/templates/relative/deep` will contain:
* deep_child_view.dust
* deep_parent_view.dust

TODO:
* Factor out getting combined template for a given directory into a function
* Create a bin/dustfly command for combining templates statically
* Support etags in express integration
* Clean up code so aynch traversal isn't so butt ass ugly
* Support a 'base' javascript file analagous to `dust-core-1.0.0.min.js` in http://linkedin.github.com/dustjs/
* See if we can make this template engine agnostic with consolidate.js