<script setup lang="ts">
import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast} from "vant";

const active = ref('public');
const router = useRouter();
const teamList = ref([]);
const searchText = ref('');

const onTabChange = (name: string) => {
  if (name === 'public') {
    listTeam(searchText.value, 0);
  } else {
    listTeam(searchText.value, 2);
  }
}

const doCreateTeam = () => {
  router.push({
    path: "/team/add"
  })
}

const listTeam = async (val = '', status = 0) => {
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      pageNum: 1,
      status,
    }
  });
  if (res?.data.code === 0) {
    teamList.value = res.data.data;
  } else {
    showFailToast('加载队伍失败 请刷新重试');
  }
}

onMounted(async () => {
  listTeam();
});

const onSearch = (val= '') => {
  listTeam(val);
}

</script>

<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public" />
      <van-tab title="加密" name="secret" />
    </van-tabs>
    <van-button
        class="create-button"
        type="primary"
        icon="plus"
        :style="{
    position: 'fixed',
    bottom: '60px',
    left: '12px',
    zIndex: 1000
  }"
        @click="doCreateTeam"
    >
      创建队伍
    </van-button>
    <team-card-list :teamList="teamList" />
    <van-empty v-if="teamList?.length < 1" description="数据为空" />
  </div>
</template>

<style scoped>

</style>