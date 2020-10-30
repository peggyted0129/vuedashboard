<template>
  <div>
     <loading :active.sync="isLoading"></loading>
     <div class="text-right mt-4">
       <button class="btn btn-primary" @click="openModal(true)">建立新產品</button>
     </div>
     <table class="table mt-4">
       <thead>
         <tr>
           <th width="120">分類</th>
           <th>產品名稱</th>
           <th width="120">原價</th>
           <th width="120">售價</th>
           <th width="100">是否啟用</th>
           <th width="120">編輯</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="(item) in products" :key="item.id">
           <td>{{ item.category }}</td>
           <td>{{ item.title }}</td>
           <td class="text-right">{{ item.origin_price | currency }}</td>
           <td class="text-right">{{ item.price | currency }}</td>
           <td>
             <!--產品啟用 is_enabled == 1--->
             <span v-if="item.is_enabled" class="text-success">啟用</span>
             <span v-else>未啟用</span>
           </td>
           <td>
             <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
             <button class="btn btn-danger btn-sm" @click="deleteModal(item)">刪除</button>
           </td>
         </tr>
       </tbody>
      </table>
      <!-- Pagniation -->
      <Pagination :childpagination="pagination" @childProducts="getProducts"></Pagination>
      <!-- <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="{ 'disabled' : !pagination.has_pre }">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pagination.current_page-1)">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item" v-for="page in pagination.total_pages" :key="page"
           :class="{ 'active' : pagination.current_page === page }">
            <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ 'disabled' : !pagination.has_next }">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pagination.current_page+1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav> -->
      <!--Modal-->
      <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>新增產品</span>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <label for="image">輸入圖片網址</label>
                <input type="text" v-model="tempProduct.imageUrl" class="form-control" id="image"
                  placeholder="請輸入圖片連結">
              </div>
              <div class="form-group">
                <label for="customFile">或 上傳圖片
                  <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                </label>
                <input type="file" id="customFile" class="form-control"
                  ref="files" @change = "uploadFile">
              </div>
              <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80" :src="tempProduct.imageUrl"
                class="img-fluid" alt="">
            </div>
            <div class="col-sm-8">
              <div class="form-group">
                <label for="title">標題</label>
                <input type="text" class="form-control" id="title" v-model="tempProduct.title"
                  placeholder="請輸入標題">
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="category">分類</label>
                  <input type="text" class="form-control" id="category" v-model="tempProduct.category"
                    placeholder="請輸入分類">
                </div>
                <div class="form-group col-md-6">
                  <label for="price">單位</label>
                  <input type="unit" class="form-control" id="unit"  v-model="tempProduct.unit"
                    placeholder="請輸入單位">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                  <input type="number" class="form-control" id="origin_price" v-model="tempProduct.origin_price"
                    placeholder="請輸入原價">
                </div>
                <div class="form-group col-md-6">
                  <label for="price">售價</label>
                  <input type="number" class="form-control" id="price" v-model="tempProduct.price"
                    placeholder="請輸入售價">
                </div>
              </div>
              <hr>

              <div class="form-group">
                <label for="description">產品描述</label>
                <textarea type="text" class="form-control" id="description" v-model="tempProduct.description"
                  placeholder="請輸入產品描述"></textarea>
              </div>
              <div class="form-group">
                <label for="content">說明內容</label>
                <textarea type="text" class="form-control" id="content" v-model="tempProduct.content"
                  placeholder="請輸入產品說明內容"></textarea>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="tempProduct.is_enabled" :true-value="1" :false-value="0"
                    id="is_enabled">
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
        </div>
      </div>
    </div>
      </div>
      <!--刪除商品Modal-->
      <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
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
              是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger" @click="deleteProduct">確認刪除</button>
            </div>
          </div>
      </div>
      </div>
     
</div> 
</template> 

<script>
import $ from 'jquery';  // 注入jquery套件
import Pagination from '../Pagination';  // 載入Pagination模板

