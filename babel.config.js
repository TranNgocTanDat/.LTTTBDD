module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './app', // alias @ trỏ về thư mục app/
          },
        },
      ],
    ],
  };
};
