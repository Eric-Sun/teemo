<template>
  <div class="mask" @click.stop="closeModal">
    <div class="container" @click.stop="prevent">
      <div class="action">
        <!--        <radio-group v-if="postAnonymous==0&&!isPostUserId" class="anonymous" @click.stop="changeAnonymous">-->
        <!--          <radio :data-value="0" checked="checked"/>-->
        <!--          非匿名-->
        <!--          <radio :data-value="1"/>-->
        <!--          匿名-->
        <!--        </radio-group>-->
        <label class="button" @click.stop="send">提交</label>
      </div>
      <div class="inputText">
        <textarea class='text' v-model="content" placeholder="说点啥....."></textarea>
      </div>

      <!--      <div class="help-block">上传图片(建议图片格式为：JPEG/BMP/PNG/GIF，大小不超过5M，最多可上传9张)</div>-->
      <!--      <lu class="upload-imgs">-->
      <!--        <li v-if="imgList.length>=1 ? false : true">-->
      <!--          <input type="file" class="upload" @click="uploadImg()" ref="inputer"-->
      <!--                 multiple accept="image/png,image/jpeg,image/gif,image/jpg"/>-->
      <!--          <a class="add"><i class="iconfont icon-plus"></i>-->
      <!--            <p>点击上传</p></a>-->
      <!--        </li>-->
      <!--        <li v-for='(img, index) in imgList' :key='index'>-->
      <!--          <p class="img"><img :src="img.url"><a class="close" @click="delImg(index)">x</a>-->
      <!--          </p>-->
      <!--        </li>-->
      <!--      </lu>-->

    </div>
  </div>
</template>
<script>
  import {api, barId} from '../const'

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
        default: '0',
        type: String
      },
      // 用户是否是发帖用户
      isPostUserId: {
        default: false,
        type: Boolean
      },
      imgList: {
        default: [],
        type: Array
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
      async uploadImg() {
        var that = this;
        wx.chooseImage({
          count: 1, //最多可以选择的图片总数
          sizeType: ['original'], // 只能是原图
          sourceType: ['album'], // 只能是相册
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            wx.showToast({
              title: '正在上传...',
              icon: 'loading',
              mask: true,
              duration: 10000
            })


            wx.uploadFile({
              url: `${api}`,
              filePath: tempFilePaths[0],
              name: "file",
              header: {
                "Content-Type": "multipart/form-data"
              },
              formData: {
                "act": "img.upload",
                "type": 2
              },
              dataType: "json",
              success: function (res) {
                var data = JSON.parse(res.data);
                var file = new Object();
                file.url = data.url;
                file.imgId = data.imgId;
                that.imgList.push(file);
                wx.hideToast();
              }
            });

          }
        })
      },
      delImg(index) {
        this.imgList.splice(index, 1);
      },
      changeAnonymous: function (e) {
        this.replyAnonymous = e.target.dataset.value
      },
      prevent() {

      }
      ,
      async send() {
        var that = this
        const t = wx.getStorageSync('t')
        var pureContent = ''
        if (this.replyId != 0) {
          var count = `@${this.replyUserName}:`.length
          pureContent = this.content.substring(count)
        } else {
          pureContent = this.content
        }
        var imgIdList = [];
        for (var i = 0; i < this.imgList.length; i++) {
          imgIdList.push(this.imgList[i].imgId)
        }
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
              lastReplyId: this.replyId,
              imgListStr: JSON.stringify(imgIdList)
            }
          ).then(function (res) {
            if (!res.data.code) {
              that.content = ''
              that.$emit('reply-success')
            } else if (res.data.code == 6) {
              wx.showToast({
                title: '您发的标题或内容违规，请修改后重发',
                icon: 'none',
                duration: 2000
              })
            }
          })
        this.imgList = []
      }
      ,
      closeModal() {
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
      /*justify-content: space-between;*/
      position: absolute;
      bottom: 0;
      height: 90vh;
      width: 100%;
      box-sizing: border-box;
      padding: 5px;


      .action {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 10rpx;
        margin-left: 10rpx;

        .anonymous {
          display: flex;
          flex-direction: row;
        }


        .button {
          color: dodgerblue;
          height: 50rpx;
          width: 100rpx;
          margin-right: 10rpx
        }
      }

      .inputText {

        .text {
          border: 1rpx solid $borderColor;
          margin: 10rpx;
          height: 80vh;

        }
      }


      .upload-imgs {
        margin: 10px 0 30px 0;
        overflow: hidden;
        font-size: 0;
      }

      .help-block {
        margin-left: 10rpx;
        font-size: 25rpx;
      }

      .upload-imgs li {
        position: relative;
        width: 200rpx;
        height: 200rpx;
        font-size: 35rpx;
        display: inline-block;
        padding: 10rpx;
        margin-right: 25rpx;
        border: 2rpx dashed #ccc;
        text-align: center;
        vertical-align: middle;
      }

      .upload-imgs li:hover {
        border-color: #ffffff;
      }

      .upload-imgs .add {
        display: block;
        background-color: #ccc;
        color: #ffffff;
        height: 200rpx;
        padding: 8rpx 0;
      }

      .upload-imgs .add .iconfont {
        padding: 10rpx 0;
        font-size: 40rpx;
      }

      .upload-imgs li:hover .add {
        background-color: #ffffff;
      }

      .upload-imgs li .upload {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 200rpx;
        height: 200rpx;
      }

      .upload-imgs .img {
        position: relative;
        width: 1rpx;
        height: 200rpx;
        line-height: 200rpx;
      }

      .upload-imgs .img img {
        vertical-align: middle;
        width: 180rpx;
        height: 180rpx;
      }

      .upload-imgs .img .close {
        display: none;
      }

      .upload-imgs li:hover .img .close {
        display: block;
        position: absolute;
        right: -20rpx;
        top: -20rpx;
        line-height: 1;
        font-size: 22px;
        color: #aaa;
      }
    }
  }
</style>
