<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {type Ref, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showSuccessToast, Toast} from "vant";
import {getCurrentUser} from "../services/user.ts";
import {setCurrentUserState} from "../states/user.ts";

const route = useRoute();
const router = useRouter();

const initCurrentValue = (() => {
  const val = route.query.currentValue ?? '';
  if (route.query.editKey === 'gender') {
    return val === '0' ? '男' : val === '1' ? '女' : val;
  }
  return String(val);
})();

const editUser = ref({
  editKey: route.query.editKey ?? '',
  currentValue: initCurrentValue,
  editName: route.query.editName ?? '',
}) as Ref<{ editKey: string; currentValue: string; editName: string }>;

const onSubmit = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    Toast.fail('用户未登录')
    return;
  }

  let valueToSubmit : string | number = editUser.value.currentValue;

  if (editUser.value.editKey === 'gender') {
    if (valueToSubmit === '男') {
      valueToSubmit = 0;
    } else if (valueToSubmit === '女') {
      valueToSubmit = 1;
    } else {
      Toast.fail('性别值非法，请选择“男”或“女”');
      return;
    }
  }

  console.log(currentUser, '当前用户')
  const res = await myAxios.post('/user/update', {
    'id': currentUser.id,
    [editUser.value.editKey]: valueToSubmit,
  })
  console.log(res, '更新请求');
  if (res.data.code === 0 && res.data.data > 0) {
    showSuccessToast('更新成功');
    setCurrentUserState(null);
    router.back();
  } else {
    Toast.fail('更新失败');
  }
}

</script>

<template>
  <van-form @submit="onSubmit">
    <van-field
        v-model="editUser.currentValue"
        :name="editUser.editKey"
        :label="editUser.editName"
        :placeholder="`请输入${editUser.editName}`"
    />
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<style scoped>

</style>