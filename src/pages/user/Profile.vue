<template>
  <div>
    <v-row class="mx-2 px-3">
      <v-col cols="12" style="padding-left: 0" class="justify-center d-flex align-center">
        <v-avatar>
          <img :src="form.avatar" alt="点击修改" @click="showFileChooser" />
        </v-avatar>
        <!--				<v-btn rounded outlined small color="warning"  @click.stop="showFileChooser">修改</v-btn>-->
        <v-dialog v-model="showCropper">
          <vue-cropper ref="cropper" :img="newAvatar" :aspect-ratio="1"></vue-cropper>
          <v-btn @click="confirmCrop">确定</v-btn>
        </v-dialog>
      </v-col>
      <v-col cols="6" class="pl-0">
        <v-text-field label="姓名" v-model="form.name" />
      </v-col>
      <v-col cols="6" class="pr-0">
        <v-radio-group v-model="form.sex" label="" row dense>
          <v-radio label="女士" value="female" />
          <v-radio label="先生" value="male" class="mx-0" />
        </v-radio-group>
      </v-col>
      <v-col cols="12" class="px-0">
        <area-selector :value="[form.province, form.city, form.district]" :level="3" @selected="onAreaSelected" />
      </v-col>
      <v-col cols="6" class="pl-0">
        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
          min-width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="form.birthDate" label="生日" readonly v-on="on" />
          </template>
          <v-date-picker ref="picker" v-model="form.birthDate" :max="new Date().toISOString().substr(0, 10)"
            min="1940-01-01" locale="zh-cn" @change="save1" />
        </v-menu>
      </v-col>
      <v-col cols="6" class="pr-0">
        <v-text-field label="职业" v-model="form.occupation" />
      </v-col>
    </v-row>
    <input style="display: none" ref="avatarUploader" type="file" name="image" accept="image/*" @change="setImage" />
    <v-bottom-navigation grow fixed dark>
      <v-btn block @click="save" color="primary "> 保存 </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { AreaSelector } from '@ui'
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        // sex: 'female' //默认选女士
      },
      menu: false,
      newAvatar: null,
      showCropper: false,
      cropImg: null,
      upconfig: null
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save() {
      this.$api.user.saveProfile(this.form, (res) => {
        alert('保存成功')
        this.$router.go(-1)
      })
    },
    save1(date) {
      this.$refs.menu.save(date)
    },
    onAreaSelected(pname, cname, dname) {
      this.form.province = pname
      this.form.city = cname
      this.form.district = dname
    },

    setImage(e) {
      const file = e.target.files[0]
      if (file.type.indexOf('image/') === -1) {
        alert('请选择图片')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.newAvatar = event.target.result
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result)
        }
        reader.readAsDataURL(file)
        this.showCropper = true
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    showFileChooser() {
      this.$refs.avatarUploader.click()
    },
    confirmCrop() {
      this.showCropper = false
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      //upload
      let self = this
      this.$http
        .get('/api/upconfig/avatar', {})
        .then(function (response) {
          self.upconfig = response
          self.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
            var formData = new FormData()
            formData.append('file', blob, 'avatar.jpg')
            console.log(formData)
            self.uploadAvatar(formData)
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    uploadAvatar: function (formData) {
      formData.append('policy', this.upconfig['policy'])
      formData.append('signature', this.upconfig['signature'])
      var self = this
      var url = 'https://v0.api.upyun.com/' + this.upconfig.bucket + '/'
      axios
        .post(url, formData, {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          transformRequest: [
            function (data) {
              return data
            }
          ],
          onUploadProgress: function (e) {
            var percentage =
              Math.round((e.loaded * 100) / e.total) || 0
            if (percentage <= 100) {
              self.progress = percentage
              // console.log(percentage + '%') // 上传进度
            }
          }
        })
        .then(function (resp) {
          let imgurl = self.upconfig.cdn + resp.data.url
          self.form.avatar = imgurl
          self.onUploaded()
        })
        .catch((e) => {
          alert('上传失败:' + e.message)
          console.log(e)
        })
    },
    onUploaded: function () {
      alert('上传成功')
    }
  },
  computed: {},
  mounted() {
    this.$api.user.getProfile((res) => {
      this.form = res
    })
  },
  components: { AreaSelector, VueCropper }
}
</script>
