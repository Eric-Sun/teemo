<template>
  <div class="container">
    <login :visible='loginVisible' v-on:modalClose='closeModalEvent'></login>
    <authorHead :user='user'></authorHead>
    <div class='list'>
      <!--<navigator class='list-item' @click.stop='setListFrom' url='/pages/list/main?type=collect' data-item='collect'>我的收藏</navigator>-->
      <navigator class='list-item' @click.stop='setListFrom' url='/pages/list/main?type=topic' data-item='topic'>最近话题</navigator>
      <navigator class='list-item' url='/pages/collection/main' >我的收藏</navigator>
    </div>
  </div>
</template>

<script>
  import authorHead from '../../components/authorHead'
  import { api } from '../../const'
  import {checkT} from '../../utils/net'
  import login from '../../components/login'
  
  export default {
    data () {
      return {
        loginVisible: false,
        user: {}
      }
    },
    components: {
      authorHead,
      login
    },
    methods: {
      setListFrom (e) {
        wx.setStorageSync('fromItem', e.target.dataset.item)
      },
      closeModalEvent () {
        this.visible = false
        this.getData()
      },
      async getData () {
        const t = wx.getStorageSync('t')
        const res = await this.$http.get(`${api}`,
          {
            act: 'user.info',
            t: t
          })
        if (res.data.code == null) {
          this.user = res.data
        }
      }
    },
    onShow () {
      var that = this
      var t = wx.getStorageSync("t")
      checkT(t,
        function () {
          that.loginVisible = true
        },
        function () {
          that.getData()
        }
      );
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    height: 100vh;
    background-color: rgb(245, 245, 249);
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
        border-top: 1rpx solid $borderColor;
      }
      .margin {
        margin-top: 30rpx;
      }
    }
  }
</style>
