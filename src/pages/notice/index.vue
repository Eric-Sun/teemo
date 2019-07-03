<template>
  <div class='container'>
    <login :visible='loginVisible' v-on:modalClose='closeModalEvent'></login>

    <div>
      <div class='notice' v-for='item in formatNoticeList' :key='item.id' :data-id='item.id'>
        <div v-if="item.type!=2" class="other-notice">
          <div class='head'>
            <div class="head-left">
              <img class='head-img' :src='item.fromUserAvatarImgUrl'
                   @click.stop='goAuthorPage'>
              <div class='info'>
                <span class="name">{{item.fromUserNickName}}</span>

                <span class='time'>{{item.createtime}}</span>
              </div>
            </div>
            <div v-if="item.status==0" class="head-right">
              新
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
        <div v-if="item.type==2">
          <card :item='item.content' :hidden="true" :new_notice="item.status"></card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import card from '@/components/card'
  import {api} from '../../const'
  import {passTime} from '../../utils/index'
  import {checkT} from '../../utils/net'
  import login from '../../components/login'

  export default {
    components: {
      login,
      card
    },
    data() {
      return {
        t: 0,
        noticeList: [],
        loginVisible: false
      }
    },
    computed: {
      formatNoticeList() {
        return this.noticeList.map(_ => {
          return {
            ..._,
            createtime: passTime(_.createtime)
          }
        })
      }
    },
    onShow() {
      var that = this;
      var t = wx.getStorageSync("t")
      checkT(t,
        function () {
          that.loginVisible = true
        },
        function () {
          that.t = wx.getStorageSync('t')
          that.getData()
          that.readAllNotices()
        }
      );

    },
    methods: {
      async readAllNotices() {
        const res = await
          this.$http.get(`${api}`, {
            t: this.t,
            act: 'notice.readAll'
          })
        if (res.data.code == null) {
          wx.removeTabBarBadge({
            index: 2
          })
        }
      },
      goPostDetail(e) {
        const postId = e.currentTarget.dataset.postid
        wx.navigateTo({
          url: `../detail/main?postId=` + postId
        })
      }
      ,
      goDetail(e) {
        wx.navigateTo({
          url: `../detail/main?topicid=${e.target.dataset.topicid}`
        })
      }
      ,
      async getData() {
        var that = this
        const res = await
          this.$http.get(`${api}`, {
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
      /*padding: 30rpx;*/
      .other-notice {
        padding: 30rpx;

        .head {
          color: black;
          display: flex;
          /*align-items: center;*/
          justify-content: space-between;

          .head-left {

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
          }

          .head-right {
            font-size: 35rpx;
            color: red;
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
          margin-top: 10rpx;
          font-size: $content-font-size;

          .reply-content {
            margin: 10rpx;
          }

          .replied-content {
            padding-left: 10rpx;
            padding-right: 10rpx;
            padding-bottom: 10rpx;
            background-color: rgb(245, 245, 249);
          }

          .post {
            background-color: rgb(245, 245, 249);
            display: flex;
            flex-direction: row;
            padding: 0rpx 10rpx 10rpx 10rpx;

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
    }
  }

  .selected {
    color: $color;
    border-bottom: 2rpx solid $color;
  }
</style>

