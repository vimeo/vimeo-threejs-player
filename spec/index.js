var context = require.context('.', true, /.+\-spec\.js?$/);
console.log(context);
context.keys().forEach(context);
module.exports = context;