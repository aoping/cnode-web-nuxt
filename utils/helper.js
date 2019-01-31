import config from '@/config'

export const staticFile = function (filePath) {
  if (filePath.indexOf('http') === 0 || filePath.indexOf('//') === 0) {
    return filePath
  }
  return config.site_static_host + filePath
}
