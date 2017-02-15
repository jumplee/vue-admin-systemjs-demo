module.exports = Vue.extend({
  template: require('./index.html!'),
  data: function () {
    return {
      msg: '老大'
    }
  }
})
require('./index.css!')
