const { products, categories } = require('/Users/sahidafridi/tokyodressing/src/data/products.js');

async function check() {
  // since products.js uses ES modules (export const), we can't require it directly in Node if type isn't module.
  // We can just read the file and extract URLs.
}
check();
