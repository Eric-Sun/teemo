<template>
  <div class='container'>
    <login :visible='loginVisible' v-on:modalClose='closeModalEvent'></login>
    <sendReply v-if='sendVisible' @close-modal='closeModal' @reply-success='replySuccess' :content='content'
               :postId='postId' :replyId='replyId' :postAnonymous='postAnonymous'
               :isPostUserId='isPostUserId' :replyUserName='replyUserName'></sendReply>
    <div>
      <scroll-view scroll-y='true' @scroll='onScroll($event)' :scroll-top="top" enable-back-to-top='true'
                   @scrolltolower='getMore'>
        <div class='head'>
          <img v-if="postAnonymous==0" class='head-img' :src='reply.userAvatarUrl'
               @click.stop='goAuthorPage'>
          <img v-if="postAnonymous==1" class='head-img' :src='reply.userAvatarUrl'>
          <div class='info'>
            <div class="name">{{reply.userName}}</div>
            <div class='content'>
              {{reply.content}}
            </div>

          </div>
        </div>

        <div class="body">
          <div class='reply'>
            <div class='reply-container-with-divide' v-for='(item,originindex) in reply.replyList' :key='item.id'
                 :data-id='item.id'>
              <div class="reply-container">
                <div class='reply-head'>
                  <img v-if="postAnonymous==0" class='head-img' :src='item.userAvatarUrl'
                       @click.stop='goAuthorPage'/>
                  <img v-if="postAnonymous==1" class='head-img' :src='item.userAvatarUrl'
                  />
                </div>
                <div class="reply-info">
                  <span>{{item.userName}}</span>
                  <div class='reply-content'>
                    {{item.lastReplyId!=reply.replyId?
                    '回复@'+item.lastReplyUserName+':'+item.content:item.content}}
                  </div>
                  <div v-if="item.imgList.length!=0">
                    <img class="reply-imgList" :src="item.imgList[0].url">
                  </div>
                  <div class="reply-foot">
                    <!--                    <div class="time">-->
                    <!--                      {{formatCreateAt}}-->
                    <!--                    </div>-->
                    <div class="action">
                      <img class="item"
                           :data-username="item.userName" :data-replyid='item.replyId'
                           @click.stop="showReplyModal($event)"
                           src="../../../static/comment.png"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="reply-divide"></div>
            </div>
          </div>
        </div>

      </scroll-view>
    </div>
  </div>
</template>

