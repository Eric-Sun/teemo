<template>
  <div class='container'>
    <authorHead :user='user'></authorHead>
    <div class='body'>
      <div class='list'>
        <!--<div :class='{selected:tab==="reply"}' @click.stop='changeTab($event)' data-tab='reply'>最近回复</div>-->
        <!--<div :class='{selected:tab==="topics"}' @click.stop='changeTab($event)' data-tab='topics'>最近主题</div>-->
        <div class='list-item' @click.stop='setListFrom($event)'>
          最近话题
        </div>
      </div>
      <div>
        <div v-for='item in currentData' :key='item.id' :data-id='item.id'>
          <card :item='item' :hidden='true'></card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import authorHead from '../../components/authorHead'
  import { api } from '../../const'
  import card from '../../components/card'

  export default {
    components: {
      card,
      authorHead
    },
    data () {
      return {
        user: {},
        reply: [],
        topics: [],
        tab: 'reply',
        otherUserId: 0,
        type:''
      }
    },
    onLoad (options) {
      this.otherUserId = options.otherUserId
    },
    computed: {
      currentData () {
        return this.tab === 'reply' ? this.reply : this.topics
      }
    },
    mounted () {
      this.userId = this.$root.$mp.query.userId
      this.getData()
    },
    methods: {
      setListFrom (e) {
        this.type= 'otherUserTopic';
        // /pages/list/main?type=otherUserTopic
        wx.navigateTo({
          url: `../list/main?otherUserId=${this.otherUserId}&type=${this.type}`
        })
      },

      changeTab (e) {
        this.tab = e.target.dataset.tab
      },
      async getData () {

        const t = wx.getStorageSync('t')
        const res = await this.$http.get(`${api}`,
          {
            act: 'user.otherUserInfo',
            userId: this.otherUserId,
            t: t
          })
        if (res.data.code == null) {
          console.log(JSON.stringify(res.data))
          this.user = res.data
        }
        // const loginname = this.$root.$mp.query.loginname
        // if (loginname) {
        //   const res = await this.$http.get(`${api}/user/${loginname}`)
        //   if (res.data.success) {
        //     this.user = res.data.data
        //     this.reply = res.data.data.recent_replies
        //     this.topics = res.data.data.recent_topics
        //   }
        // }
      }
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    background-color: rgb(245, 245, 249);
    .body {
      display: flex;
      flex-direction: column;
      .list {
        margin-top: 30rpx;
        background-color: white;
        .list-item {
          height: 76rpx;
          line-height: 76rpx;
          margin: 0 30rpx;
          padding: 10rpx 0;
        }
        .list-item + .list-item {
          border-top: 2rpx solid $borderColor;
        }
        .margin {
          margin-top: 30rpx;
        }
      }
    }
  }
</style>

