// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')

module.exports = function override(config) {
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/@ledgerhq\/devices\/hid-framing/, '@ledgerhq/devices/lib/hid-framing'),
  )
  return config
}
