import { defineComponent, PropType } from 'vue';
import { RouterView } from 'vue-router';
export const Search = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
     <RouterView />
    )
  }
})
export default Search