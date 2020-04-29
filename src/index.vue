<template>
  <div class="component navheader">
    <Menu @action='pickItem' :menus="menus"/>
  </div>
</template>

<script>
  import {VueExtend} from 'godspen-lib'
  import Menu from './menu'
  
  let $correlationComs, rootEl

  export default {
    mixins: [VueExtend.mixin],
    name: 'navheader',
    label: process.env.LABEL,
    style: process.env.STYLE,
    components: { Menu },
    stack: null,
    leaf: true,
    props: {
    },
    computed: {
    },
    data () {
      return {
        menus: [
          {
            title: '处理中心',
            href: '',
            fn: '',
            anchor: '',
          },
          {
            title: '哈啊安抚',
            href: '',
            fn: '',
            anchor: '',
            sub: [
              {
                title: '三国杀',
                href: '',
                fn: '',
                anchor: '',
              },
              {
                title: '设计公司',
                href: '',
                fn: '',
                anchor: '',
              }
            ]
          },
          {
            title: '附加费',
            href: '',
            fn: '',
            anchor: '',
            sub: [
              {
                title: '刚看过',
                href: '',
                fn: '',
                anchor: '',
              },
              {
                title: '还好啦',
                href: '',
                fn: '',
                anchor: '',
                sub: [
                  {
                    title: '如无问题',
                    href: '',
                    fn: '',
                    anchor: '',
                  },
                  {
                    title: '来咯',
                    href: '',
                    fn: '',
                    anchor: '',
                  }
                ]
              }
            ]
          },
        ]
      }
    },
    editorMethods: {
    },
    methods: {
      async pickItem (nav, index) {
        if (nav.activeAction) this.oncallExecute(nav.activeAction, [nav, index])
        if (nav.href) {
          this.redirect(nav.href)
        } else if (nav.correlationId) {
          await this.anchorTo(nav.correlationId, this.scrollSpeed || 'xx')
        }
        this.currentIndex = index
      },
      async anchorTo (id, speed) {
        switch (String(speed)) {
          case 'fast':
            speed = 60
            break
          case 'normal':
            speed = 32
            break
          case 'slow':
            speed = 18
            break
          case 'none':
          default:
            speed = 0
        }
        if (!id) return
        var $com = this.$parent.getComponent(id)
        if (!$com) return
        var $el = $com.$el
        if (!$el) return
        var rect = $el.getBoundingClientRect()
        var container = rootEl
        if (!container) return
        var containerRect = container.getBoundingClientRect()
        var target = rect.top - (containerRect.top + (+this.deltaY || 0))
        var direction = target > 0 ? 1 : -1
        var delta = speed <= 0 ? Math.abs(target) : speed
        var move = new Promise(resolve => {
          var timer = setInterval(() => {
            if (target * direction <= 0) {
              clearInterval(timer)
              resolve()
            }
            var mdelta = Math.min(Math.abs(target), delta)
            container.scrollTop += direction * mdelta
            target -= mdelta * direction
          }, 16)
        })
        await move
      },
      redirect (url) {
        setTimeout(() => {
          window.location.href = url
        }, 20)
      },
      onScroll () {
        $correlationComs = this.navbars.map((nav, index) => [nav.correlationId && this.$parent.getComponent(nav.correlationId), index])
        var tops = $correlationComs
        .map(([nav, index]) => {
          return [nav && nav.$el.getBoundingClientRect().top, nav && nav.$el.getBoundingClientRect().bottom, index]
        })
        .filter(a => typeof a[0] === 'number')
        .sort((a, b) => a[0] > b[0] ? 1 : -1)
        var containerRect = rootEl.getBoundingClientRect()
        for (let [top, bottom, index] of tops) {
          if (containerRect.top + (+this.deltaY || 0) <= top ||
            (containerRect.top + (+this.deltaY || 0) >= top && bottom > containerRect.bottom)) {
            this.currentIndex = index
            break
          }
        }
        console.log(rootEl.scrollTop, this.currentIndex)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .component.navheader {
    width: 100%;
    height: 100%;

  }
</style>
