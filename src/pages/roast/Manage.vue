<template>
	<div>
		<v-card-title class="d-flex align-center">
			烘焙管理
			<v-icon color="primary" @click="start">$plus</v-icon>
			<v-icon color="info" @click="load">$reload</v-icon>
			<v-btn text @click="goTo(`recipemanage`)">配方管理</v-btn>
		</v-card-title>
		<RoastList ref="thelist" show-select :single-select="false" :init-query.sync="query" :headers="headers">
			<template v-slot:batchActions="{ selected }"></template>
			<template v-slot:actions="{ item }">
				<v-icon class="mr-2" @click="profile(item)">$edit</v-icon>
				<template v-if="item.status === 'start'">
					<v-btn classs="mr-2" @click="complete(item)">完成</v-btn>
					<v-btn classs="mr-2" @click="cancel(item)">取消</v-btn>
					<v-icon class="mr-2" @click="del(item)" color="error">$delete</v-icon>
				</template>
				<template v-if="item.status === 'complete'">
					<v-btn classs="mr-2" @click="cupping(item)">杯测</v-btn>
					<v-btn classs="mr-2" @click="saveRecipe(item)">保存配方</v-btn>
				</template>
			</template>
		</RoastList>
		<v-dialog v-model="startDlg">
			<v-card>
				<start-form v-model:value="startForm" :errors="startErrors">
					<template #actions="{ object }">
						<v-card-actions>
							<v-btn v-debounce color="primary" large @click="confirmStart(object)">开始</v-btn>
						</v-card-actions>
					</template>
				</start-form>
			</v-card>
		</v-dialog>
		<v-dialog v-model="profileDlg">
			<v-card>
				<profile-form v-model:roastId="profileId" :errors="profileErrors">
					<template #actions="{ object }">
						<v-card-actions class="justify-center">
							<v-btn variant="outlined" size="large" v-debounce @click="profileDlg = false">取消</v-btn>
							<v-btn
								variant="elevated"
								size="large"
								v-debounce
								color="primary"
								large
								@click="confirmProfile(object)"
							>
								确认保存
							</v-btn>
						</v-card-actions>
					</template>
				</profile-form>
			</v-card>
		</v-dialog>
		<v-dialog v-model="completeDlg">
			<v-card>
				<v-card-title>完成烘焙</v-card-title>
				<v-card-subtitle>
					<template v-if="completeRoast">
						{{ completeRoast.name }}
						<v-chip color="warning">{{ completeRoast.inqty }} 克</v-chip>
					</template>
				</v-card-subtitle>
				<v-card-text>
					<complete-form v-model:value="completeForm" :errors="completeErrors">
						<template #actions="{ object }">
							<v-btn v-debounce @click="confirmComplete(object)">完成</v-btn>
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
		<v-dialog v-model="cuppingDlg">
			<v-card>
				<v-card-title>杯测</v-card-title>
				<v-card-text>
					<cupping-form v-model:value="cuppingObj" :errors="cuppingErrors">
						<template #actions="{ object }">
							<v-btn v-debounce @click="confirmCupping(object)">确认</v-btn>
						</template>
					</cupping-form>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import {
	BeanSelector,
	RoastList,
	RoastStartForm as StartForm,
	RoastCompleteForm as CompleteForm,
	RoastProfileForm as ProfileForm,
	CuppingForm
} from '@ui'
import qs from 'qs'

export default {
	components: {
		RoastList,
		BeanSelector,
		StartForm,
		CompleteForm,
		ProfileForm,
		CuppingForm
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
			completeRoast: null,
			detailId: null,
			detailDlg: false,
			detailObj: {},
			headers: [
				{ title: '#', sortable: true, value: 'id' },
				{ title: '名称', align: 'left', sortable: true, value: 'name' },
				{ title: '生豆', value: 'bean_id' },
				{ title: '重量', sortable: true, value: 'inqty' },
				{ title: '开始时间', sortable: true, value: 'starttime' },
				{ title: '状态', sortable: true, value: 'status' },
				{
					title: '',
					align: 'left',
					sortable: false,
					value: 'action'
				}
			],
			cuppingDlg: false,
			cuppingObj: {},
			cuppingErrors: {}
		}
	},
	mounted() {
		this.load()
	},
	computed: {},
	watch: {},
	methods: {
		saveRecipe(roast) {
			this.$api.roast.saveRecipe(
				roast.id,
				(r) => {
					alert('保存成功')
				},
				(err) => {
					alert(err.message)
				}
			)
		},
		cupping(roast) {
			this.cuppingDlg = true
			this.cuppingObj = {
				roast_id: roast.id,
				date: roast.date,
				location: '烘焙室',
				method: 'standard',
				status: 'valid',
				description: '烘焙完成',
				samples: [
					{
						bean_id: roast.bean_id,
						bean: roast.bean,
						beanbatch_id: roast.bean_batch_id,
						beanbatch: roast.beanbatch,
						beanqty: 10,
						grindsize: '?',
						watertemp: 92,
						extractionyield: '?',
						method: 'standard',
						triangle: '?'
					}
				]
			}
		},
		start() {
			this.startDlg = true
			this.startForm = {}
			this.startErrors = {}
		},
		confirmStart(form) {
			this.$api.roast.start(
				form,
				(r) => {
					this.load()
					this.startDlg = false
				},
				(err) => {
					this.startErrors = err.data
				}
			)
		},
		confirmCupping(form) {
			this.$api.cupping.update(form, (r) => {
				this.load()
				this.cuppingDlg = false
			})
		},

		load() {
			this.$refs.thelist.load()
		},
		detail(roast) {
			this.detailDlg = true
			this.$api.roast.getById(roast.id, (r) => {
				this.detailObj = r
			})
		},
		profile(item) {
			this.profileDlg = true
			this.profileId = item.id
		},
		confirmProfile(form) {
			form.roast_id = this.profileId
			this.$api.roast.updateProfile(
				form,
				(r) => {
					this.profileDlg = false
					this.load()
				},
				(e) => {
					this.profileErrors = e.message
				}
			)
		},
		complete(roast) {
			this.completeRoast = roast
			this.completeDlg = true
			this.completeForm = {
				id: roast.id,
				inqty: roast.inqty
			}
		},
		confirmComplete(form) {
			this.$api.roast.complete(
				form,
				(r) => {
					this.load()
					this.completeDlg = false
				},
				(e) => {
					this.completeErrors = e.data
				}
			)
		},
		cancel(roast) {
			this.$confirm('确定要取消吗？').then((r) => {
				if (r) {
					this.$api.roast.cancel(
						roast.id,
						(r) => {
							this.load()
						},
						(e) => {
							alert(e.message)
						}
					)
				}
			})
		},

		del(item) {
			this.$confirm('确定要删除吗？').then((r) => {
				if (r === true) {
					let id = item.id
					this.$http.get(`/cupping/delete/` + id).then((data) => {
						this.load()
					})
				}
			})
		}
	}
}
</script>

<style scoped></style>
