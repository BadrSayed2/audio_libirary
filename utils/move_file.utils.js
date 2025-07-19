const fs = require('fs')

async function move_file(old_path, new_path) {
  return new Promise((resolve, reject) => {
    fs.rename(old_path, new_path, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = move_file