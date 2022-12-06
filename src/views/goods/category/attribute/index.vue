<template>
  <div class="app-container ">
    <div class="main">
      <div/>
      <div class="center">
        <div/>
        <div class="context">
          <el-input
            v-model="code"
            placeholder="请输入三级产品编码"
            clearable
            @keyup.enter.native="handleQuery"
            class="input"
          />
          <el-button type="primary"
                     class="botton"
                     icon="el-icon-search"  size="mini" @click="handleQuery">搜索</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getCategoryByCode
  } from "@/api/goods/category";
  import {Message} from "element-ui";

  export default {
    name: "index_attr",
    data() {
      return {
        // 查询参数
        code: null,
        rules: {
          code: [{
            required: true,
            message: '请输入分类编码',
            trigger: 'blur'
          }]
        },
      };
    },
    methods: {
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 修改按钮操作 */
      handleQuery() {
        var code = this.code;

        if (code == null) {
          return;
        }

        code = code.replace(/\s+/g,"");
        if (code === '' ) {
          this.code = null;
          return;
        }

        var reg = new RegExp("^[0-9]*$");
        if (reg.test(code)) {
          getCategoryByCode(code).then(response => {
            const code = response.code;
            this.$router.push("/goods/goods-category/attribute/" + code);
          });
        } else {
          Message({
            message: '商品分类编码格式错误',
            type: 'error'
          })
        }

      }

    }
  };
</script>

<style scoped>
  .main {
    display: grid;
    width: 100%;
    grid-template-rows: 600px;
    grid-template-columns: 300px auto 300px;
  }

  .center {
    display: grid;
    width: 100%;
    grid-template-rows:  200px auto 100px;
  }

  .context {
    display: flex;
    justify-content: center;
  }

  div >>> .el-input > input{
    height: 40px;
    border-radius: 15px;
    font-size: 1.2em;
    padding: 5px 30px;
  }

  .input {
    width: 60%;
  }

  .botton {
    height: 40px;
    border-radius: 15px;
  }


</style>
