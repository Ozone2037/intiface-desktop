module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      definitions[0] = Object.assign(definitions[0], {
        WEBPACK_ELECTRON: process.env["npm_lifecycle_event"].indexOf("electron") !== -1
      });
      return definitions;
    });
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.nonpolynomiallabs.intiface-desktop",
        copyright: "Copyright © 2019 Nonpolynomial Labs, LLC",
        artifactName: "${name}-${version}-${os}-${arch}.${ext}",
        publish: [ "github" ],
        win: {
          "publisherName": ["Nonpolynomial Labs, LLC", "Sectigo RSA Code Signing CA"],
          "target": {
            "target": "nsis",
            "arch": [
              "x64",
              "ia32"
            ],
          },
        },
      },
    },
  },
};
