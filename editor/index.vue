<template>
  <div class="component-editor">
    <el-card style="background-color: #262626;">
      <div>
        <span style="color:#ddd; font-size: 16px;">导航菜单</span>
      </div>
      <menu-item v-for="(m,i) in componentInfo.menus" :key="i" :info='m' :index="i" :parent='componentInfo.menus' deep='1' :length="componentInfo.menus.length"></menu-item>
      <div @click="addItem(componentInfo.menus)" class="add-menu-item">添加 +</div>
      <el-form size='mini' v-if="dynamatic.itemModel" :model='dynamatic.itemModel' label-position="left">
        <el-form-item label="内容" prop="title" :required="true">
          <el-input v-model="dynamatic.itemModel.title"></el-input>
        </el-form-item>
        <el-form-item v-if="nosub" label="超链接" prop="href">
          <el-input v-model="dynamatic.itemModel.href"></el-input>
        </el-form-item>
        <el-form-item v-if="nosub" label="锚点" prop="anchor">
          <el-input v-model="dynamatic.itemModel.anchor"></el-input>
        </el-form-item>
        <el-form-item label="方法调用" prop="fn">
          <attr-function :content.sync="dynamatic.itemModel.fn"
          ></attr-function>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import MenuItem from './MenuItem.vue'
  export default {
    name: 'maliangeditor',
    components: {MenuItem},
    provide () {
      const that = this
      return {
        trigger: this.trigger,
        dynamatic: this.dynamatic
      }
    },
    props: {
      componentInfo: {
        type: [Object],
        default () {
          return {
          }
        }
      }
    },
    computed: {
      nosub () {
        const item = this.dynamatic && this.dynamatic.itemModel
        return !item || !item.sub || !item.sub.length
      }
    },
    data: function () {
      return {
        dynamatic: {
          itemModel: null
        }
      }
    },
    mounted: function () {
      if (!this.componentInfo.menus) this.$set(this.componentInfo, 'menus', [
        {
          title: '导航 1',
          href: 'https://baidu.com',
          fn: '',
          anchor: '',
        }
      ])
    },
    methods: {
      trigger (event, ...payload) {
        switch (event) {
          case 'addItem':
            this.addItem.apply(this, payload)
            break;
          case 'upItem':
            this.upItem.apply(this, payload)
            break;
          case 'downItem':
            this.downItem.apply(this, payload)
            break;
          case 'removeItem':
            this.removeItem.apply(this, payload)
            break;
          case 'selectItem':
            this.selectItem.apply(this, payload)
            break;
        }
      },
      genItem () {
        return {
          title: '导航 1',
          href: 'https://baidu.com',
          fn: '',
          anchor: '',
        }
      },
      addItem (parent = []) {
        const item = this.genItem()
        parent.push(item)
        this.dynamatic.itemModel = item
      },
      upItem (parent = [], index) {
        if (index == 0) return
        parent.splice(index - 1, 2, parent[index], parent[index-1])
      },
      downItem (parent = [], index) {
        if (index == parent.length - 1) return
        parent.splice(index, 2, parent[index + 1], parent[index])
      },
      removeItem (parent = [], index) {
        parent.splice(index, 1)
        this.dynamatic.itemModel = null
      },
      selectItem (item) {
        this.dynamatic.itemModel = item
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .component-editor {
    .add-menu-item {
      color: #ddd
      font-size 14px;
      text-align center;
      padding 8px;
      cursor pointer
      line-height 1;
      background-color: #121212;
      margin-top: 4px;
    }
  }
</style>
