<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user.ts";

const user = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
})

const router = useRouter();

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    }
  })
}

const displayGender = computed(() => {
  if (!user.value) return '未知';
  const g = Number(user.value.gender);
  return g === 0 ? '男' : g === 1 ? '女' : '未知';
});

</script>

<template>
  <template v-if="user">
    <van-cell title="昵称" is-link :value="user.username" @click="toEdit('username', '昵称', user.username)" />
    <van-cell title="账号" :value="user.userAccount" />
    <van-cell title="头像">
      <img style="height: 48px" :src="user.avatarUrl" />
    </van-cell>
    <van-cell title="简介" is-link :value="user.profile" @click="toEdit('profile', '简介', user.profile)" />
    <van-cell title="性别" is-link :value="displayGender" @click="toEdit('gender', '性别', user.gender?.toString() || '')" />
    <van-cell title="电话" is-link :value="user.phone" @click="toEdit('phone', '电话', user.phone)" />
    <van-cell title="邮箱" is-link :value="user.email" @click="toEdit('email', '邮箱', user.email)" />
    <van-cell title="标签" is-link :value="user.tags" @click="toEdit('tags', '标签', user.tags)" />
    <van-cell title="星球编号" is-link :value="user.planetCode" @click="toEdit('planetCode', '星球编号', user.planetCode)" />
    <van-cell title="注册时间" :value="user.createTime" />
  </template>
</template>

<style scoped>

</style>