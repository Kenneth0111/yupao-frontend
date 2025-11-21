<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user.ts";
import {showConfirmDialog, showToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import { useRouter } from "vue-router";

const user = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
})

const router = useRouter();

const handleLogout = () => {
  showConfirmDialog({
    title: "提示",
    message: "确定要退出登录吗？",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  })
      .then(() => myAxios.post("/user/logout"))
      .then((res: any) => {
        if (res.data.code === 0 && res.data) {
          showToast("退出成功");
          router.replace("/user/login");
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          showToast("退出失败");
        }
      })
      .catch((error: any) => {
        if (error !== 'cancel') {
          showToast("退出失败");
        }
      });
};

</script>

<template>
  <template v-if="user">
    <van-cell title="当前用户" :value="user?.username" />
    <van-cell title="修改个人信息" is-link to="/user/update" />
    <van-cell title="我创建的队伍" is-link to="/user/team/create" />
    <van-cell title="我加入的队伍" is-link to="/user/team/join" />
    <div class="logout-btn-container">
      <van-button
          type="danger"
          size="large"
          round
          @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>
  </template>
</template>

<style scoped>
.logout-btn-container {
  position: fixed;
  bottom: 80px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.logout-btn-container .van-button {
  width: 80%;
  font-weight: 500;
}
</style>