System.config({
  map: {
    html: './node_modules/Systemjs-plugin-text/text.js',
    css: './node_modules/Systemjs-plugin-css/css.js'
  }
})
var menu = new Vue({
  el: '#menu',
  data: {
    menus: [{
      name: '用户管理'
    }]
  },
  methods: {
    createTab: function (menu) {
      System.import('./app/user/index.js').then(function (User) {
        var vm = new User().$mount()
        var el = document.createElement('div')
        el.className = 'x-tab-panel'
        el.appendChild(vm.$el)
        document.getElementById('panels').appendChild(el)
      })
      tabs.tabs.push({
        name: 'haha'
      })
    }
  }

})
var tabs = new Vue({
  el: '#tabs',
  data: {
    tabs: [{
      name: '首页'
    }]
  },
  methods: {

  }

})

