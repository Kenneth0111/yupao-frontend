<script setup lang="ts">
import { useRouter } from "vue-router";
import myAxios from "../plugins/myAxios.ts";
import { showToast } from "vant";
import { ref } from "vue";

const router = useRouter();

const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');

const onSubmit = async () => {
  const res = await myAxios.post('/user/register', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
  });
  console.log(res, '用户注册请求');

  if (res.data.code === 0 && res.data) {
    showToast({
      message: '注册成功',
      type: 'success',
      duration: 1500
    });
    // 注册成功后跳转登录页（与你登录页跳转逻辑对称）
    router.push('/user/login');
  } else {
    // 可选优化：显示后端返回的 message（更友好），否则兜底“注册失败”
    const msg = res.data?.message || '注册失败';
    showToast({
      message: msg,
      type: 'fail',
      duration: 1500
    });
  }
};
</script>

<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请输入账号' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
      />
      <van-field
          v-model="checkPassword"
          type="password"
          name="checkPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[{ required: true, message: '请再次输入密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        注册
      </van-button>
      <van-button
          round
          block
          type="default"
          style="margin-top: 12px"
          @click="router.push('/user/login')"
      >
        ← 返回登录
      </van-button>
    </div>
  </van-form>
</template>

<style scoped>
.van-button--default {
  color: #1989fa;
}
</style>