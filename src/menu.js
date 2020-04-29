import ArMenu from 'element-ui/lib/menu'
import ArMenuItem from 'element-ui/lib/menu-item'
import ArSubmenu from 'element-ui/lib/submenu'

export default {
  props: ['menus'],
  render (h) {
    const menus = this.menus || []
    const createMenusItem = (item = {}, id = 0) => {
      if (item.sub && item.sub.length) {
        return h(
          ArSubmenu,
          { props: { index: id } },
          [ h('span', {slot: 'title'}, item.title) ]
            .concat(item.sub.map((sub, i) => createMenusItem(sub, `${id}-${i}`)))
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
      { props: {mode: 'horizontal'} },
      menus.map((m = {}, i) => createMenusItem(m, '' + i))
    )
  },
  methods: {
    action (item, id) {
      this.$emit('action', item, id)
    }
  }
}