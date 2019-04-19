<template>
  <div class="container">
    <!--<bottomAction v-if="bottomActionVisible" @close-modal="closeModal" :postId="deletedPostId"></bottomAction>-->
    <div class='margin' v-for='item in currentData' :key='item.id'>
      <card :item='item' :hidden='true' @reloadCardList="reloadCardList" @close-modal='closeModal'></card>
    </div>

  </div>
</template>
<script>
  import { api, barId } from '../../const'
  import card from '../../components/card'
  import bottomAction from '../../components/bottomAction'

  export default {
    data () {
      return {
        currentData: [],
        t: 0,
        bottomActionVisible: false,
        deletedPostId: 0,
        type: '',
        otherUserId: 0
      }
    },
    components: {
      card,
      bottomAction
    },
    onLoad (options) {
      this.type = options.type
      console.log('type=' + this.type)
      this.t = wx.getStorageSync('t')
      this.otherUserId = options.otherUserId
      this.loadData()

    },
    methods: {
      loadData () {
        var that = this
        // from 最近话题 最近回复
        switch (that.type) {
          case 'topic':
            this.getRecentlyPost()
            wx.setNavigationBarTitle({
              title: '最近话题'
            })
            break
          case 'reply':
            this.recentlyReplyList()
            wx.setNavigationBarTitle({
              title: '最近回复'
            })
            break
          case 'otherUserTopic':
            this.getOtherUserPostList()
            wx.setNavigationBarTitle({
              title: '最近回复'
            })
            break

        }
      }
      ,
      // closeModal: function () {
      //   this.bottomActionVisible = false
      // },
      // showActionModal: function (data) {
      //   this.bottomActionVisible = true
      //   this.deletedPostId = data
      //
      // },
      reloadCardList () {
        this.loadData()
      }
      ,
      async getRecentlyPost () {
        const res = await
          this.$http.get(`${api}`, {
            act: 'post.recentlyPostList',
            t: this.t,
            barId: `${barId}`,
            pageNum: 0,
            size: 10
          })
        if (res.data.code == null) {
          this.currentData = res.data.list
        }
      },

      async getOtherUserPostList () {
        const res = await
          this.$http.get(`${api}`, {
            act: 'post.recentlyOtherUserPostList',
            t: this.t,
            barId: `${barId}`,
            otherUserId:this.otherUserId,
            pageNum: 0,
            size: 10
          })
        if (res.data.code == null) {
          this.currentData = res.data.list
        }
      }
      ,
      async recentlyReplyList () {
        const res = await
          this.$http.get(`${api}`, {
            act: 'post.recentlyReplyList',
            t: this.t,
            barId: `${barId}`,
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
