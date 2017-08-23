import {encryptPassword,comparePassword} from 'passport/password-crypto'
import test from 'tape'

test('password Crypto test', async (assert) => {

  const password = 'CMS.rudicaf2017'

  const encrypted_password = await encryptPassword(password)
  
  console.log(encrypted_password)

  const matched = await comparePassword(password,  encrypted_password)

  assert.ok(matched)

  assert.end()
})


