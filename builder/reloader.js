(function () {

  console.log('reloader injected');

  if (!self.EventSource) {
    console.log('EventSource is required.');
    return;
  }

  const source = new EventSource('/');
  source.onmessage = (event) => {
    console.log(JSON.parse(event.data));
    self.location.reload();
  }


})();

