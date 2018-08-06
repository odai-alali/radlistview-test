const Vue = require('nativescript-vue')


Vue.registerElement('ListViewGridLayout', () => require('nativescript-ui-listview').ListViewGridLayout);
Vue.registerElement('ListViewLinearLayout', () => require('nativescript-ui-listview').ListViewLinearLayout);
Vue.directive("tkListViewLayout", {
    inserted: function (el) {
        el.parentNode._nativeView.listViewLayout = el._nativeView;
    }
});

const VUE_VIEW = '__vueVNodeRef__'
Vue.registerElement('RadListView', () => require('nativescript-ui-listview').RadListView, {
    component: {
        name: 'rad-list-view',
        props: {
            items: {
                type: [Array, Object],
                required: true
            },
            '+alias': {
                type: String,
                default: 'item'
            },
            '+index': {
                type: String
            }
        },
        template: `
        <native-rad-list-view
          ref="listView" 
          :items="items"
          v-bind="$attrs"
          v-on="listeners" 
          @itemTap="onItemTap"
          @itemLoading="onItemLoading"
        >
          <slot />
        </native-rad-list-view>
      `,
    
        watch: {
            items: {
                handler(newVal) {
                    this.$refs.listView.setAttribute('items', newVal)
                    this.$refs.listView.nativeView.refresh()
                },
                deep: true
            }
        },
    
        created() {
            // we need to remove the itemTap handler from a clone of the $listeners
            // object because we are emitting the event ourselves with added data.
            const listeners = Object.assign({}, this.$listeners)
            delete listeners.itemTap
            this.listeners = listeners
        },
    
        mounted() {
            this.getItemContext = (item, index) =>
                getItemContext(item, index, this.$props['+alias'], this.$props['+index'])
    
    
            this.$refs.listView.setAttribute('items', this.items)
            this.$refs.listView.setAttribute(
                '_itemTemplatesInternal',
                this.$templates.getKeyedTemplates()
            )
    
            this.$refs.listView.setAttribute('_itemTemplateSelector', (item, index) => {
                // console.log('template selector', item)
                return this.$templates.selectorFn(this.getItemContext(item, index))
            })
    
            const availableTemplates = this.$templates.getAvailable()
            this.$refs.listView.setAttribute('itemViewLoader', (itemType) => {
                console.log('item view loader', itemType)
                // todo add other itemTypes
                switch (itemType) {
                    case 'itemview':
                        // return this.$templates.getKeyedTemplate('default').createView()
                        return this.$templates.patchTemplate('default', this.getItemContext(null, null))
                    case 'headerview':
                        if (~availableTemplates.indexOf('header')) {
                            // return this.$templates.getKeyedTemplate('header').createView()
                            return this.$templates.patchTemplate('header', this.getItemContext(null, null))
                        }
                    case 'footerview':
                        if (~availableTemplates.indexOf('footer')) {
                            return this.$templates.patchTemplate('footer', this.getItemContext(null, null))
                        }
                }
            })
        },
    
        methods: {
            onItemTap(args) {
                this.$emit(
                    'itemTap',
                    Object.assign({ item: this.items[args.index] }, args)
                )
            },
            onItemLoading(args) {
                const index = args.index
                const items = args.object.items
    
                const currentItem =
                    typeof items.getItem === 'function'
                        ? items.getItem(index)
                        : items[index]
    
                const name = args.object._itemTemplateSelector(currentItem, index, items)
                const context = this.getItemContext(currentItem, index)
                const oldVnode = args.view && args.view[VUE_VIEW]

                // console.log('context', context)
    
                args.view = this.$templates.patchTemplate(name, context, oldVnode)
            }
        }
    }
});
// module.exports = {
    
// }

function getItemContext(item, index, alias, index_alias) {
    return {
        [alias]: item,
        [index_alias || '$index']: index,
        $even: index % 2 === 0,
        $odd: index % 2 !== 0
    }
}
