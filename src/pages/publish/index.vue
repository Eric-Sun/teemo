<template>
  <div class="container">
    <login :visible='loginVisible' v-on:modalClose='closeModalEvent'></login>
    <div class='list'>
      <span>标题:</span>
      <input class='input' type="text" placeholder="最少10个字" v-model="title">
    </div>
    <picker class='picker' @change="bindPickerChange($event)" :value="type.index" :range="type.pickerData">
      <span>类型:</span><span style='margin-left:200rpx;'>{{type.pickerData[type.index]}}</span>
    </picker>
<!--    <picker class='picker' @change="bindPickerChange1($event)" :value="anon.index" :range="anon.pickerData">-->
<!--      <span>匿名:</span><span style='margin-left:200rpx;'>{{anon.pickerData[anon.index]}}</span>-->
<!--    </picker>-->

    <textarea v-show="tab==='markdown'" class='textarea' v-model="content"></textarea>
    <div class="help-block">上传图片(建议图片格式为：JPEG/BMP/PNG/GIF，大小不超过5M，最多可上传9张)</div>
    <lu class="upload-imgs">
      <li v-if="imgList.length>=9 ? false : true">
        <input type="file" class="upload" @click="uploadImg()" ref="inputer"/>
        <a class="add"><i class="iconfont icon-plus"></i>
          <p>点击上传</p></a>
      </li>
      <li v-for='(img, index) in imgList' :key='index'>
        <p class="img"><img :src="img.url"><a class="close" @click="delImg(index)">x</a>
        </p>
      </li>
    </lu>
    <button @click.stop="handle">发帖</button>
  </div>
</template>

<script>
  import login from '../../components/login'
  import {api} from '../../const'
  import {barId} from '../../const'
  import {checkT} from '../../utils/net'


  export default {
    components: {
      login
    },

    watch: {
      content(next) {
      }
    },
    data() {
      return {
        type: {
          pickerData: ['故事贴', '一日一记'],
          index: 1
        },
        anon: {
          pickerData: ['非匿名', '匿名'],
          index: 0
        },
        title: '',
        content: '',
        loginVisible: false,
        tab: 'markdown', // or preview
        t: '',
        imgList: []
      }
    },
    methods: {
      async uploadImg() {
        var that = this;
        wx.chooseImage({
          count: 1, //最多可以选择的图片总数
          sizeType: ['compressed'], // 只能是原图
          sourceType: ['album'], // 只能是相册
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            wx.showToast({
              title: '正在上传...',
              icon: 'loading',
              mask: true,
              duration: 20000
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
      bindPickerChange(e) {
        this.type.index = e.mp.detail.value
      },
      bindPickerChange1(e) {
        this.anon.index = e.mp.detail.value
      },
      changeTab(e) {
        this.tab = e.target.dataset.tab
      },
      async handle() {
        if (this.title.length == 0) {
          wx.showToast({
            title: '标题不能为空',
            icon: 'none',
            duration: 2000
          })
          return;
        }

        if (this.content.length == 0) {
          wx.showToast({
            title: '内容不能为空',
            icon: 'none',
            duration: 2000
          })
          return
        }

        var imgIdList = [];
        for (var i = 0; i < this.imgList.length; i++) {
          imgIdList.push(this.imgList[i].imgId)
        }
        var that = this;
        if (this.type.index == -1) {
          wx.showToast({
            title: '请选择类型',
            icon: 'none',
            duration: 2000
          })
        }
        if (this.anon.index == -1) {
          wx.showToast({
            title: '请选择是否匿名',
            icon: 'none',
            duration: 2000
          })
        }
        const res = this.$http.get(`${api}`, {
          act: 'post.add',
          t: this.t,
          barId: `${barId}`,
          title:
          this.title,
          content:
          this.content,
          imgList: JSON.stringify(imgIdList),
          type: this.type.index,
          anonymous: this.anon.index
        }).then(function (response) {
          if (!response.data.code) {
            wx.showToast({
              title: '发帖成功',
              icon: 'none',
              duration: 2000
            })
            that.title = ''
            that.content = ''
            wx.switchTab({
              url: `../index/main`
            })
          }
        })

      }
      ,
      closeModalEvent() {
        this.visible = false
      }
    },
    onShow() {
      var that = this;
      this.t = wx.getStorageSync("t")
      checkT(this.t,
        function () {
          that.loginVisible = true
        },
        function () {
        });
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    height: 100vh;
    background-color: rgb(245, 245, 249);

    .list {
      display: flex;
      /*justify-content: space-between;*/
      background-color: white;
      margin-bottom: 30rpx;
      height: 90rpx;
      padding: 0 30rpx;
      line-height: 90rpx;

      .input {
        margin-left: 150rpx;
        height: 90rpx;
        line-height: 90rpx;
      }
    }

    .picker {
      display: flex;
      /*justify-content: space-between;*/
      background-color: white;
      margin-bottom: 30rpx;
      height: 90rpx;
      line-height: 90rpx;
      padding: 0 30rpx;
    }

    .tabs {
      display: flex;
      background-color: white;

      & > div {
        width: 50%;
        text-align: center;
      }
    }

    .textarea {
      width: 100%;
      background-color: white;
      margin-bottom: 30rpx;
      height: 300rpx;
      padding: 0 30rpx;
      box-sizing: border-box;
    }
  }

  .selected {
    color: $color;
    border-bottom: 2rpx solid $color;
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
</style>
