const casual = require('casual');

casual.define('user', function(index) {
  return {
    '#': index,
    'First Name': casual.first_name,
    'Last Name': casual.last_name,
    'Company Name': casual.company_name,
    'Address': casual.address,
    'City': casual.city,
    'Country': casual.country,
    'Zip': casual.zip(),
    'Phone': casual.phone,
    'Email': casual.email,
    'Url': casual.url,
  }
})

const user = (index) => casual.user(index);

module.exports = user;