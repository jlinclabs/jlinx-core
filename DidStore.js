import FileStore from './FileStore.js'
import { isJlinxDid } from './index.js'

export default class Didstore extends FileStore {

  _matchFilename(filename){ return isJlinxDid(filename) }

  _serialize(value){ return JSON.stringify(value) }

  _deserialize(json){
    // return JSON.parse(json)
  }

  async get(did){
    if (await this.has(did)) return did
  }

  async track(did){
    await this.set(did, did)
  }
}
