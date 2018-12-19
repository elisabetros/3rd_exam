window.onload = function() {
  console.log("load");
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(function(registration) {
        console.log(registration);
      })
      .catch(function(e) {
        console.error(e);
      });
  } else {
    console.log("Service Worker is not supported in this browser.");
  }
};