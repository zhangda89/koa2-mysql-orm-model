'use strict';

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: __dirname + '/example.db'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'example'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: __dirname + '/example.db'
    }
  }
}
