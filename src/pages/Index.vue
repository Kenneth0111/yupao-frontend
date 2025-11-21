<script setup lang="ts">
import {onMounted, ref, watchEffect} from 'vue';
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast, Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import type {UserType} from "../models/user";
import {getCurrentUser} from "../services/user.ts";

onMounted(() => { getCurrentUser().catch(() => {}); });

const userList = ref([]);

const loading = ref(true);

const isMatchMode = ref<boolean>(false)

const loadData = async () => {
  let userListData;
  loading.value = true;
  if (isMatchMode.value) {
    const num = 5
    showSuccessToast('正在寻找标签相似的用户')
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data?.data;
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          showFailToast('请求失败');
        })
  } else {
    showSuccessToast('正在加载全部用户')
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data?.data?.records;
        })
        .catch(function (error) {
          console.error('/user/recommend error', error);
          Toast.fail('请求失败');
        })
  }
  if (userListData) {
    userListData.forEach((user : UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
})


</script>

<template>
  <van-cell center title="匹配模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode" />
    </template>
  </van-cell>
  <user-card-list :user-list="userList" :loading="loading"/>
  <van-empty v-if="!userList || userList.length < 1" description="数据为空" />
</template>

<style scoped>

</style>