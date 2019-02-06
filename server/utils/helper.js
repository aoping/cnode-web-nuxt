const bcrypt = require('bcryptjs')
const utility = require('utility')

export const bhash = str => {
  return bcrypt.hashSync(str, 10)
}

export const bcompare = (str, hash) => {
  return bcrypt.compareSync(str, hash)
}

export function makeGravatar(email) {
  return (
    'http://www.gravatar.com/avatar/' +
    utility.md5(email.toLowerCase()) +
    '?size=48'
  )
}

export const validateId = str => {
  return /^[a-zA-Z0-9\-_]+$/i.test(str);
};
