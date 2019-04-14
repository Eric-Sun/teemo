<template>
  <div class="mask" @click.stop="closeModal">
    <div class="container" @click.stop="prevent">
      <radio-group v-if="postAnonymous==0&&!isPostUserId" class="anonymous" @click.stop="changeAnonymous">
        <radio :data-value="0" checked="checked"/>
        非匿名
        <radio :data-value="1"/>
        匿名
      </radio-group>
      <div class="action">
        <input class='text' v-model="content" placeholder="说点啥....."></input>
        <label class="button" @click.stop="send">提交</label>
      </div>
    </div>
  </div>
</template>
<script>
  import { api, barId } from '../const'

  export default {
    props: {
      postId: 0,
      replyId: {
        default: '',
        type: String
      },
      replyUserName: {
        default: '',
        type: String
      },
      content: {
        default: '',
        type: String
      },
      // 帖子本身是否是匿名帖子
      postAnonymous: {
        default: '',
        type: String
      },
      // 用户是否是发帖用户
      isPostUserId: {
        default: false,
        type: Boolean
      }

    },
    data: function () {
      return {
        anon: {
          pickerData: ['非匿名', '匿名'],
          index: -1,
          replyAnonymous: 1 //此评论是否是匿名评论，默认为匿名
        }
      }
    },
    methods: {
      changeAnonymous: function (e) {
        this.replyAnonymous = e.target.dataset.value
      },
      prevent () {

      }
      ,
      async send () {
        var that = this
        const t = wx.getStorageSync('t')
        var pureContent = ''
        if (this.replyId != 0) {
          var count = `@${this.replyUserName}:`.length
          pureContent = this.content.substring(count)
        } else {
          pureContent = this.content
        }
        console.log(this.replyId)
        await
          this.$http.get(
            `${api}`,
            {
              act: 'reply.add',
              t: t,
              content: pureContent,
              postId: this.postId,
              barId: `${barId}`,
              anonymous: this.replyAnonymous,
              lastReplyId: this.replyId
            }
          ).then(function (res) {
            if (!res.data.code) {
              that.content = ''
              that.$emit('reply-success')
            }
          })
      }
      ,
      closeModal () {
        this.$emit('close-modal')
      }
    }
  }
</script>
<style lang='scss' scoped>
  .mask {
    height: 100vh;
    width: 100vw;
    position: fixed;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.6);
    .container {
      display: flex;
      flex-direction: column;
      background-color: white;
      justify-content: space-between;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      .anonymous {
        display: flex;
        flex-direction: row;
      }
      .action {
        display: flex;
        flex-direction: row;
        .text {
          border: 2rpx solid $borderColor;
          width: 100%;
        }
        .button {
          color: dodgerblue;
          height: 50rpx;
          width: 100rpx;
          margin-right: 25rpx;
          margin-left: 25rpx
        }
      }

    }
  }
</style>
