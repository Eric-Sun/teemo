<template>
  <div class="container">
    <login :visible='visible' v-on:modalClose='closeModalEvent'></login>
    <authorHead :user='user'></authorHead>
    <div class='list'>
      <!--<navigator class='list-item' @click.stop='setListFrom' url='/pages/list/main?type=collect' data-item='collect'>我的收藏</navigator>-->
      <navigator class='list-item' @click.stop='setListFrom' url='/pages/list/main?type=topic' data-item='topic'>最近话题</navigator>
      <!--<navigator class='list-item' @click.stop='setListFrom' url='/pages/list/main?type=reply' data-item='reply'>最近回复</navigator>-->
    </div>
  </div>
</template>

<script>
  import { getURL } from '../../utils/index'
  import authorHead from '../../components/authorHead'
  import login from '../../components/login'
  import { api } from '../../const'

  export default {
    data () {
      return {
        visible: false,
        user: {}
      }
    },
    components: {
      authorHead,
      login
    },
    methods: {
      setListFrom (e) {
        // e.target.dataset.item
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
    mounted () {
      var that = this
      var t = wx.getStorageSync('t')
      this.$http.get(`${api}`,
        {
          act: 'user.checkToken',
          t: t
        }).then(function (res) {
        if (res.data.result == 1) {
          that.visible = true;
        } else {
          that.getData()
        }

      })
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
        border-top: 2rpx solid $borderColor;
      }
      .margin {
        margin-top: 30rpx;
      }
    }
  }
</style>
