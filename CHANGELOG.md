# CHANGELOG

## 0.1.4 (December 10, 2020)

### Issue Fix & Valuable feature

* Issue on binder 'free' method for default and custom plugins as well
* Event related unwanted console error
* Finally, a new valuable extra feature on 'loop' which is called 'setPreprocessor'

## 0.1.3 (October 04, 2020)

### Performance improvements

* Binder DOM traversing start from component body
* Removed binder attributes and properties from HTMLElements and storing it's detail in DOM object
* Stopped reinitializing binder at loop directive which will avoid orphan DOM object on domCache when manipulating loop directive scopes 

## 0.1.2 (September 12, 2020)

### Performance fix - (Loop Directive)

* Remembering loop element DOMs in cache to use it on insert
* Element listing on its parent loop reference instead of creating new element tag
  
## 0.1.0 (August 02, 2020)

### New Features - (If and Loop Directives)

* 'If' directive, which is combined with binder and easy to remove/add DOMs
* 'Loop' directive, which is also combined with binder scope as array property

## 0.0.0 (June 14, 2020)

### First release (Beta)

* Web component lifecycle, binder, router & events are the current features available in this version.
