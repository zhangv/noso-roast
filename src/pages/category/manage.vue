<template>
	<div>
		<template v-if="currentCategory">
			{{ currentCategory.name }}
			<v-btn @click="addChild(currentCategory)">添加子分类</v-btn>
		</template>
		<v-treeview
			activatable
			hoverable
			v-if="tree"
			open-all
			:items="tree"
			item-value="name"
			expand-icon="mdi-chevron-down"
			collapse-icon="mdi-chevron-right"
		>
			<template v-slot:prepend="{ item, open }">
				<v-icon>
					{{ open ? 'mdi-folder-open' : 'mdi-folder' }}
				</v-icon>
				{{ item.name }}

				<template v-if="item.parent_id > 0">
					<v-icon @click="edit(item)" class="mr-2">$edit</v-icon>
					<v-icon @click="del(item)" class="mr-2">$delete</v-icon>
				</template>
				<v-btn @click="addChild(item)" class="mr-2">添加子分类</v-btn>
			</template>
			<template v-slot:append="{ item, open }"></template>
		</v-treeview>
		<v-dialog v-model="formDlg" transition="slide-x-transition" atransition="dialog-right-transition">
			<v-card>
				<category-form v-model="editingObj" :errors="formErrors">
					<template v-slot:actions="{ object }">
						<v-btn @click="save(object)" color="primary">保存</v-btn>
					</template>
				</category-form>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import { CategoryForm } from '@ui'

export default {
	components: { CategoryForm },
	props: {
		id: { type: String, default: '1' }
	},
	data() {
		return {
			editingObj: null,
			formDlg: false,
			tree: null,
			currentCategory: null,
			formErrors: {}
		}
	},
	computed: {},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			if (this.id) {
				this.getObj(this.id)
			} else {
				this.getObj('')
			}
		},
		showObjs() {
			this.getObj(this.root)
			this.showList = true
		},
		getObj(catid) {
			this.$api.category.getTree(
				catid,
				(response) => {
					this.tree = response.tree
					this.currentCategory = response.category
				},
				(error) => {
					console.log(error)
				}
			)
		},

		edit(obj) {
			this.$api.category.getById(`${obj.id}`, (r) => {
				this.editingObj = r
				this.formDlg = true
			})
		},
		del(obj) {
			this.$confirm(`确定要删除${obj.name}吗？`).then((res) => {
				if (res === true) {
					this.$api.category.remove(obj.id, (r) => {
						alert('删除成功')
						this.load()
					})
				}
			})
		},
		addChild(obj) {
			this.editingObj = {
				parent_id: obj.id
			}
			this.formDlg = true
		},
		save(form) {
			console.log('save', form)
			this.$api.category.update(
				form,
				(r) => {
					console.log('save success', r)
					alert('保存成功')
					this.load()
					this.formDlg = false
					this.editingObj = null
					this.formErrors = {}
				},
				(e) => {
					console.log('err', e)
					this.formErrors = e.data
				}
			)
		}
	}
}
</script>
