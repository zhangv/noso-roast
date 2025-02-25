<template>
  <div>
    <v-card-title class="d-flex align-center">
      烘焙管理
      <v-icon color="primary" @click="start">$plus</v-icon>
      <v-icon color="info" @click="load">$reload</v-icon>
    </v-card-title>
    <RoastOrderList ref="thelist" show-select :single-select="false" :init-query.sync="query" :headers="headers">
      <template v-slot:batchActions="{ selected }"> </template>
      <template v-slot:actions="{ item }">
        <v-icon class="mr-2" @click="profile(item)">$edit</v-icon>
        <v-icon class="mr-2" @click="del(item)" color="error">$delete</v-icon>

        <template v-if="item.status === 'start'">

          <v-btn classs="mr-2" @click="complete(item)">完成</v-btn>
          <v-btn classs="mr-2" @click="cancel(item)">取消</v-btn>
        </template>
      </template>
    </RoastOrderList>
    <v-dialog v-model="startDlg">
      <v-card>
        <start-form v-model:value="startForm" :errors="startErrors">
          <template #actions="{ object }">
            <v-card-actions>
              <v-btn color="primary" large @click="confirmStart(object)">开始</v-btn>
            </v-card-actions>
          </template>
        </start-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="profileDlg">
      <v-card>
        <profile-form v-model:value="profileForm" :errors="profileErrors">
          <template #actions="{ object }">
            <v-card-actions>
              <v-btn color="primary" large @click="confirmProfile(object)">确认保存</v-btn>
            </v-card-actions>
          </template>
        </profile-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="completeDlg">
      <v-card>
        <v-card-title>完成烘焙</v-card-title>
        <v-card-text>
          <complete-form v-model:value="completeForm" :errors="completeErrors">
            <template #actions="{ object }">
              <v-btn @click="confirmComplete(object)">完成</v-btn>
            </template>
          </complete-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import { clone } from 'lodash-es'
import BeanProfileForm from '@/components/bean/BeanForm.vue'
import BeanSelector from '@/components/bean/BeanSelector.vue'

import RoastOrderList from '@/components/roast/RoastOrderList.vue'
import StartForm from '@/components/roast/StartForm.vue'
import CompleteForm from '@/components/roast/CompleteForm.vue'
import ProfileForm from '@/components/roast/ProfileForm.vue'
import { mapState, mapActions } from 'pinia'
import { useRootStore } from '@/stores/root'
export default {
  components: {
    BeanProfileForm, RoastOrderList, BeanSelector, StartForm
    , CompleteForm, ProfileForm
  },
  data() {
    const qps = qs.parse(location.search, { ignoreQueryPrefix: true })

    return {
      query: qps,
      refs: {},
      editingObj: {},
      objects: [],
      total: 0,
      showEditor: false,
      loading: false,
      options: {},
      startDlg: false,
      startForm: {},
      startErrors: {},
      profileDlg: false,
      profileForm: {},
      profileErrors: {},
      completeDlg: false,
      completeForm: {},
      completeErrors: {},
      headers: [
        { title: '#', value: 'id' },
        { title: '名称', align: 'left', sortable: true, value: 'name' },
        { title: '生豆', value: 'bean_id' },
        { title: '重量', value: 'inqty' },
        // { title: '创建时间', value: 'createdtime' },
        { title: '开始时间', value: 'starttime' },
        { title: '状态', value: 'status' },
        {
          text: '操作',
          align: 'left',
          sortable: false,
          value: 'action'
        }
      ],
    }
  },
  mounted() {
    this.load()
  },
  computed: {},
  watch: {},
  methods: {
    start() {
      this.startDlg = true
    },
    confirmStart(form) {
      this.$http.post(`/roast/start`, form).then(r => {
        this.load()
        this.startDlg = false
      }).catch(e => {
        this.startErrors = e.message
      })
    },

    load() {
      this.$refs.thelist.load()
    },
    save(form) {
      this.$api.roast.update(form, (r) => {
        alert('saved')
      })
    },
    profile(item) {
      this.profileDlg = true
      Object.assign(item, item.roastProfile)
      this.profileForm = clone(item)
    },
    confirmProfile(form) {
      this.$http.post(`/roast/updateProfile`, form).then(r => {
        this.load()
        this.profileDlg = false
      }).catch(e => {
        this.profileErrors = e.message
      })
    },
    complete(roast) {
      this.completeDlg = true
      this.completeForm = {
        roastOrder_id: roast.id,
      }
    },
    confirmComplete(form) {
      console.log('form', form)
      this.$http.post(`/roast/complete`, form).then(r => {
        this.load()
        this.completeDlg = false
      }).catch(e => {
        this.completeErrors = e.message
      })
    },
    cancel(roast) {
      this.$confirm('确定要取消吗？').then((r) => {
        if (r === true) {
          this.$http.get(`/roast/cancel/${roast.id}`).then(r => {
            this.load()
          }).catch(e => {
            alert(e.message)
          })
        }
      })
    },
    del(item) {
      this.$confirm('确定要删除吗？').then((r) => {
        if (r === true) {
          let id = item.id
          this.$http.get(`/roast/delete/` + id).then((data) => {
            this.load()
          })
        }
      })
    }
  }
}
</script>

<style scoped></style>
