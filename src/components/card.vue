<template>
  <div class='container' @click.stop="goDetail($event)">
    <div class='head'>
      <img class='head-img' :src='item.userAvatarUrl'
           @click.stop='goAuthorPage' :data-userid="item.userId">
      <div class='info'>
        <span class="name">{{item.userName}}</span>
        <span class='time'>{{formatCreateAt}}</span>
      </div>
      <span class="top" v-if="item.top">置顶</span>
    </div>
    <div class='body'>
      <pre>{{formatContent}}</pre>
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
      },
      formatContent () {
        // var reg = new RegExp('\n\n', 'g')
        // console.log( this.item.content.replace(reg,`<br>`))
        // return this.item.content.replace(reg,`<br>`)
        return this.item.content
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
      color: black;
      display: flex;
      align-items: center;
      .head-img {
        border-radius: 45rpx;
        width: 75rpx;
        height: 75rpx;
      }

      .info {
        flex-direction: column;
        display: flex;
        margin-left: 26rpx;
        .name {
          font-weight: bold;
          font-size: $userName-font-size;
        }
        .time {
          font-size: $time-font-size;
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
      margin-left: 10rpx;
      & > pre {
        white-space: pre-line;
        text-align: justify;
        text-justify: inter-ideograph;
        font-weight: normal;
        font-size: $content-font-size;
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
