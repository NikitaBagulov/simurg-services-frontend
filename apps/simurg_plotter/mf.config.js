module.exports = {
  port: 9004,
  federation: {
    exposes: {
      './App': './src/app',
    },
  },
};
