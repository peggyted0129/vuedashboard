<template>
  <div>
    <Loading :active.sync="isLoading"></Loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ item.due_date | date }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未起用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm"
              @click="openCouponModal(false, item)"
            >編輯</button>
            <button class="btn btn-danger btn-sm" @click="deleteModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!---優惠券Modal--->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title" v-model="tempCoupon.title"
                placeholder="請輸入標題">
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input type="text" class="form-control" id="coupon_code" v-model="tempCoupon.code"
                placeholder="請輸入優惠碼">
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" id="due_date"
                v-model="due_date">
            </div>
            <div class="form-group">
              <label for="price">折扣百分比</label>
              <input type="number" class="form-control" id="price"
                v-model="tempCoupon.percent" placeholder="請輸入折扣百分比">
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  v-model="tempCoupon.is_enabled" id="is_enabled">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary"
              @click="updateCoupon">更新優惠券</button>
          </div>
        </div>
      </div>
    </div>
    <!--刪除優惠券Modal-->
      <div class="modal fade" id="deleteCouponModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除產品</span>
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
            </div>
          </div>
      </div>
      </div>

  </div>
</template>

<script>
import $ from 'jquery';
export default {
  props: {
    config: Object,
  },
  data() {
    return {
      coupons: {},   // 從遠端撈回來的優惠券內容
      tempCoupon: {  // 新增送出的優惠券資料內容
        title: '',
        is_enabled: 0,
        percent: 100,   // 若無提供此欄位，預設為100
        due_date: 0,
        code: '',
      },
      due_date: new Date(),  // 到期日 = Sat Oct 31 2020 08:00:00 GMT+0800 (台北標準時間)
      isNew: false,          // 判斷資料是 "新增true" 還是 "編輯false"
      isLoading: false,      // loading預設為停用狀態
    };
  },
  watch: {
    due_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      vm.tempCoupon.due_date = timestamp;
    },
  },
  methods: {
    getCoupons() {    // 取得優惠券
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons`;
      vm.isLoading = true;     // Loading套件啟用
      this.$http.get(url).then((response) => {
        console.log(response);
        vm.isLoading = false;  // Loading套件停用
        vm.coupons = response.data.coupons;
      });
    },
    openCouponModal(isNew, item) {   // 新增優惠券
      const vm = this;
      $('#couponModal').modal('show');
      vm.isNew = isNew;
      if (vm.isNew) {   // 若vm.isNew是新的，則vm.tempCoupon為空物件
        vm.tempCoupon = {};
      } else {
        vm.tempCoupon = Object.assign({}, item);  // 使用assign()方法，把item值傳入空物件 (避免互相傳參考)
        const dateAndTime = new Date(vm.tempCoupon.due_date * 1000).toISOString().split('T');
        vm.due_date = dateAndTime[0];  // (編輯)打開modal時，due_date欄位直接顯示當初選擇的到期日
      }
    },
    updateCoupon() {
      const vm = this;
      if (vm.isNew) {   // 若為新增，純粹新增優惠券
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
        this.$http.post(url, { data: vm.tempCoupon }).then((response) => {
          console.log(response, vm.tempCoupon);
          $('#couponModal').modal('hide');
          this.getCoupons();
        });
      } else {
        const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        vm.due_date = new Date(vm.tempCoupon.due_date * 1000);
        this.$http.put(url, { data: vm.tempCoupon }).then((response) => {
          console.log(response);
          $('#couponModal').modal('hide');
          this.getCoupons(); 
        });
      }
    },
    deleteModal(item){
      this.tempCoupon = item;
      $('#deleteCouponModal').modal('show');
    },
    deleteCoupon() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
      this.$http.delete(api).then((response) => {
        console.log(response.data);
        vm.getCoupons();
        $('#deleteCouponModal').modal('hide');
      });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
