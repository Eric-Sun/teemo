<template>
  <div class="mask" @click.stop="closeModal">
    <div class="container" @click.stop="prevent">
      <input class='text' v-model="content" placeholder="说点啥....."></input>
      <!--<picker @change="bindPickerChange1($event)" :value="anon.index" :range="anon.pickerData">-->
      <!--<span>匿名:</span><span style='margin-left:400rpx;'>{{anon.pickerData[anon.index]}}</span>-->
      <!--</picker>-->
      <label class="button" @click.stop="send">提交</label>
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
      }

    },
    data: function () {
      return {
        anon: {
          pickerData: ['非匿名', '匿名'],
          index: -1
        }
      }
    },
    methods: {
      prevent () {

      },
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

        await this.$http.get(
          `${api}`,
          {
            act: 'reply.add',
            t: t,
            content: pureContent,
            postId: this.postId,
            barId: `${barId}`,
            anonymous: 0,
            lastReplyId: this.replyId
          }
        ).then(function (res) {
          if (!res.data.code) {
            that.content = ''
            that.$emit('reply-success')
          }
        })
      },
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
      background-color: white;
      justify-content: space-between;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
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
        /*width: 70rpx;*/
        /*margin-top: 26rpx;*/
      }
    }
  }
</style>
