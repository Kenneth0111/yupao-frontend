<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";

const router = useRouter();

const formatDateDisplay = (date: Date): string => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDateForBackend = (date: Date): string => {
  if (!date) throw new Error('日期不能为空');
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d} 00:00:00`; // 或 HH:mm:ss 如果需要时间
};

const onConfirmDate = ({ selectedValues }: { selectedValues: string[] }) => {
  const [y, m, d] = selectedValues.map(Number);
  updateTeamData.value.expireTime = new Date(y, m - 1, d);
  showPicker.value = false;
};

const showPicker = ref(false);

interface TeamData {
  name: string;
  description: string;
  expireTime: Date;
  password: string;
  status: number;
}

// 初始化
const initTeamData: TeamData = {
  name: '',
  description: '',
  expireTime: new Date(),
  password: '',
  status: 0,
};

const updateTeamData = ref<TeamData>({ ...initTeamData });

const route = useRoute();

const id = Number(route.query.id);

onMounted(async ()=> {
  if (id <= 0) {
    showFailToast('加载队伍失败 请重新尝试');
    return;
  }
  const res = await myAxios.get("/team/get", {
    params: {
      id,
    }
  })
  if (res?.data.code === 0) {
    const team = res.data.data;
    updateTeamData.value = {
      name: team.name ?? '',
      description: team.description ?? '',
      expireTime: team.expireTime ? new Date(team.expireTime) : new Date(),
      password: team.password ?? '',
      status: typeof team.status === 'number' ? team.status : Number(team.status || 0),
    }
  } else {
    showFailToast('加载队伍失败 请重新尝试');
  }
})

const onSubmit = async () => {
  const postData = {
    id,
    ...updateTeamData.value,
    expireTime: formatDateForBackend(updateTeamData.value.expireTime)
  }

  console.log('提交的数据:', postData);

  const res = await myAxios.post('/team/update', postData);
  if (res?.data.code === 0 && res.data.data){
    showSuccessToast('更新成功');
    router.push({
      path: '/team',
      replace: true,
    })
  } else {
    showFailToast('更新失败');
  }
}

// 响应式控制密码可见性
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

</script>

<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="updateTeamData.name"
            name="name"
            label="队伍名称"
            placeholder="请输入队伍名称"
            :rules="[{ required: true, message: '请输入队伍名称' }]"
        />
        <van-field
            v-model="updateTeamData.description"
            rows="4"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field
            is-link
            readonly
            name="datePicker"
            label="过期时间"
            :model-value="formatDateDisplay(updateTeamData.expireTime)"
            placeholder="请选择过期日期"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
          <van-date-picker
              title="选择过期日期"
              @confirm="onConfirmDate"
              @cancel="showPicker = false"
              :min-date="new Date()"
          />
        </van-popup>
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="updateTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(updateTeamData.status) === 2"
            v-model="updateTeamData.password"
            :type="isPasswordVisible ? 'text' : 'password'"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请输入队伍密码' }]"
            right-icon="eye"
            @click-right-icon="togglePasswordVisibility"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped>

</style>