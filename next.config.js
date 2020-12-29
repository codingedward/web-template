const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: `${process.cwd()}/web/.env` });

module.exports = {
  webpack: (config, { defaultLoaders }) => {
    config.module.rules.push({
      test: /\.+(js|ts)$/,
      loader: defaultLoaders.babel,
      include: path.resolve(__dirname, './common'),
    });
    return config;
  },
};
