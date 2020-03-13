const im = require('./src/im')

try {
  im.deleteUsers(['servicer1', 'user0'])
} catch(err) {
  console.log(err)
}