//
// ember_to_static.js
//
// This script takes a URL and a file path as arguments. (In that order!)
// The script then runs the Javascript on this page and waits until Ember has finished loading.
// It then renders the resulting static HTML page to the given file path.
//


var fs      = require('fs');
var system  = require('system');
var page    = require('webpage').create();


function writeToFile (string, file) {
  try {
    f = fs.open(file, 'w');
    f.write(string);
    f.close();
  } catch (e) {
    console.log(e);
  }
}

// Keep track of whether the page has already been exported. The 'setTimeout' mess might cause it to be exported multiple times.
// The file will still contain just one copy, but the console output will have been cluttered.
var pageHasBeenExported = false;
function exportPageContents () {
  if (!pageHasBeenExported) {
    pageHasBeenExported = true;
    
    writeToFile(page.content, file);
    console.log(page.content);
    if(!silence) { console.log("Finished."); }
    phantom.exit();
  }
}


var script, url, file, silence;

script = system.args[0];
if (system.args.length < 3 || system.args.length > 4) {
  // Output usage info and exit.
  console.log("Usage: "+script+" URL filename [silence]");
  console.log("  URL: address to open and run");
  console.log("  filename: file to render the result to")
  console.log("  silence: enter 'silence' (without quotes) to only output the page content and suppress info messages")
  phantom.exit(1);
} else {
  url = system.args[1];
  file = system.args[2];
  silence = (system.args[3] == 'silence');
  
  if (!silence) { console.log("Will render "+url+" to "+file+"."); }
  
  // Ember has no method that indicates whether everything is loaded.
  // That's a shame, because we don't want to export the HTML before everything has loaded.
  // We also don't want to wait while the application is already finished, spending precious server time.
  // To solve this, we can keep track of resource requests. I claim that the page is finished when there are no outstanding requests for resources.
  // This is not entirely true, because sometimes a resource still needs to be rendered after loading. Or the application is still building a request.
  // To eliminate this in most cases, we wait an additional 1s after everything has loaded, to make sure rendering etc. can take place.
  // However, I welcome any suggestions to do this better.
  
  // Note that we need to keep track of request/response ids instead of just count as larger resources might be returned in chuncks.
  var activeRequests = [];
  
  page.onResourceRequested = function(request) {
    activeRequests.push(request.id);
    if (!silence) { console.log("Active requests: " + activeRequests.length); }
  }
  page.onResourceReceived = function(response) {
    activeRequests.splice(activeRequests.indexOf(response.id), 1); // Tricky statement, but it simply removes the id from the array.
    if (!silence) { console.log("Active requests: " + activeRequests.length); }
    
    if (activeRequests == 0) {
      // Wait 1s to make sure rendering etc. can finish.
      window.setTimeout(function() {
        // Make sure no requests were created in the meantime (in which case this method would automatically be called again once it's finished loading)
        if (activeRequests == 0) {
          // Write the HTML to file
          exportPageContents();
        }
      }, 1000); // This is the delay to allow rendering to take place. You can change this value if you like.
    }
  }
  
  page.open(url, function(status) {
    if (status != 'success') {
      if (!silence) { console.log("Unable to load URL!"); }
      phantom.exit();
    } else {
      // Start a long timeout. When the page still doesn't seem to have finished loading after 30s, something has likely gone wrong. This timeout prevents a hangup of the server.
      window.setTimeout(function() {
        exportPageContents();
      }, 30000);
    }
  });
}