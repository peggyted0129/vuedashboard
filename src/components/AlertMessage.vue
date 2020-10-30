<template>
  <div class="message-alert">
    <div class="alert alert-dismissible"
      :class="'alert-' + item.status"
      v-for="(item, i) in messages" :key="i">
      {{ item.message }}
      <button type="button" class="close" @click="removeMessage(i)" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data() {
    return {
      messages: [{  // 將 message 一一呈列出來。是一個陣列，會傳入物件。
        // message: '訊息內容',  // 文字內容
        // status: 'danger',    // 樣式 (追隨BS樣式)
        // timestamp: '123',   
      }],  
    };
  },
  methods: {
    updateMessage(message, status) {  // 從外部傳進來的訊息才會自動移除
      const timestamp = Math.floor(new Date() / 1000);
      this.messages.push({  // 傳入的參數
        message,
        status,
        timestamp,
      });
      this.removeMessageWithTiming(timestamp); // 觸發把自己移除的函式
    },
    removeMessage(num) {     // 按叉叉的地方
      this.messages.splice(num, 1);
    },
    removeMessageWithTiming(timestamp) {  // 把自己移除的函式
      const vm = this;
      setTimeout(() => {   // 每當5秒一到，把自己的訊息移除
        vm.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1);
          }
        });
      }, 5000);
    },
  },
  created() {  // 開始載入資料就執行
    const vm = this;
    // 自定義名稱 'messsage:push'
    // message: 傳入參數，為字串
    // status: BS樣式，預設值為 warning
    // 直接呼叫Vue實體下的bus，這個bus指的是掛載在Vue原型下的一個變數 $bus，用$on方式註冊'messsage:push'的方法。
    vm.$bus.$on('message:push', (message, status = 'warning') => {
      vm.updateMessage(message, status);   // 觸發updateMessage()方法
    });
    // vm.$bus.$emit('messsage:push');  // 內層使用$emit觸發。 外層使用$on註冊
  },
};
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>