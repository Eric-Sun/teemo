<template>
  <div class='container' @click.stop="goDetail($event)">
    <div class='head'>
      <img class='head-img' :src='item.userAvatarUrl'
           @click.stop='goAuthorPage'>
      <div class='info'>
        <span>{{item.userName}}</span>
        <span class='time'>{{item.createtime}}</span>
      </div>
      <span class="top" v-if="item.top">置顶</span>
    </div>
    <div class='body'>
      <p>{{item.content}}</p>
    </div>
    <div class='foot'>
      <div class='count' v-if='!hidden'>
        <span class='number'>回答</span>
        <span class='number'>浏览</span>
      </div>
      <div class='later'>
        <span class='number'>最新动态</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { passTime } from '../utils/index'

  export default {
    props: {
      item: Object,
      hidden: {
        // 个人中心展示帖子隐藏一部分东西的复用
        default: false,
        type: Boolean
      }
    },
    computed: {
      formatLastReply () {
        return passTime(this.item.last_reply_at)
      },
      formatCreateAt () {
        return passTime(this.item.create_at)
      }
    },
    methods: {
      goAuthorPage (e) {
        // e.currentTarget.dataset.author
        wx.navigateTo({
          url: `../user/main?loginname=${e.currentTarget.dataset.loginname}`
        })
      },
      goDetail () {
        wx.navigateTo({
          url: `../detail/main?postId=${this.item.postId}`
        })
      }
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    height: 330 rpx;
    padding: 30 rpx;
    margin-bottom: 20 rpx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .head {
      color: $color;
      display: flex;
      align-items: center;
      .head-img {

        width: 64rpx;
        height: 64rpx ;
      }

      .info {
        flex-direction: column;
        display: flex;
        margin-left: 26 rpx;
        .time {
          color: $borderColor;
        }
      }
      .top {
        position: absolute;
        right: 40 rpx;
        color: red;
      }
    }
    .body {
      color: $color;
      & > p {
        font-weight: bold;
      }
    }
    .foot {
      display: flex;
      justify-content: space-between;
      .number {
        color: $borderColor;
        font-size: 26 rpx;
        & + & {
          margin-left: 20 rpx;
        }
      }
    }
  }
</style>
