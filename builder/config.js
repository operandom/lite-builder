module.exports = {
  ...{
    root: 'app',
    index: 'index.html',
    hostname: '0.0.0.0',
    port: 80
  },
  ...require('../package.json').builder
};
