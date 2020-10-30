<template>
  <div>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="{ 'disabled' : !childpagination.has_pre }">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="getPage(childpagination.current_page-1)">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" v-for="page in childpagination.total_pages" :key="page"
           :class="{ 'active' : childpagination.current_page === page }">
            <a class="page-link" href="#" @click.prevent="getPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ 'disabled' : !childpagination.has_next }">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="getPage(childpagination.current_page+1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  // 接受外部傳入之資料 (pagination)
  // 利用 props 將資料傳給 Components 使用 (父元件 → 子元件)
  props: ['childpagination'], // 定義來接收 (父層)的 pagination 參數值
  data () {
    return {
    }
  },
  methods: {
    getPage(page) {
      // 利用 emit 將 Components 的資料回傳 (子元件 → 父元件)
      //           事件名稱    , 傳出去的參數
      this.$emit("childProducts", page);
    }
  },
}
</script>
