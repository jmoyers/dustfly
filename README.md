dustfly
=======

* Capable of precompiling a directory of dust templates
* Capable of creating a set of routes for Express 3 that...
    * Serve a whole directories of templates, precompiled as one file
    * Specific precompiled templates
* Optionally minify, namespace, filter input files
* Mount any route as the base

Example:

Directory structure

    views/
        relative/
            deep/
                deep_child_view.dust
                deep_parent_view.dust
            relative_child_view.dust
            relative_parent_view.dust
          child_view.dust
          parent_view.dust

