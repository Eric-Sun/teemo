<template>
  <div class='header'>
    <img :src='user&&user.avatarUrl' class='img'>
    <span class='span'>{{user&&user.nickName}}</span>
    <span class='span'>C龄:{{user&&formatCreateAt}}</span>
  </div>
</template>
<script>
  import { passTime } from '../utils/index'

  export default {
    props: {
      user: Object
    },
    computed: {
      formatCreateAt () {
        return passTime(this.user && this.user.createtime).slice(0, -1)
      }
    },
    mounted () {
    }
  }
</script>

<style lang='scss' scoped>
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $color;
    font-size: 30rpx;
    background-color: white;
    .img {
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      margin-top: 30rpx;
    }
    .span {
      margin-top: 20rpx;
    }
  }
</style>