<script>
  import {api} from '../../const'
  import {passTime, debounce} from '../../utils'
  import sendReply from '../../components/sendReply'
  import {checkT} from '../../utils/net'
  import login from '../../components/login'


  const debounceOnScroll = () => debounce(function (e) {
    this.top = e.target.scrollTop
  })
  export default {
    components: {
      sendReply,
      login
    },
    mounted() {
      this.getData()
    },
    computed: {
      formatCreateAt() {
        return passTime(this.reply.createtime)
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
        });
    },

    methods: {
      onScroll: debounceOnScroll(),
      async getData() {
        const t = wx.getStorageSync('t')
        wx.showLoading({
          title: '加载中'
        })
        const res = await this.$http.get(`${api}`, {
          t: t,
          act: 'reply.detail',
          replyId: this.currentReplyId,
          size: 5,
          pageNum: 0
        })
        wx.hideLoading()
        console.log(res.data)
        this.reply = res.data

      },

      goTop() {
        // console.log(11);
        this.top = 0
      },
      getMore() {
        // if (this.remainReplies.length > 0) {
        //   this.currentReplies.concat(this.remainReplies.splice(0, 10))
        // } else {
        //   wx.showToast({
        //     title: '无更多数据',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
      },
      showReplyModal(e) {
        var userId = wx.getStorageSync('userId')

        const userName = e.currentTarget.dataset.username
        const replyId = e.currentTarget.dataset.replyid
        if (userName) {
          this.content = `@${userName}:`
        } else {
          this.content = ''
        }
        if (userId == this.postUserId) {
          this.isPostUserId = true
        }
        this.replyId = replyId
        this.replyUserName = userName
        this.sendVisible = true
      },
      replySuccess() {
        this.closeModal()
        wx.showToast({
          title: '评论成功',
          icon: 'none',
          duration: 1500

        })
        this.getData()
      },
      closeModal() {
        this.sendVisible = false
      }
    }
    ,
    onLoad() {
      this.currentReplyId = this.$root.$mp.query.replyId
      this.postId = this.$root.$mp.query.postId
      this.postAnonymous = this.$root.$mp.query.anonymous
      this.postUserId = this.$root.$mp.query.postUserId
      console.log("postUserId=" + this.postUserId)
      console.log("postAnonymous=" + this.postAnonymous)
    }
    ,
    data() {
      return {
        reply: {},
        sendVisible: false,
        replyId: 0,
        top: 0,
        currentReplyId: 0,
        postId: 0,
        postAnonymous: 0,
        postUserId: 0,
        isPostUserId: false,
        loginVisible: false
      }
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    /*height: 100vh;*/
    height: 90vh;
    width: 100vw;
    background-color: rgb(245, 245, 239);

    .head {
      background-color: white;
      display: flex;
      padding-left: 10rpx;
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
          font-size: $userName-font-size;
        }

        .content {
          white-space: pre-line;
          text-align: justify;
          text-justify: inter-ideograph;
          margin-bottom: 20rpx;
          margin-right: 25rpx;
          width: 590rpx;
          font-size: $content-font-size;
        }
      }

    }

    .body {
      padding: 15rpx;
      background-color: rgb(245, 245, 239);

      .title {
        /*background-color: white;*/
        padding-left: 30rpx;

        .big {
          font-size: 50rpx;
        }
      }

      .reply {
        background-color: white;

        .reply-title {
          font-size: 25rpx;
          margin-bottom: 20rpx;
          margin-left: 25rpx;
          font-weight: lighter;

        }

        .reply-container-with-divide {
          display: flex;
          flex-direction: column;

          .reply-container {
            display: flex;

            .reply-head {
              margin-left: 25rpx;

              .head-img {
                border-radius: 45rpx;
                width: 75rpx;
                height: 75rpx;
              }
            }

            .reply-info {
              display: flex;
              flex-direction: column;
              margin-top: 10rpx;
              margin-left: 20rpx;
              margin-right: 50rpx;
              width: 100%;


              & > span {
                /*font-weight: lighter;*/
                /*color: gray;*/
                font-size: $reply-content-font-size;
              }

              .reply-content {
                width: 100%;
                /*white-space: pre-line;*/
                text-align: justify;
                text-justify: inter-ideograph;
                /*font-weight: 200;*/
                font-size: $reply-content-font-size;

              }

              .reply-imgList {
                width: 180rpx;
                height: 180rpx;
              }

              .reply-foot {
                display: flex;
                justify-content: space-between;
                font-size: 30rpx;
                font-weight: lighter;
                margin-right: 50rpx;

                .time {
                  font-size: 25rpx;
                  color: gray;
                }

                .action {
                  .item {
                    height: 30rpx;
                    width: 30rpx;
                    /*margin-left: 50rpx;*/
                  }
                }
              }

            }

          }

          .reply-divide {
            border-bottom: 1px solid #ccc;
            margin-bottom: 10rpx;
            margin-top: 10rpx;
            margin-right: 20rpx;
          }
        }

      }

      .reply-buton {
        border-radius: 50%;
        width: 100rpx;
        height: 100rpx;
        text-align: center;
        font-size: 30rpx;
        position: fixed;
        line-height: 100rpx;
        background-color: $color;
        top: 86vh;
        left: 81vw;
        color: white;
      }

      .up-png {
        width: 100rpx;
        top: 75vh;
        left: 81vw;
        position: fixed;
      }

    }

  }


</style>
