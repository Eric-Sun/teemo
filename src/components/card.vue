<template>
  <div class='container'>
    <div class='head'>
      <img v-if="item.anonymous==0" class='head-img' :src='item.userAvatarUrl'
           @click.stop='goAuthorPage' :data-userid="item.userId">
      <img v-if="item.anonymous==1" class='head-img' :src='item.userAvatarUrl'
           :data-userid="item.userId">
      <div class='info'>
        <span class="name">{{item.userName}}</span>

        <!--        <span class='time'>{{formatCreateAt}}</span>-->
      </div>
      <span class="top">
              <img class="ellipsis" src="../../static/ellipsis.png"
                   :data-postid="item.postId"
                   @click.stop="loadActions($event)"/>
      </span>
    </div>
    <div class='body' @click.stop="goDetail($event)">
      <div class="title">{{item.title}}</div>
      <pre>{{formatContent}}</pre>
      <div class="imgs" v-for="(img,index) in item.imgList">
        <img class="img" :src="img.url" @click.stop="previewImg(index)">
      </div>
    </div>
    <div class='foot' v-if='!hidden'>
      <div class="reply-items">
        <img class="reply-img" @click="showReplyModal" src="../../static/comment.png"/>
        <div class="reply-count">{{item.replyCount}}</div>
      </div>
      <button class="wechat-share" style="background-image: url(../../static/share.png)" hover-class="none" open-type="share" plain="true"/>
    </div>
  </div>

</template>

<script>
  import {passTime} from '../utils/index'
  import {api} from '../const'

  export default {
    props: {
      item: Object,
      hidden: {
        // 个人中心展示帖子隐藏一部分东西的复用
        default: false,
        type: Boolean
      }
    },
    data: {
      return: {}
    },
    onload() {
    },
    computed: {
      formatLastReply() {
        return passTime(this.item.createtime)
      },
      formatCreateAt() {
        return passTime(this.item.createtime)
      },
      formatContent() {
        // var reg = new RegExp('\n\n', 'g')
        // console.log( this.item.content.replace(reg,`<br>`))
        // return this.item.content.replace(reg,`<br>`)
        return this.item.content
      }
    },
    methods: {
      onShareAppMessage: function () {
        console.log("fdsfds");
        return {
          title: this.item.title,//分享内容
          path: '/pages/detail/main?postId=' + this.id + "&share=1" //分享地址
          // imageUrl: '/images/img_share.png',//分享图片
        }

      },
      previewImg(index) {
        const urlList = []
        for (var i = 0; i < this.item.imgList.length; i++) {
          urlList.push(this.item.imgList[i].url);
        }
        wx.previewImage({
          current: this.item.imgList[index].url, // 当前显示图片的http链接
          urls: urlList // 需要预览的图片http链接列表
        })
      },
      goAuthorPage(e) {
        const cachedUserId = wx.getStorageSync('userId')
        const cardUserId = e.currentTarget.dataset.userid
        if (cachedUserId == cardUserId) {
          wx.switchTab({
            url: `/pages/me/main`
          })
        } else {
          wx.navigateTo({
            url: `../user/main?otherUserId=${cardUserId}`
          })
        }
      },
      goDetail() {
        wx.navigateTo({
          url: `../detail/main?postId=${this.item.postId}`
        })
      },
      loadActions(e) {
        var that = this
        var t = wx.getStorageSync('t')
        var currentUserId = wx.getStorageSync('userId')
        var itemList = []
        if (currentUserId == this.item.userId) {
          itemList = ['删除', '收藏']
        } else {
          itemList = ['收藏']
        }

        wx.showActionSheet({
          itemList: itemList,
          success: function (res) {

            if (itemList.length == 2 && res.tapIndex == 0) {
              wx.showModal({
                title: '删除',
                content: '请确认此贴是否删除',
                success(res) {
                  if (res.confirm) {
                    that.$http.get(`${api}`, {
                      act: 'post.delete',
                      t: t,
                      postId: that.item.postId
                    }).then(function (res) {
                      if (res.data.code != null) {
                      }
                      wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                          that.$emit('reloadCardList')
                        }
                      })
                    })

                  } else if (res.cancel) {
                  }
                }
              })
            } else {
              // 收藏
            }
          },
          fail: function (res) {
            // console.log(res.errMsg)
          }
        })

        // const postId = e.currentTarget.dataset.postid
        // this.$emit("showActionModal", postId)

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
    /*justify-content: space-between;*/

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

        .ellipsis {
          width: 50rpx;
          height: 75rpx;
        }
      }
    }

    .body {
      // color: $color;
      margin-top: 10rpx;
      margin-bottom: 20rpx;
      margin-left: 10rpx;

      .imgs {
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

      & > pre {
        white-space: pre-line;
        text-align: justify;
        text-justify: inter-ideograph;
        font-weight: normal;
        font-size: $content-font-size;
      }

      .title {
        font-size: 40rpx;
        font-weight: 900;
        margin-bottom: 10rpx;
      }
    }

    .foot {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .reply-items {
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

      .wechat-share {
        height: 35rpx;
        width: 35rpx;
        margin-right: 10rpx;
        background-size: 35rpx 35rpx;
        background-repeat:no-repeat;
        border:none;
      }

    }
  }
</style>
