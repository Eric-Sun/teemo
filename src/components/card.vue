<template>
  <div class='container' @click.stop="goDetail($event)">
    <div class='head'>
      <img class='head-img' :src='item.userAvatarUrl'
           @click.stop='goAuthorPage' :data-userid="item.userId">
      <div class='info'>
        <span>{{item.userName}}</span>
        <span class='time'>{{formatCreateAt}}</span>
      </div>
      <span class="top" v-if="item.top">置顶</span>
    </div>
    <div class='body'>
      <p>{{item.content}}</p>
    </div>
    <div class='foot' v-if='!hidden'>
      <img class="reply-img" @click="showReplyModal" src="../../static/comment.png"/>
      <div class="reply-count">{{item.replyCount}}</div>
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
        return passTime(this.item.createtime)
      },
      formatCreateAt () {
        return passTime(this.item.createtime)
      }
    },
    methods: {
      goAuthorPage (e) {
        // e.currentTarget.dataset.author
        wx.navigateTo({
          url: `../user/main?userId=${e.currentTarget.dataset.userid}`
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
    /*height: 330rpx;*/
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .head {
      color: $color;
      display: flex;
      align-items: center;
      .head-img {
        border-radius: 45rpx;
        width: 64rpx;
        height: 64rpx;
      }

      .info {
        flex-direction: column;
        display: flex;
        margin-left: 26rpx;
        .time {
          font-size: 10px;
          color: $borderColor;
        }
      }
      .top {
        position: absolute;
        right: 40rpx;
        color: red;
      }
    }
    .body {
      // color: $color;
      margin-top: 10rpx;
      margin-bottom: 20rpx;
      & > p {
        /*font-weight: bold;*/
        font-size: 40rpx;
      }
    }
    .foot {
      display: flex;
      flex-direction: row;
      .reply-img {
        margin-left: 20rpx;
        height: 35rpx;
        width: 35rpx;

      }
      .reply-count {
        margin-left: 10rpx;
        height: 35rpx;
        font-weight: 100;
      }
    }
  }
</style>
