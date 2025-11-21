<script setup lang="ts">
import type {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team.ts";
import SpongeBob from "../assets/SpongeBob.png";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user.ts";
import {useRouter} from "vue-router";
import {hasJoin} from "../constants/hasJoin.ts";

interface TeamCardListProps {
  teamList: TeamType[]
}

const router = useRouter();

const props = withDefaults(defineProps<TeamCardListProps>(), {
  teamList: () => []
});

const currentUser = ref();

onMounted(async () => {
  currentUser.value = await getCurrentUser();
})

const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  const res = await myAxios.post('/team/join', {
    id: joinTeamId.value,
    password: password.value
  });
  if (res?.data.code === 0) {
    showSuccessToast('加入成功');
    doJoinTeamCancel();
  } else {
    showFailToast('加入失败' + (res.data.description ? `\n${res.data.description}` : ''))
  }
}

const doUpdateTeam = async (id: number) => {
  router.push({
    path: "/team/update",
    query: {
      id,
    }
  })
}

const doQuitTeam = async (id: number) => {
  const res = await myAxios.post('/team/quit', {
    id: id
  });
  if (res?.data.code === 0) {
    showSuccessToast('操作成功')
  } else {
    showFailToast('操作失败' + (res.data.description ? `\n${res.data.description}` : ''))
  }
}

const doDismissTeam = async (id: number) => {
  const res = await myAxios.post('/team/dismiss', {
    id: id
  });
  if (res?.data.code === 0) {
    showSuccessToast('操作成功')
  } else {
    showFailToast('操作失败' + (res.data.description ? `\n${res.data.description}` : ''))
  }
}

const showPasswordDialog = ref(false);

const password = ref('');

const joinTeamId = ref(0);

const preJoinTeam = (team : TeamType) => {
  joinTeamId.value = team.id;
  if (team.status === 0) {
    doJoinTeam()
  } else {
    showPasswordDialog.value = true;
  }
}

const doJoinTeamCancel = () => {
  joinTeamId.value = 0;
  password.value = '';
}

</script>

<template>
  <van-card
      v-for="team in props.teamList"
      :desc="team.description"
      :title="team.name"
      :thumb="SpongeBob"
  >
    <template #tags>
      <van-tag plain type="danger" style="margin-right: 8px; margin-top: 8px">
        {{ teamStatusEnum[team.status as keyof typeof teamStatusEnum] }}
      </van-tag>
      <van-tag plain type="primary" style="margin-right: 8px; margin-top: 8px">
        {{  hasJoin[team.hasJoin.toString()] }}
      </van-tag>
    </template>
    <template #bottom>
      <div>
        {{ `队伍人数: ${team.hasJoinNum}/${team.maxNum}` }}
      </div>
      <div>
        {{ '过期时间: ' + team.expireTime}}
      </div>
      <div>
        {{ '创建时间: ' + team.createTime}}
      </div>
    </template>
    <template #footer>
      <van-button size="small" type="primary" plain v-if="team.userId !== currentUser?.id && !team.hasJoin" @click="preJoinTeam(team)">加入队伍</van-button>
      <van-button size="small" type="primary" plain v-if="team.userId === currentUser?.id" @click="doUpdateTeam(team.id)">更新队伍</van-button>
      <!--仅加入队伍的人且非创建人可见 退出队伍 按钮-->
      <van-button size="small" type="warning" plain v-if="team.userId !== currentUser?.id && team.hasJoin" @click="doQuitTeam(team.id)">退出队伍</van-button>
      <van-button size="small" type="danger" plain v-if="team.userId === currentUser?.id" @click="doDismissTeam(team.id)">解散队伍</van-button>
    </template>
  </van-card>
  <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinTeamCancel">
    <van-field v-model="password" placeholder="请输入密码" />
  </van-dialog>
</template>

<style scoped>

</style>