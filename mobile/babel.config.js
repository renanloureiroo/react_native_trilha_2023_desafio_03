module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: ["./app/"],
          alias: {
            "@components": "./app/components",
            "@assets": "./app/assets",
            "@config": "./app/shared/config",
            "@constants": "./app/shared/constants",
            "@services": "./app/services",
            "@utils": "./app/shared/utils",
            "@contexts": "./app/contexts",
            "@hooks": "./app/hooks",
            "@navigation": "./app/navigation",
            "@screens": "./app/screens",
          },
        },
      ],
    ],
  };
};
