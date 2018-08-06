<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Hello world">
    </ActionBar>

    <RadListView :items="items" pullToRefresh="true" @pullToRefreshInitiated="onPullToRefreshInitiated">
			<ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
			<v-template name="header">
				<StackLayout>
					<Label class="h3" text="header" />
				</StackLayout>
			</v-template>
			<v-template name="footer">
				<StackLayout>
					<Label class="h3" text="footer" />
				</StackLayout>
			</v-template>
			<v-template>
        <StackLayout>
          <label v-if="item" :text="item.Title" backgroundColor="White"></label>
				</StackLayout>
			</v-template>
			<v-template if="$odd">
				<StackLayout>
          <label v-if="item" :text="item.Title" backgroundColor="red"></label>
				</StackLayout>
			</v-template>
		</RadListView>

  </Page>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          { Title: 'foo' },
          { Title: 'bar' },
          { Title: 'fizz' },
          { Title: 'buzz' }
        ],
      };
    },
    methods: {
        onPullToRefreshInitiated (args) {
            const listView = args.object;
            console.log('pull to refresh')
            setTimeout(() => {
                this.items = [{ Title: 'abc' }, { Title: 'def' }, { Title: 'lol' }]
                listView.notifyPullToRefreshFinished()
            },2000)
        }
    }
  };
</script>

<style scoped>
  .hello-world {
    margin: 20;
  }
</style>
