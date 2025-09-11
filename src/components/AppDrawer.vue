<template>
	<v-navigation-drawer :rail="rail" permanent width="120" rail-width="76" style="position: fixed; top: 64px">
		<v-list density="compact">
			<v-list-item link dense title="" class="d-flex justify-start" subtitle="" @click="rail = !rail">
				<Icon v-if="rail" icon="mdi-chevron-right"></Icon>
				<Icon v-else icon="mdi-chevron-left"></Icon>
			</v-list-item>
			<!-- <v-divider></v-divider> -->
			<template v-for="item in items">
				<v-list-item link v-if="!item.items" class="pl-0xx" @click="$router.push(item.to)">
					<div class="d-flex flex-row align-center">
						<!-- <template #prepend="{}">
              <Icon :icon="item.icon" :style="{ color: item.color || 'inherit' }" width="1.4rem" />
            </template> -->
						<Icon :icon="item.icon" :style="{ color: item.color || 'inherit' }" width="1.4rem" />
						<span v-if="!rail">
							{{ item.title }}
						</span>
					</div>
				</v-list-item>
				<v-list-group v-else :value="item.to" density="compact">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props" class="" style="max-width: 200px">
							<div class="d-flex flex-row align-center">
								<Icon :icon="item.icon" :style="{ color: item.color || 'inherit' }" width="1.4rem" />
								<span v-if="!rail">
									{{ item.title }}
								</span>
							</div>
						</v-list-item>
					</template>
					<template v-for="sub in item.items">
						<v-list-item link @click="$router.push(sub.to)" class="">
							<div class="d-flex flex-row align-center">
								<Icon :icon="sub.icon" :style="{ color: sub.color || 'inherit' }" width="1.4rem" />
								<span v-if="!rail">
									{{ sub.title }}
								</span>
							</div>
						</v-list-item>
					</template>
				</v-list-group>
			</template>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
export default {
	components: {},
	props: {},
	mounted() {},
	data() {
		const menu = this.$soul.menu
		return {
			items: menu,
			rail: false,
			admins: [
				['Management', 'mdi-account-multiple-outline'],
				['Settings', 'mdi-cog-outline']
			],
			cruds: [
				['Create', 'mdi-plus-outline'],
				['Read', 'mdi-file-outline'],
				['Update', 'mdi-update'],
				['Delete', 'mdi-delete']
			]
		}
	},

	computed: {},

	watch: {},

	created() {},

	methods: {
		goTo(to) {
			this.$router.push(to)
		}
	}
}
</script>

<style>
.v-list-item__append {
	max-width: 24px !important;
	width: 24px !important;
	padding: 0;
	margin: 0;
	display: unset !important;
}

.v-navigation-drawer {
	z-index: 1000;
}
</style>
