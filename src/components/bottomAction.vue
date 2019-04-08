<template>
  <div class="mask" @click.stop="closeModal">
    <div class="container">
      <div class="delete" @click.stop="deletePost">删除</div>
    </div>
  </div>
</template>

<script>
  import { api } from '../const'

  export default {
    props: {
      postId: 0,
      replyId: {
        default: '',
        type: String
      }
    },
    data: {
      return: {
        t: 0
      }
    },
    name: 'bottomAction.vue',
    onShow: function () {
      this.t = wx.getStorageSync('t')
    },
    methods: {
      closeModal () {
        this.$emit('close-modal')
      },
      async deletePost () {
        var that = this;
        wx.showModal({
          title: '删除',
          content: '请确认此贴是否删除',
          success (res) {
            if (res.confirm) {
              that.$http.get(`${api}`, {
                act: 'post.delete',
                t: that.t,
                postId: that.postId
              }).then(function(res){
                if (res.data.code != null) {
                }
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    console.log("1111")
                  }
                })
              })

            } else if (res.cancel) {
            }
          }
        })

      }
    }
  }

</script>

<style lang='scss' scoped>
  .mask {
    height: 100vh;
    width: 100vw;
    position: fixed;
    z-index: 3;
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
      .delete {
        text-align: center;
        width: 100%;

      }
    }
  }
</style>
