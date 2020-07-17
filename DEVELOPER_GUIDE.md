## Setting up local npm package

This operation will be takes place while you are including a new change on package. Once you started development make sure the package you are developing should be synced to your 'Test' application.

[How to sync local npm package?](https://docs.npmjs.com/cli/link.html)

### How can we sync local package to our test application ?

Goto the package folder hit below command. Below command will create a local package into your machine. 
```
npm link
```

Now you should include your local package to your test project.
```
npm link @creamie/core
```

So your setup is complete. While you are doing any changes in you local package will automatically sync to your `node_modules`.

# Start developing. CHEERS!