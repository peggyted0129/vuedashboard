<template>
  <div>
    <Navbar/>
    <Alert/>
    <div class="container-fluid">
      <div class="row">
        <Sidebar></Sidebar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Alert from './AlertMessage';

export default {
  components: {
      Sidebar,
      Navbar,
      Alert,
  },
  created() {  // 把cookie取出 (有多一個反斜線要刪除)
    const myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    console.log('myCookie', myCookie);
    this.$http.defaults.headers.common.Authorization = myCookie;
  }
};
</script>



