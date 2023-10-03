import { access, constants } from 'fs/promises'

export async function getAppPath() {
  const { dirname } = require('path')

  for (let path of module.paths) {
    try {
      await access(path, constants.F_OK)
      return dirname(path)
    } catch (e) {
      console.debug(e)
    }
  }
}
