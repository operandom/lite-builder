console.log('APP START')

import { HelloWorld } from './components/hello-world/hello-world.js';

// Register components
Promise.all([
  HelloWorld,
].map(component => component.register()))
  .then(() => {
    console.log('Components registred.');
  })
  .catch(error => {
    console.log(error);
  })
;