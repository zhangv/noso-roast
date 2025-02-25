<template>
	<div>
		<slot name="selection" v-bind="{ selected }" v-if="showSelection">
			<v-chip v-for="(u, i) in selected" :key="i">
				{{ u.name }}({{ u.code }})
				<v-btn @click="unselect(u.id)" text color="error"><v-icon>$delete</v-icon></v-btn>
			</v-chip>
		</slot>

		<v-btn @click="show = true">
			<slot name="default"> 选择 </slot>
		</v-btn>
		<v-dialog v-model="show" max-width="600px">
			<v-card>
				<v-card-title v-if="multiple">
					<v-btn color="primary" @click="confirm">确定</v-btn>
					<v-chip v-for="(u, i) in selected" :key="i">
						{{ u.nickname }}({{ u.id }})
						<v-btn @click="unselect(u.id)" text color="error"><v-icon>$delete</v-icon></v-btn>
					</v-chip>
				</v-card-title>
				<bean-batch-list ref="userlist" :headers="headers">
					<template v-slot:actions="{ item }">
						<v-btn @click="select(item)">选择</v-btn>
					</template>
				</bean-batch-list>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import BeanBatchList from './BeanBatchList.vue'
export default {
	props: {
		beanId: { type: [Number, String], default: null },
		multiple: { type: Boolean, default: false },
		showSelection: { type: Boolean, default: true }
	},
	components: { BeanBatchList },
	data() {
		return {
			selected: [],
			show: false,
			headers: [
				{ text: '#', value: 'id' },
				{
					text: '名称',
					align: 'left',
					sortable: true,
					value: 'name'
				},
				{ text: '类型', value: 'type' },
				{ text: '状态', value: 'status' },
				{
					text: '',
					align: 'left',
					sortable: false,
					value: 'action'
				}
			],
		}
	},
	mounted() { },
	computed: {
		selectedIds() {
			return this.selected.map((e) => e.id)
		}
	},
	watch: {},
	methods: {
		select(item) {
			let idx = this.selected.findIndex((e) => e.id === item.id)
			if (idx >= 0) {
				alert(`${item.nickname}(${item.id})已选择`)
			} else {
				if (this.multiple === false) {
					this.selected = []
				}
				this.selected.push(item)

				// this.$emit('selected', this.selectedIds, this.selected)
				if (this.multiple === false) {
					this.confirm()
				}
			}
		},
		unselect(uid) {
			let idx = this.selected.findIndex((e) => e.id === uid)
			if (idx >= 0) {
				this.selected.splice(idx, 1)
			}
			if (this.multiple === false && this.selected.length == 1) {
				this.confirm()
			}
		},
		confirm() {
			this.$emit('selected', this.selectedIds, this.selected)
			this.show = false
		},
		clear() {
			this.selected = []
		}
	}
}
</script>

<style scoped></style>
