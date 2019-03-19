<template>
  <div class="container">
    <div class='margin' v-for='item in currentData' :key='item.id'>
      <card :item='item' :hidden='true'></card>
    </div>
  </div>
</template>

<script>
  import { api } from '../../const'
  import card from '../../components/card'

  export default {
    data () {
      return {
        currentData: [],
        t:0
      }
    },
    components: {
      card
    },
    onLoad (options) {
      const from = options.type
      this.t = wx.getStorageSync('t')
      // from 最近话题 最近回复
      switch (from) {
        case 'topic':
          this.getRecentlyPost()
          wx.setNavigationBarTitle({
            title: '最近话题'
          })
          break
        case 'reply':
          this.recentlyReplyList(from)
          wx.setNavigationBarTitle({
            title: '最近回复'
          })
          break
      }
    },
    methods: {
      async getRecentlyPost () {
        const res = await this.$http.get(`${api}`, {
          act: 'post.recentlyPostList',
          t: this.t,
          barId: 1,
          pageNum: 0,
          size: 10
        })
        if (res.data.code == null) {
          this.currentData = res.data.list
        }
      },
      async recentlyReplyList () {
        const res = await this.$http.get(`${api}`, {
          act: 'post.recentlyReplyList',
          t: this.t,
          barId: 1,
          pageNum: 0,
          size: 10
        })
        if (res.data.code == null) {
          this.currentData = res.data.list
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  .container {
    background-color: rgb(245, 245, 249);
    min-height: 100vh;
    .margin {
      margin-bottom: 20rpx;
    }
  }
</style>
