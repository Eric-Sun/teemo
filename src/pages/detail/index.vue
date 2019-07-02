<template>
  <div class='container'>
    <img v-if="isShare==1" @click.stop='backHome' class='d-back-home'
         src='http://cdn.xcx.pemarket.com.cn/icon-Return%20to%20the%20home%20page.png'>

    <login :visible='loginVisible' v-on:modalClose='closeModalEvent'></login>
    <sendReply v-if='sendVisible' @close-modal='closeModal' @reply-success='replySuccess' :content='content'
               :postId='id' :replyId='replyId' :isPostUserId='isPostUserId'
               :postAnonymous='postAnonymous' :replyUserName='replyUserName'></sendReply>
    <div>
      <div class='head'>
        <img v-if="detailData.anonymous==0" class='head-img' :src='detailData.userAvatarUrl'
             @click.stop='goAuthorPage'>
        <img v-if="detailData.anonymous==1" class='head-img' :src='detailData.userAvatarUrl'
        >
        <div class='info'>
          <span>{{detailData.userName}}</span>
        </div>
      </div>

      <scroll-view class='body' scroll-y @scroll='onScroll($event)' :scroll-top="cursor" enable-back-to-top='true'>
        <div class='title'>
          <p class='big'>{{detailData.title}}</p>
        </div>
        <div v-if="includePostContent==1" class='content'>{{detailData.content}}</div>
        <div v-if="includePostContent==1" class="imgs" v-for="(img,imgIndex) in detailData.imgList">
          <img class="img" :src="img.url" @click.stop="previewImg(imgIndex)">
        </div>

        <div class='reply'>
          <div class="reply-title">
            <div class="reply-length">评论 {{formatReplies.length}}</div>
          </div>

          <div class='reply-container' v-for='(item,originIndex) in formatReplies' :key='item.id' :data-id='item.id'>
            <div class='reply-head'>
              <img v-if="detailData.anonymous==0" class='head-img' :src='item.userAvatarUrl'
                   @click.stop='goAuthorPage'/>
              <img v-if="detailData.anonymous==1" class='head-img' :src='item.userAvatarUrl'
              />
            </div>
            <div class="reply-info">
              <div class="reply-info-user-info">
                <div class="reply-info-user-info-fullname">
                  <span>{{item.userName}} </span>
                  <span v-if="item.userId==detailData.userId" class="reply-info-user-info-fullname-louzhu">楼主</span>
                </div>
                <span class="reply-info-user-info-loushu">{{(pageNum * reply_size_per_page) + 1 + originIndex}}楼</span>
              </div>
              <div class='reply-content'>{{item.content}}</div>
              <div v-if="item.imgList.length!=0">
                <img class='reply-imgList' :src="item.imgList[0].url">
              </div>
              <div class="reply-replyList-div"
                   @click.stop="navigateToReply"
                   :data-replyid="item.replyId"
                   :data-postid="id"
                   :data-anonymous="detailData.anonymous"
                   v-if="item.replyList.length!=0">
                <div class="reply-replyList" v-for="(innerItem,innerIndex) in item.replyList" :key='innerItem.replyId'>
                  <div class="reply-replyList-line">

                    <div class="reply-replyList-content">
                      <span class="reply-replyList-name">{{innerItem.userName}}</span>
                      <span v-if="innerItem.userId==detailData.userId"
                            class="reply-info-user-info-fullname-louzhu">楼主</span>

                      <span>:{{innerItem.lastReplyId!=item.replyId?
                      '回复@'+innerItem.lastReplyUserName
                      +':'+innerItem.content:innerItem.content}}</span>
                    </div>
                  </div>

                </div>
                <div class="reply-replyList-tips" v-if="item.replySize>1"
                     @click.stop="navigateToReply($event)"
                     :data-replyid="item.replyId"
                     :data-postid="id"
                     :data-anonymous="detailData.anonymous">一共{{item.replySize}}条回复
                </div>
              </div>
              <!--              <img class='up-png' src="/static/go-bottom.png" mode='widthFix' @click.stop="goBottom">-->

              <div class="reply-foot">
                <div class="action">
                  <img class="item"
                       :data-username="item.userName"
                       :data-replyid='item.replyId'
                       :data-anonymous="detailData.anonymous"
                       @click.stop="showReplyModal($event)"
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
      <div class="pagination">
        <div>
          <img class="left-arrow" src="../../../static/left-arrow.png" @click.stop="backPage()"/>
        </div>
        <div class="pagination-info">{{pageNum+1}}/{{culculatePageNum}}页</div>
        <div>
          <img class="right-arrow" src="../../../static/right-arrow.png" @click.stop="goPage()"/>
        </div>
      </div>
      <div class="actions">
        <img class="comment" @click="showReplyModal" src="../../../static/comment.png"/>
        <img v-if="detailData.isCollection==0" class="praise" @click="doOrUndoCollect" src="../../../static/pre-collection.jpg"/>
        <img v-if="detailData.isCollection==1" class="praise" @click="doOrUndoCollect" src="../../../static/collectioned.png"/>

        <img class="share" src="../../../static/share.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  import login from '../../components/login'
  import {api, reply_size_per_page} from '../../const'
  import {passTime, debounce} from '../../utils'
  import sendReply from '../../components/sendReply'
  import {checkT} from '../../utils/net'


  const debounceOnScroll = () => debounce(function (e) {
    this.cursor = e.target.scrollTop
  })
  export default {
    components: {
      sendReply,
      login
    },
    onUnload() {
      this.$http.get(`${api}`, {
        act: 'post.updateCursor',
        postId: this.id,
        pageNum: this.pageNum,
        t: this.t,
        cursor: this.cursor
      })
    },
    mounted() {

      var t = wx.getStorageSync("t")
      checkT(t,
        function () {
          that.loginVisible = true
        },
        function () {
        }
      );
      this.t = wx.getStorageSync("t")
      this.getPostData()
      this.getReplyData(-1)
    },
    computed: {
      culculatePageNum() {
        return Math.floor(this.level1ReplySize / reply_size_per_page) + 1;
      },
      formatCreateAt() {
        return passTime(this.detailData.createtime)
      },
      formatReplies() {
        return this.currentReplies.map(_ => {
          return {
            ..._,
            createtime: passTime(_.createtime)
          }
        })
      },
      culBuildingIndex() {
        return function (originIndex) {
          return;
        }
      }
    },
    onShareAppMessage: function () {
      return {
        title: this.detailData.title,//分享内容
        path: '/pages/detail/main?postId=' + this.id + "&share=1" //分享地址
        // imageUrl: '/images/img_share.png',//分享图片
      }

    },
    methods: {
      // 点击左箭头，往前退一个页面
      backPage() {
        if (this.pageNum == 0) {
          return;
        } else if (this.pageNum == 1) {
          this.pageNum = this.pageNum - 1
          this.includePostContent = 1;
          this.getReplyData(this.pageNum);
        } else {
          this.pageNum = this.pageNum - 1
          this.getReplyData(this.pageNum);
        }
      },
      // 点击右箭头，往前进一个页面
      goPage() {
        if (this.pageNum == this.culculatePageNum) {
          return;
        } else if (this.pageNum == 0) {
          this.includePostContent = 0;
        }
        this.pageNum++;
        this.getReplyData(this.pageNum);
      },
      async doOrUndoCollect() {
        if (this.detailData.isCollection == 1) {
          const res2 = await this.$http.get(`${api}`, {
            act: "collection.post.delete",
            t: this.t,
            postId: this.id
          })
          if (res2.data.code == 30003) {
            wx.showToast({
              title: '已经取消收藏了',
              icon: 'none',
              duration: 2000
            })
          } else {
            if (res2.data.code != null) {
              wx.showToast({
                title: '服务正在失去联系，请稍后',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '取消收藏成功',
                icon: 'none',
                duration: 2000
              })
              this.detailData.isCollection = 0;
            }
          }
        } else {
          const res2 = await this.$http.get(`${api}`, {
            act: "collection.post.add",
            t: this.t,
            postId: this.id
          })
          if (res2.data.code == 30002) {
            wx.showToast({
              title: '已经收藏了',
              icon: 'none',
              duration: 2000
            })
          } else {
            if (res2.data.code != null) {
              wx.showToast({
                title: '服务正在失去联系，请稍后',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '收藏成功',
                icon: 'none',
                duration: 2000
              })
              this.detailData.isCollection = 1;
            }
          }
        }


      },
      previewImg(index) {
        const urlList = []
        for (var i = 0; i < this.detailData.imgList.length; i++) {
          urlList.push(this.detailData.imgList[i].url);
        }
        wx.previewImage({
          current: this.detailData.imgList[index].url, // 当前显示图片的http链接
          urls: urlList // 需要预览的图片http链接列表
        })
      }
      // ,
      // getSearchTypeActionSheet() {
      //   var that = this
      //   var itemList = ['按时间正序', '按时间倒序']
      //
      //   wx.showActionSheet({
      //     itemList: itemList,
      //     success: function (res) {
      //       if (that.replySearchType != res.tapIndex) {
      //         that.replySearchType = res.tapIndex
      //         if (that.replySearchType == 0) {
      //           that.requestAction = 'reply.list'
      //         } else {
      //           that.requestAction = 'reply.reverseList'
      //         }
      //         that.getReplyData()
      //       }
      //
      //     }
      //   })
      // }
      ,
      navigateToReply(e) {
        var replyId = e.currentTarget.dataset.replyid
        var postId = e.currentTarget.dataset.postid
        var anonymous = e.currentTarget.dataset.anonymous
        var postUserId = this.detailData.userId

        wx.navigateTo({
          url: `../reply/main?replyId=${replyId}&postId=${postId}&anonymous=${anonymous}&postUserId=${postUserId}`
        })
      }
      ,
      onScroll: debounceOnScroll(),
      async getPostData() {
        wx.showLoading({
          title: '加载中'
        })
        const res = await this.$http.get(`${api}`, {
          act: 'post.detail',
          postId: this.id,
          t: this.t
        })
        this.detailData = res.data
        this.level1ReplySize = res.data.level1ReplySize
        wx.hideLoading()
      }
      ,
      /**
       * pageNum==-1的时候为初始化
       * pageNum其他的时候是强行跳转
       * @param type
       * @param pageNum
       * @returns {Promise<void>}
       */
      async getReplyData(pageNum) {
        const res2 = await this.$http.get(`${api}`, {
          act: this.requestAction,
          pageNum: pageNum, //当等于-1的是从cursor位置读取相关的pageNum，当不等于-1的时候则强行获取该pageNum的数据
          postId: this.id,
          t: this.t
        })
        this.pageNum = pageNum;
        this.currentReplies = res2.data.data
        this.cursor = res2.data.cursorInfo.cursor
        this.pageNum = res2.data.cursorInfo.pageNum;
        if (this.pageNum != 0)
          this.includePostContent = 0;
      }
      ,
      async collect() {
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
      }
      ,
      goBottom() {
        this.top = this.currentReplies.length * 1000
      },
      backHome: function () {
        wx.reLaunch({
          url: '/pages/index/main'
        })
      }
      ,
      async upOrCancel(e) {
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
      }
      ,
      showReplyModal(e) {
        var userId = wx.getStorageSync('userId')
        var userName = e.currentTarget.dataset.username
        var replyId = e.currentTarget.dataset.replyid
        var postAnonymous = this.detailData.anonymous
        if (userName) {
          this.content = `@${userName}:`
        } else {
          this.content = ''
        }
        if (userId == this.detailData.userId) {
          this.isPostUserId = true
        }
        this.postAnonymous = postAnonymous
        this.replyId = replyId
        this.replyUserName = userName
        this.sendVisible = true
      }
      ,
      replySuccess() {
        this.closeModal()
        wx.showToast({
          title: '评论成功',
          icon: 'none',
          duration: 1500

        })
        this.getReplyData(this.pageNum)
      }
      ,
      closeModal() {
        this.sendVisible = false
      }
    }
    ,
    onLoad() {
      this.id = this.$root.$mp.query.postId
      if (this.$root.$mp.query.share == 1) {
        this.isShare = 1;
      }
    }
    ,
    onShow() {
      this.pageNum = 0
      var that = this;
      var t = wx.getStorageSync("t")
      checkT(t,
        function () {
          that.loginVisible = true
        },
        function () {
        }
      );
      this.reply_size_per_page = reply_size_per_page;
      this.includePostContent = 1;
      this.detailData = {}
      this.currentReplies = []
    }
    ,
    data() {
      return {
        detailData: {},
        remainReplies: [],
        currentReplies: [],
        content: '',
        sendVisible: false,
        id: '',
        replyId: '',
        timer: null,
        replyUserName: '',
        isPostUserId: false, //默认为不相同
        postAnonymous: 0,
        bottom: 0,
        pageNum: 0,  //为当前的页码，从0开始
        // canGetMoreReply: true,
        replySearchType: 0, //回帖的排序规则，默认正序
        requestAction: 'reply.list',
        loginVisible: false,
        isShare: 0,
        t: 0,
        level1ReplySize: 0,
        includePostContent: 1, // 是否包含post信息，如果不包含说明是大于1的评论页面，包含为1，不包含为0
        cursor: 0,
        reply_size_per_page: 0
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
      height: 90vh;
      width: 100vw;

      .imgs {
        padding-left: 30rpx;
        margin-top: 5rpx;
        font-size: 35rpx;
        display: inline-block;
        text-align: center;
        vertical-align: middle;

        .img {
          margin-right: 5rpx;
          width: 210rpx;
          height: 210rpx;
        }
      }

      .title {
        background-color: white;
        padding-left: 30rpx;

        .big {
          font-size: 40rpx;
          font-weight: 900;

        }
      }

      .content {
        white-space: pre-line;
        text-align: justify;
        text-justify: inter-ideograph;
        font-weight: normal;
        padding-left: 30rpx;
        padding-right: 30rpx;
        font-size: $content-font-size;
      }

      .reply {
        background-color: white;
        margin-bottom: 20rpx;

        .get-more-tips {
          text-align: center;
          font-size: 30rpx;
          padding-bottom: 70rpx;
        }

        .reply-title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 10rpx;
          margin-top: 10rpx;

          .reply-length {
            font-size: 30rpx;
            margin-left: 25rpx;
            font-weight: lighter;
          }

          .change-reply-search-type {
            font-size: 30rpx;
            margin-left: 25rpx;
            margin-right: 20rpx;
            font-weight: lighter;
          }
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
            margin-bottom: 10rpx;
            margin-right: 50rpx;
            width: 100%;

            .reply-info-user-info {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              font-size: 30rpx;

              .reply-info-user-info-fullname {
                deplay: flex;
                flex-direction: row;

                .reply-info-user-info-fullname-louzhu {
                  color: red;
                  border: 1px solid rgba(93, 93, 93, 0.44);
                  font-size: 25rpx;
                }
              }

              .reply-info-user-info-loushu {
                color: gray;
              }

              & > span {
                /*font-weight: lighter;*/
                /*color: rgb(245, 245, 239);*/
                font-size: $reply-content-font-size;
              }
            }
          }

          .reply-imgList {
            height: 210rpx;
            width: 210rpx;
          }

          .reply-content {
            width: 100%;
            white-space: pre-line;
            text-align: justify;
            text-justify: inter-ideograph;
            font-weight: normal;
            margin-top: 10rpx;
            font-size: $content-font-size;
          }

          .reply-foot {
            display: flex;
            justify-content: space-between;
            font-size: 25rpx;
            /*font-weight: lighter;*/
            margin-right: 10rpx;
            margin-top: 10rpx;

            .time {
              color: gray;
              margin-left: 10rpx;
            }

            .action {
              .item {
                height: 35rpx;
                width: 35rpx;
                /*margin-left: 50rpx;*/
              }
            }
          }

          .reply-divide {
            border-bottom: 1px solid #ccc;
            margin-bottom: 10rpx;
            margin-top: 10rpx;
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

                .reply-info-user-info-fullname-louzhu {
                  color: red;
                  border: 1px solid rgba(93, 93, 93, 0.44);
                  font-size: 25rpx;
                }

                .reply-replyList-content {
                  width: 100%;
                  /*white-space: pre-line;*/
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
        right: 30rpx;
        bottom: 166rpx;
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

    .pagination {
      display: flex;
      flex-direction: row;
      margin-top: 20rpx;
      margin-left: 20rpx;
      /*justify-content: space-around;*/
      .left-arrow {
        height: 50rpx;
        width: 50rpx;
        margin-right: 20rpx;
      }

      .right-arrow {
        height: 50rpx;
        width: 50rpx;
        margin-left: 20rpx;
      }

    }

    .actions {
      display: flex;
      flex-direction: row;
      margin-right: 50rpx;
      margin-top: 20rpx;

      .comment {
        height: 50rpx;
        width: 50rpx;
        margin-right: 25rpx;
      }

      .praise {
        height: 50rpx;
        width: 50rpx;
        margin-right: 20rpx;
      }

      .share {
        height: 50rpx;
        width: 50rpx;
      }

    }

  }

  .share {


  }

  .d-back-home {
    position: fixed;
    width: 96rpx;
    height: 96rpx;
    right: 30rpx;
    bottom: 286rpx;
    z-index: 10000;
  }
</style>
