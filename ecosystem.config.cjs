module.exports = {
  apps: [
    {
      name: 'GDCToolbox',
      port: '3000',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