export default {
  data() {
    return {
      products: [],    // 把遠端撈回來的內容存在此變數內
      pagination: {},  // 存入分頁資訊並使用 prop:['childpagination']傳給子層
      tempProduct: {}, // 送出的欄位內容
      isNew: false,    // 判斷資料是 "新增true" 還是 "編輯false"
      isLoading: false,  // loading預設為停用狀態
      status: {
        fileUploading: false,
      },
    };
  },
  components: {
    Pagination
  },
  methods: {
    getProducts(page = 1) {  // 取得遠端資料的方法。 預設值會帶入第1頁，有帶入參數就取代page
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
      const vm = this; // 確保在http結束後，把取回來的資料存回vm裡
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      vm.isLoading = true;        // Loading套件啟用
      this.$http.get(api).then((response) => {
           console.log(response.data);
           vm.isLoading = false;  // Loading套件停用
           vm.products = response.data.products; //要留意變數是否儲存正確
           vm.pagination = response.data.pagination; // 把pagination分頁資訊記錄在(父層)裡的data
      });
    },
    openModal(isNew, item) {  // 決定這份資料是新的還是舊的，可以傳入參數。 item 參數在按下"編輯"後傳入
      if(isNew){  // 如果為新增
        this.tempProduct = {};   // this.tempProduct為空物件
        this.isNew = true;       // this.isNew是新的
      } else {
        this.tempProduct = Object.assign({}, item);   //如果直接=item物件傳參考的特性，兩個值會一樣。 使用assign()方法，把item值傳入空物件。 避免tempProduct和item兩者互相有傳參考特性
        this.isNew = false;
      }
      $('#productModal').modal('show')
    },
    updateProduct() {  // 商品建立新增
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
      let httpMethod = 'post';  // 預設為http
      const vm = this; // 確保在http結束後，把取回來的資料存回vm裡
      if(!vm.isNew) {  // if isNew不是新的 (編輯) ， 要更改api路徑
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod = 'put';
      }
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      this.$http[httpMethod](api, {data: vm.tempProduct}).then((response) => {
            console.log(response.data);
          //  vm.products = response.data.products;  // 這行拿掉。不然又把response.data又寫回去
            if(response.data.success){  // 新增成功，就把modal視窗關閉
              $('#productModal').modal('hide')
              vm.getProducts();//並且重新取得遠端產品內容
            } else {
              $('#productModal').modal('hide')
              vm.getProducts();
              console.log('新增失敗');
            }
      });
    },
    deleteModal(item){
      this.tempProduct = item;
      $('#delProductModal').modal('show')
    },
    deleteProduct() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
      this.$http.delete(api).then((response) => {
        console.log(response.data);
        vm.getProducts();
        $('#delProductModal').modal('hide');
      });
    },
    uploadFile() {
      console.log(this);  // 觀察 this 是什麼，找出存放圖片的位置
      const uploadedFile = this.$refs.files.files[0];  // 先把檔案位置取出
      const vm = this;
      const formData = new FormData();  // 建立formData物件
      formData.append('file-to-upload', uploadedFile); // 使用append加入方式將圖片上傳
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;// 定義路徑
      vm.status.fileUploading = true;  // 按下去時是true
      this.$http.post(url, formData, {    // 傳送的內容為formData的本身。 後面帶上物件，將格式改為formData的格式，要做一些調整。
         headers: {
           'Content-Type': 'multipart/form-data'  //將表單格式改為formData
         }  
      }).then((response) => {
            console.log(response.data);  
            vm.status.fileUploading = false;  // AJAX結束後變false
            if(response.data.success){  // 若回傳上傳圖片成功，就把網址寫入
              // vm.tempProduct.imageUrl = response.data.imageUrl;  // 把圖片路徑存下
              // console.log(vm.tempProduct);  // 檢查是否有正確寫入
              vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);           
            } else {
              this.$bus.$emit('message:push', response.data.message, 'danger');  // 'danger'是狀態 (跟隨BS樣式)
              // 直接透過'message:push'方法觸發外層的alert
              // this指的是 Vue 實體。換句話說就是「使用 Vue() 建構式來建立的物件」。
            }
       })
    },
  },
  created() {  // 觸發getProducts()事件
    this.getProducts();
  },

}
</script>

