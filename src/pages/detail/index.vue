<template>
  <div class='container'>
    <sendReply v-if='sendVisible' @close-modal='closeModal' @reply-success='replySuccess' :content='content'
               :postId='id' :replyId='replyId' :replyUserName='replyUserName'></sendReply>
    <div>
      <div class='head'>
        <img class='head-img' :src='detailData.userAvatarUrl'
             @click.stop='goAuthorPage'>
        <div class='info'>
          <span>{{detailData.userName}}</span>
          <span class='time'>{{formatCreateAt}}</span>
        </div>
      </div>

      <scroll-view class='body' scroll-y='true' @scroll='onScroll($event)' :scroll-top="top" enable-back-to-top='true'
                   @scrolltolower='getMore'>
        <div class='title'>
          <p class='big'>{{detailData.title}}</p>
        </div>
        <div class='content'>
          {{detailData.content}}
        </div>

        <div class='reply'>
          <div class="reply-title">评论 {{formatReplies.length}}</div>

          <div class='reply-container' v-for='(item,originindex) in formatReplies' :key='item.id' :data-id='item.id'>
            <div class='reply-head'>
              <img class='head-img' :src='item.userAvatarUrl'
                   @click.stop='goAuthorPage'/>
            </div>
            <div class="reply-info">
              <span>{{item.userName}}</span>
              <div class='reply-content'>
                {{item.content}}
              </div>
              <div class="reply-replyList-div" v-if="item.replyList.length!=0">
                <div class="reply-replyList" v-for="(innerItem,innerIndex) in item.replyList" :key='innerItem.replyId'>
                  <div class="reply-replyList-line">

                    <div class="reply-replyList-content">
                      <span class="reply-replyList-name">{{innerItem.userName}}</span>:{{innerItem.lastReplyId!=item.replyId?'回复@'+innerItem.lastReplyUserName+':'+innerItem.content:innerItem.content}}
                    </div>
                  </div>

                </div>
                <div class="reply-replyList-tips" v-if="item.replySize>1"
                     @click.stop="navigateToReply($event)"
                     :data-replyid="item.replyId" :data-postid="id">一共{{item.replySize}}条回复
                </div>
              </div>

              <div class="reply-foot">
                <div class="time">
                  {{formatCreateAt}}
                </div>
                <div class="action">
                  <img class="item"
                       :data-username="item.userName" :data-replyid='item.replyId' @click.stop="showReplyModal($event)"
                       src="../../../static/comment.png"/>
                </div>
              </div>
              <div class="reply-divide"></div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <div class="controller">
      <div class="group1">
        <img class="comment" @click="showReplyModal" src="../../../static/comment.png"/>
        <img class="praise" src="../../../static/praise.png"/>
      </div>
      <div class="">
        <img class="share" src="../../../static/share.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { api } from '../../const'
  import { passTime, debounce } from '../../utils'
  import sendReply from '../../components/sendReply'

  const debounceOnScroll = () => debounce(function (e) {
    this.top = e.target.scrollTop
  })
  export default {
    components: {
      sendReply
    },
    mounted () {
      this.getData()
    },
    computed: {
      formatCreateAt () {
        return passTime(this.detailData.createtime)
      },
      formatReplies () {
        return this.currentReplies.map(_ => {
          return {
            ..._,
            createtime: passTime(_.createtime)
          }
        })
      }
    },

    methods: {
      navigateToReply (e) {
        var replyId = e.currentTarget.dataset.replyid
        var postId = e.currentTarget.dataset.postid

        wx.navigateTo({
          url: `../reply/main?replyId=${replyId}&postId=${postId}`
        })
      },
      onScroll: debounceOnScroll(),
      async getData () {
        const accesstoken = wx.getStorageSync('accesstoken')
        //this.id = wx.getStorageSync("topicid");
        wx.showLoading({
          title: '加载中'
        })
        const res = await this.$http.get(`${api}`, {
          act: 'post.detail',
          postId: this.id
        })
        wx.hideLoading()
        this.detailData = res.data
        const res2 = await this.$http.get(`${api}`, {
          act: 'reply.list',
          pageNum: 0,
          size: 10,
          postId: this.id
        })
        this.currentReplies = res2.data.data

      },
      async collect () {
        const accesstoken = wx.getStorageSync('accesstoken')
        const topic_id = this.id
        if (this.detailData.is_collect) {
          // /topic_collect/de_collect
          const res = await this.$http.post(`${api}/topic_collect/de_collect`, {
            accesstoken,
            topic_id
          })
          if (res.data.success) {
            wx.showToast({
              title: '取消收藏成功',
              icon: 'none',
              duration: 2000
            })
            this.detailData.is_collect = false
          }
        } else {
          //  /topic_collect/collect
          const res = await this.$http.post(`${api}/topic_collect/collect`, {
            accesstoken,
            topic_id
          })
          if (res.data.success) {
            wx.showToast({
              title: '收藏成功',
              icon: 'none',
              duration: 2000
            })
          }
          this.detailData.is_collect = true
        }
      },
      goTop () {
        // console.log(11);
        this.top = 0
      },
      getMore () {
        if (this.remainReplies.length > 0) {
          this.currentReplies.concat(this.remainReplies.splice(0, 10))
        } else {
          wx.showToast({
            title: '无更多数据',
            icon: 'none',
            duration: 2000
          })
        }
      },
      async upOrCancel (e) {
        // / todo 防抖
        // console.log(e);
        const accesstoken = wx.getStorageSync('accesstoken')
        if (accesstoken) {
          try {
            const res = await this.$http.post(
              `${api}/reply/${e.currentTarget.dataset.replyid}/ups`,
              {
                accesstoken
              }
            )
            if (res.data.success) {
              wx.showToast({
                title: '200',
                icon: 'none',
                duration: 2000
              })
              // e.currentTarget.dataset.originindex
              if (res.data.action === 'up') {
                this.currentReplies[e.currentTarget.dataset.originindex].ups.length += 1
              } else {
                this.currentReplies[e.currentTarget.dataset.originindex].ups.length -= 1
              }

              this.currentReplies[e.currentTarget.dataset.originindex].is_uped =
                res.data.action === 'up'
            }

            // this.getData();
          } catch (e) {
            wx.showToast({
              title: e.response.data.error_msg,
              icon: 'none',
              duration: 2000
            })
          }

          //  originindex
        } else {
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
          })
        }
      },
      showReplyModal (e) {
        const userName = e.currentTarget.dataset.username
        const replyId = e.currentTarget.dataset.replyid
        if (userName) {
          this.content = `@${userName}:`
        } else {
          this.content = ''
        }

        this.replyId = replyId
        this.replyUserName = userName
        this.sendVisible = true
      },
      replySuccess () {
        this.closeModal()
        wx.showToast({
          title: '评论成功',
          icon: 'none',
          duration: 1500

        })
        this.getData()
      },
      closeModal () {
        this.sendVisible = false
      }
    }
    ,
    onLoad () {
      this.id = this.$root.$mp.query.postId
      console.log('postId=' + this.id)
    }
    ,
    data () {
      return {
        detailData: {},
        remainReplies: [],
        currentReplies: [],
        content: '',
        sendVisible: false,
        id: '',
        replyId: '',
        top: 0,
        timer: null,
        replyUserName: ''
      }
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    height: 100vh;
    .head {
      background-color: white;
      display: flex;
      align-items: center;
      .head-img {
        border-radius: 45rpx;
        width: 75rpx;
        height: 75rpx;
        margin-left: 20rpx;
      }

      .info {
        flex-direction: column;
        display: flex;
        margin-left: 26rpx;
        .time {
          font-size: $time-font-size;
          color: $borderColor;
        }
      }
    }
    .body {
      .title {
        background-color: white;
        padding-left: 30rpx;
        .big {
          font-size: 50rpx;
        }
      }
      .content {
        white-space: pre-line;
        text-align: justify;
        text-justify: inter-ideograph;
        font-weight: normal;
        padding-left: 30rpx;
        padding-right:30rpx;
        font-size: $content-font-size;
      }

      .reply {
        background-color: white;
        margin-bottom: 20rpx;
        .reply-title {
          font-size: 30rpx;
          margin-bottom: 20rpx;
          margin-left: 25rpx;
          font-weight: lighter;

        }

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
            margin-left: 20rpx;
            margin-bottom: 20rpx;
            margin-right: 50rpx;
            width: 100%;
            & > span {
              /*font-weight: lighter;*/
              /*color: rgb(245, 245, 239);*/
              font-size: $reply-content-font-size;
            }
            .reply-content {
              width: 100%;
              white-space: pre-line;
              text-align: justify;
              text-justify: inter-ideograph;
              font-weight: normal;
              font-size: $content-font-size;
            }
            .reply-foot {
              display: flex;
              justify-content: space-between;
              font-size: 25rpx;
              /*font-weight: lighter;*/
              margin-right: 50rpx;
              .time {
                color: gray;
              }
              .action {
                .item {
                  height: 50rpx;
                  width: 50rpx;
                  margin-left: 50rpx;
                }
              }
            }
            .reply-divide {
              border-bottom: 1px solid #ccc;
              margin-bottom: 20rpx;
              margin-top: 20rpx;
              margin-right: 20rpx;
            }

            .reply-replyList-div {
              background-color: rgb(245, 245, 239);
              font-size: $reply-content-font-size;
              padding: 15rpx;
              .reply-replyList {
                .reply-replyList-line {
                  display: flex;
                  flex-direction: row;
                  .reply-replyList-name {
                    color: dodgerblue;
                  }
                  .reply-replyList-content {
                    width: 100%;
                    white-space: pre-line;
                    text-align: justify;
                    text-justify: inter-ideograph;
                    font-size: $reply-content-font-size;
                    /*font-weight: lighter;*/
                  }

                }
              }
              .reply-replyList-tips {
                display: flex;
                color: dodgerblue;
              }
            }
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

  .controller {
    border-top: 1px solid #ccc;
    height: 100rpx;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    justify-content: space-between;
    .group1 {
      display: flex;
      margin-right: 20rpx;
      .comment {
        height: 50rpx;
        width: 50rpx;
        margin: 25rpx;
      }
      .praise {
        height: 50rpx;
        width: 50rpx;
        margin: 25rpx;
      }

    }
    .share {
      margin: 25rpx;
      height: 50rpx;
      width: 50rpx;
    }
  }
</style>
