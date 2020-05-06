import ArMenu from 'element-ui/lib/menu'
import ArMenuItem from 'element-ui/lib/menu-item'
import ArSubmenu from 'element-ui/lib/submenu'
if (!/^edit[oe]r|preview$/i.test(window.EDIT_TYPE)) {
  require('element-ui/lib/theme-chalk/menu.css')
  require('element-ui/lib/theme-chalk/menu-item.css')
  require('element-ui/lib/theme-chalk/submenu.css')
  require('element-ui/lib/theme-chalk/icon.css')
}
ArSubmenu.props.alignMode = { type: String }
ArSubmenu.methods.updatePlacement = function () {
  this.currentPlacement = this.mode === 'horizontal' && this.isFirstLevel
    ? 'bottom-start'
    : this.alignMode === 'right' ? 'start' : 'right-start'
}
export default {
  props: ['menus', 'background-color', 'text-color', 'active-text-color', 'default-active', 'align'],
  render (h) {
    const menus = this.menus || []
    const createMenusItem = (item = {}, id = 0) => {
      if (item.sub && item.sub.length) {
        return h(
          ArSubmenu,
          { props: { index: id, alignMode: this.align } },
          [ h('span', {slot: 'title'}, item.title) ]
            .concat(item.sub.map((sub, i) => createMenusItem(sub, `${id}-${i + 1}`)))
        )
      } else {
        return h(
          ArMenuItem,
          {
            props: { index: id },
            nativeOn: { click: () => this.action(item, id)
          }
        }, item.title)
      }
    }
    return h(
      ArMenu,
      {
        props: {
          mode: 'horizontal',
          'background-color': this.backgroundColor,
          'text-color': this.textColor,
          'active-text-color': this.activeTextColor,
          'default-active': this.defaultActive
        },
        style: {
          'border-bottom': 'none',
          'display': 'inline-block'
        }
      },
      menus.map((m = {}, i) => createMenusItem(m, `${i + 1}`))
    )
  },
  methods: {
    action (item, id) {
      this.$emit('action', item, id)
    }
  }
}