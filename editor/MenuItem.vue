<template>
  <div class="ar-menu-item-wrapper">
    <div class="ar-menu-item el-icon-menu" :class="{active}" @click="selectItem">
      <div class="ar-menu-item-title">{{info.title | slice}}</div>
      <div class="ar-menu-item-operation">
        <i title="上移" v-show="index !== 0" @click.stop="upItem()" class="el-icon-xxxxx">↑</i>
        <i title="下移" v-show="index < length - 1" @click.stop="downItem(item)" class="el-icon-xxxxx">↓</i>
        <i v-show="!(deep == 1 && length == 1)" @click.stop="deleteItem()" title="删除" class="el-icon-delete"></i>
        <i v-show="deep < 3" @click.stop="addChild()" title="添加子菜单" class="el-icon-plus"></i>
      </div>
    </div>
    <div v-if="info.sub && info.sub.length" class="ar-menu-item-sub">
      <ar-menu-item v-for="(m,i) in info.sub" :key="i" :deep='+deep + 1' :info='m' :parent='info.sub' :index="i" :length="info.sub.length"></ar-menu-item>
    </div>
  </div>
</template>
<script>
export default {
  props: ['info', 'index', 'length', 'deep', 'parent'],
  name: 'ar-menu-item',
  inject: ['trigger', 'dynamatic'],
  filters: {
    slice (str, len = 6) {
      return str.slice(0, len) + (str.length > len ? '...' : '')
    }
  },
  computed: {
    active () {
      return this.info === this.dynamatic.itemModel
    }
  },
  methods: {
    upItem () {
      this.trigger('upItem', this.parent, this.index)
    },
    downItem () {
      this.trigger('downItem', this.parent, this.index)
    },
    deleteItem () {
      this.trigger('removeItem', this.parent, this.index)
    },
    addChild () {
      if (!this.info.sub) this.$set(this.info, 'sub', [])
      this.trigger('addItem', this.info.sub)
    },
    selectItem () {
      this.trigger('selectItem', this.info)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
.ar-menu-item {
  display flex
  padding 8px 10px 8px 0
  background-color: #262626;
  color: #ddd
  font-size 14px;
  &:hover, &.active {
    background-color: #121212;
  }
  .ar-menu-item-title {
    margin-left 4px;
  }
  .ar-menu-item-operation {
    flex: 1
    text-align right
    > i {
      cursor pointer
    }
  }
}
.ar-menu-item-sub {
  padding-left: 18px;
}
</style>