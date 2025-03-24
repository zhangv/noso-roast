<template>
  <div>
    <v-card-title class="d-flex align-center">
      烘焙管理
      <v-icon color="primary" @click="start">$plus</v-icon>
      <v-icon color="info" @click="load">$reload</v-icon>
    </v-card-title>
    <RoastList ref="thelist" show-select :single-select="false" :init-query.sync="query" :headers="headers">
      <template v-slot:batchActions="{ selected }"> </template>
      <template v-slot:actions="{ item }">
        <!-- <v-icon class="mr-2" @click="detail(item)">$info</v-icon> -->
        <v-icon class="mr-2" @click="profile(item)">$edit</v-icon>
        <v-icon class="mr-2" @click="del(item)" color="error">$delete</v-icon>
        <template v-if="item.status === 'start'">
          <v-btn classs="mr-2" @click="complete(item)">完成</v-btn>
          <v-btn classs="mr-2" @click="cancel(item)">取消</v-btn>
        </template>
        <template v-if="item.status === 'complete'">
          <v-btn classs="mr-2" @click="cupping(item)">杯测WIP</v-btn>
        </template>
      </template>
    </RoastList>
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
        <profile-form v-model:roastId="profileId" :errors="profileErrors">
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
    <v-dialog v-model="detailDlg">
      <v-card>
        <v-card-title>烘焙详情</v-card-title>
        <v-card-text>
          <p>{{ detailObj.description }}</p>
          <p>状态: {{ detailObj.status }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import {
  BeanSelector, RoastList, RoastStartForm as StartForm, RoastCompleteForm as CompleteForm,
  RoastProfileForm as ProfileForm
} from '@ui'
export default {
  components: {
    RoastList, BeanSelector, StartForm
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
      profileId: null,
      profileErrors: {},
      completeDlg: false,
      completeForm: {},
      completeErrors: {},
      detailId: null,
      detailDlg: false,
      detailObj: {},
      headers: [
        { title: '#', sortable: true, value: 'id' },
        { title: '名称', align: 'left', sortable: true, value: 'name' },
        { title: '生豆', value: 'bean_id' },
        { title: '生重', sortable: true, value: 'inqty' },
        { title: '熟重', sortable: true, value: 'outqty' },
        { title: '开始时间', sortable: true, value: 'starttime' },
        { title: '状态', sortable: true, value: 'status' },
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
      this.$api2.roast.start(form, r => {
        this.load()
        this.startDlg = false
      }, e => {
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
    detail(roast) {
      this.detailDlg = true
      this.$api2.roast.getById(roast.id, r => {
        this.detailObj = r
      })
    },
    profile(item) {
      this.profileDlg = true
      this.profileId = item.id
    },
    confirmProfile(form) {
      form.roast_id = this.profileId
      this.$api2.roast.updateProfile(form, r => {
        this.profileDlg = false
        this.load()
      }, e => {
        this.profileErrors = e.message
      })
    },
    complete(roast) {
      this.completeDlg = true
      this.completeForm = {
        id: roast.id,
      }
    },
    confirmComplete(form) {
      this.$api2.roast.complete(form, r => {
        this.load()
        this.completeDlg = false
      }).catch(e => {
        this.completeErrors = e.message
      })
    },
    cancel(roast) {
      this.$confirm('确定要取消吗？').then((r) => {
        if (r) {
          this.$api2.roast.cancel(roast.id, r => {
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
