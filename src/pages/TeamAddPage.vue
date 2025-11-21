<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
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
  addTeamData.value.expireTime = new Date(y, m - 1, d);
  showPicker.value = false;
};

const showPicker = ref(false);

interface AddTeamData {
  name: string;
  description: string;
  expireTime: Date;
  maxNum: number;
  password: string;
  status: number;
}

const initFormData: AddTeamData = {
  name: "",
  description: "",
  expireTime: new Date(),
  maxNum: 3,
  password: "",
  status: 0
};

const addTeamData = ref<AddTeamData>({...initFormData});

const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    expireTime: formatDateForBackend(addTeamData.value.expireTime),
    status: Number(addTeamData.value.status)
  }
  const res = await myAxios.post('/team/add', postData);
  if (res?.data.code === 0 && res.data.data){
    showSuccessToast('创建成功');
    router.push({
      path: '/team',
      replace: true,
    })
  } else {
    showFailToast('创建失败');
  }
}
</script>

<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队伍名称"
            placeholder="请输入队伍名称"
            :rules="[{ required: true, message: '请输入队伍名称' }]"
        />
        <van-field
            v-model="addTeamData.description"
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
            :model-value="formatDateDisplay(addTeamData.expireTime)"
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
        <van-field name="stepper" label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" :min="3" :max="10" />
          </template>
        </van-field>
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请输入队伍密码' }]"
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