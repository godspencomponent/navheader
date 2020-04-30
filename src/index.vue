<template>
  <div class="component navheader" :class="{'fixed': position === 'fixed'}" :style="{'background-color': backgroundColor}">
    <div class="navheader-menu">
      <a v-show="logo" :href="link" class="navheader-menu-logo"><img :src="logo" alt=""></a>
      <div :style="{ 'text-align': align }" class="navheader-menu-navs">
        <Menu
          :background-color='backgroundColor'
          :text-color='textColor'
          :active-text-color='activeTextColor'
          :default-active='defaultActive'
          @action='pickItem' :menus="menus"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {VueExtend} from 'godspen-lib'
  import throttle from 'lodash/throttle'
  import Menu from './menu'
  let $root
  let $dock
  let scrollfn
  export default {
    mixins: [VueExtend.mixin],
    name: 'navheader',
    label: process.env.LABEL,
    style: process.env.STYLE,
    components: { Menu },
    stack: null,
    leaf: true,
    props: {
      'menus': {
        type: Array,
        editor: {
          ignore: true
        },
        default () {
          return [
            {
              title: '导航 1',
              href: 'https://baidu.com',
              fn: '',
              anchor: '',
            }
          ]
        }
      },
      'background-color': {
        type: String,
        editor: {
          label: '背景色',
          type: 'color'
        }
      },
      'text-color': {
        type: String,
        editor: {
          label: '文字颜色',
          type: 'color'
        }
      },
      'active-text-color': {
        type: String,
        editor: {
          label: '高亮文字颜色',
          type: 'color'
        }
      },
      'default-active': {
        type: String,
        editor: {
          label: '默认导航项（可选）',
          desc: '默认导航项的序号，"1" 或者 "1-1"（子菜单）',
          type: 'input'
        }
      },
      'logo': {
        type: String,
        editor: {
          label: 'logo 图片（可选）',
          type: 'image',
        }
      },
      link: {
        type: String,
        editor: {
          label: 'logo 超链接（可选）',
          type: 'input',
        }
      },
      'align': {
        type: String,
        editor: {
          label: '对齐方式',
          type: 'enum',
          defaultList: {
            'left': '居左',
            'right': '居右'
          },
          default: 'left'
        }
      },
      sticky: {
        type: Boolean,
        editor: {
          type: 'boolean',
          label: '滚动置顶'
        },
        default: false
      },
      rootId: {
        type: String,
        editor: {
          type: 'input',
          label: '滚动区组件 id （选填）'
        }
      }
    },
    computed: {
    },
    data () {
      return {
        position: 'relative',
        deltaY: 64
      }
    },
    watch: {
      sticky (val) {
        if (val) this.listenScroll()
        else this.removeScroll()
      }
    },
    mounted () {
      scrollfn = throttle(this.onScroll, 60)
      this.$nextTick(() => {
        $root = this.getRootEl()
        $dock = this.getDock()
        if (this.sticky) this.listenScroll()
      })
    },
    editorMethods: {
    },
    methods: {
      pickItem (nav, index) {
        if (nav.fn) this.oncallExecute(nav.fn, [nav, index])
        if (/^https?:\/\//.test(nav.href)) {
          this.redirect(nav.href)
        } else if (nav.anchor) {
          this.anchorTo(nav.anchor)
        }
      },
      listenScroll () {
        if (!$root) return
        const $scroll = /^html$/i.test($root.nodeName) ? document : $root
        $scroll.addEventListener('scroll', scrollfn)
      },
      removeScroll () {
        this.position = 'relative'
        if (!$root) return
        const $scroll = /^html$/i.test($root.nodeName) ? document : $root
        $scroll.removeEventListener('scroll', scrollfn)
      },
      getRootEl () {
        const development = process.env.NODE_ENV === 'development'
        const el = (() => {
          if (development) return document.documentElement
          else {
            return (development && this.rootId && this.$parent.getComponent(this.rootId) || {}).$el || document.documentElement
          }
        })()
        return el
      },
      getDock () {
        return this.$el.parentNode
      },
      anchorTo (id) {
        if (!id) return
        const $com = (this.$parent.getComponent(id) || {}).$el
        if (!$com || !$root) return
        var rect = $com.getBoundingClientRect()
        var containerRect = $root.getBoundingClientRect()
        var target = rect.top - (containerRect.top + (+this.deltaY || 0))
        $root.scrollTop = target
      },
      redirect (url) {
        setTimeout(() => {
          window.location.href = url
        }, 100)
      },
      onScroll () {
        if (!$dock || !$root) return
        const top = /^html$/i.test($root.nodeName) ? 0 : $root.getBoundingClientRect().top
        const dockTop = $dock.getBoundingClientRect().top
        console.log('onScroll', top, dockTop)
        if (dockTop <= top) {
          this.position = 'fixed'
        } else {
          this.position = 'relative'
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .component.navheader {
    width: 100%;
    height: auto;
    background-color: #fff;
    border-bottom: solid 1px #e6e6e6;
    &.fixed {
      position: fixed;
      left 0;
      right 0;
      top 0;
      z-index 10
    }
    .navheader-menu {
      max-width: 1140px;
      margin: 0 auto;
      display: flex;
      &-logo {
        display inline-block
        height 60px;
        flex: 0
        cursor pointer
        position relative
        margin-right: 30px;
        > img {
          height: 48px;
          width: auto;
          margin-top: 6px;
          vertical-align: top;
        }
      }
      &-navs {
        flex: 1;
        text-align left
      }
    }
  }
</style>
