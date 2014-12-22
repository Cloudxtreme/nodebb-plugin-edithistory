# nodebb-plugin-edithistory

This plugin will give you edit histories for posts. It uses the `diff` module to store diffs for each version.

It relies on bootbox modals.

## socket

posts.edithistory.*
```
posts.editHistory.get {pid: XX, offset: XX}
```
## database

```
pid:XXX:edithistory - a list of json diffs. RPUSH onto end for new edits.
```
