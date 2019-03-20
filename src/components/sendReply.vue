<template>
  <div class="mask" @click.stop="closeModal">
    <div class="container" @click.stop="prevent">
      <textarea class='textarea' v-model="content" placeholder="说点啥....."></textarea>
      <picker @change="bindPickerChange1($event)" :value="anon.index" :range="anon.pickerData">
        <span>匿名:</span><span style='margin-left:400rpx;'>{{anon.pickerData[anon.index]}}</span>
      </picker>
      <button class="button" @click.stop="send">提交</button>
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
        const t = wx.getStorageSync('t')
        try {
          const res = await this.$http.post(
            `${api}`,
            {
              t: t,
              content: this.content,
              postId: this.postId,
              barId: `${barId}`,
              anonymous: 0,
              lastReplyId: 0
            }
          )
          if (res.data.success) {
            this.content = ''
            this.$emit('reply-success')
          }
        } catch (e) {
          wx.showToast({
            title: e.response.data.error_msg,
            icon: 'none',
            duration: 2000
          })
        }
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
      flex-direction: column;
      align-items: center;
      background-color: white;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 20px;
      .textarea {
        border: 2rpx solid $borderColor;
      }
      .button {
        background-color: $color;
        color: white;
        width: 300rpx;
        margin-top: 26rpx;
      }
    }
  }
</style>
