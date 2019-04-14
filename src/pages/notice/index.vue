<template>
  <div class='container'>
    <div>
      <button class='read-all' @click.stop='readAll'>一键已读</button>
      <div class='notice' v-for='item in formatNoticeList' :key='item.id' :data-id='item.id'>
        <div class='head'>
          <img class='head-img' :src='item.fromUserAvatarImgUrl'
               @click.stop='goAuthorPage'>
          <div class='info'>
            <span class="name">{{item.fromUserNickName}}</span>

            <span class='time'>{{item.createtime}}</span>
          </div>
        </div>
        <div class="body" @click.stop="goPostDetail($event)" :data-postid="item.content.postId">
          <div class="reply-content" v-if="item.type==0">{{item.replyContent}}</div>
          <div class="reply-content" v-if="item.type==1">
            回复{{item.content.targetReplyUserNickName}}:{{item.replyContent}}
          </div>
          <div class="replied-content" v-if="item.type==1">
            {{item.content.targetReplyRepliedUserId!=0?'回复@'+item.content.targetReplyRepliedUserNickName+':':''}}
            {{item.content.targetReplyContent}}
          </div>
          <div class="post">
            <img class='post-img' :src='item.content.postUserAvatarImgUrl'>
            <div class="post-info">
              <div class="post-username">
                {{item.content.postUserNickName}}
              </div>
              <div class="post-title">
                {{item.content.postTitle}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { api } from '../../const'
  import { passTime } from '../../utils/index'

  export default {
    components: {},
    data () {
      return {
        t: 0,
        noticeList: []
      }
    },
    computed: {
      formatNoticeList () {
        return this.noticeList.map(_ => {
          return {
            ..._,
            createtime: passTime(_.createtime)
          }
        })
      }
    },
    onShow () {
      this.t = wx.getStorageSync('t')
      this.getData()
    },
    methods: {
      goPostDetail (e) {
        const postId = e.currentTarget.dataset.postid
        wx.navigateTo({
          url: `../detail/main?postId=` + postId
      })
      },
      async readAll () {
        const accesstoken = wx.getStorageSync('accesstoken')
        const res = await this.$http.post(`${api}/message/mark_all`, {
          accesstoken
        })
        if (res.data.success) {
          wx.showToast({
            title: '全部已读成功',
            icon: 'none',
            duration: 2000
          })
        }
      },
      goDetail (e) {
        wx.navigateTo({
          url: `../detail/main?topicid=${e.target.dataset.topicid}`
        })
      },
      async getData () {
        var that = this
        const res = await this.$http.get(`${api}`, {
          act: 'notice.list',
          t: this.t,
          pageNum: 0,
          size: 10
        })
        if (res.data.code == null) {
          console.log(res.data.list)
          that.noticeList = res.data.list
        } else {

        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    background-color: rgb(245, 245, 249);
    width: 100vw;
    .notice {
      background-color: white;
      margin-bottom: 20rpx;
      padding: 30rpx;
      .head {
        color: black;
        display: flex;
        /*align-items: center;*/
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
          .ellipsis {
            width: 50rpx;
            height: 75rpx;
          }
        }
      }
      .body {
        display: flex;
        flex-direction: column;
        margin-top: 20rpx;
        .reply-content {

        }
        .replied-content {
          background-color: rgb(245, 245, 249);
        }
        .post {
          background-color: rgb(245, 245, 249);
          display: flex;
          flex-direction: row;
          .post-img {
            width: 90rpx;
            height: 90rpx;
          }
          .post-info {
            display: flex;
            flex-direction: column;
            margin-left: 20rpx;
            .post-username {
              font-size: 35rpx;

            }
            .post-title {
              font-size: 35rpx;

            }
          }
        }
      }
    }
    .read-all {
      color: $color;
      border: 2rpx solid $color;
      font-size: 20rpx;
      width: 99rpx;
      border-radius: 20rpx;
      height: 46rpx;
      line-height: 46rpx;
      text-align: center;
      padding: 0;
      margin: 10rpx;
    }
  }

  .selected {
    color: $color;
    border-bottom: 2rpx solid $color;
  }
</style>

