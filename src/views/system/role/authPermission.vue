<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="业务名称" prop="business">
        <el-input
          v-model="queryParams.business"
          placeholder="请输入业务名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块名称" prop="module">
        <el-input
          v-model="queryParams.module"
          placeholder="请输入模块名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-checkbox-group v-model="permissionIds">
      <template v-for="group in this.permissionList">
        <el-card>
          <div slot="header" class="card-head" >
            <el-descriptions>
              <el-descriptions-item label="业务">{{group[0].business}}</el-descriptions-item>
              <el-descriptions-item label="模块">{{group[0].module}}</el-descriptions-item>
            </el-descriptions>
          </div>
          <template v-for="permission in group">
            <el-checkbox :key="permission.id"
                         :label="permission.id">
              {{permission.resource}}
            </el-checkbox>
          </template>
        </el-card>
      </template>
    </el-checkbox-group>

  </div>
</template>

<style>
.card-head {
  font-size: 16px;
}

</style>

<script>
  import {listPermission} from "@/api/system/permission";
  import {getRole} from "@/api/system/role";
  import selectUser from "./selectUser";

  export default {
    name: "AuthUser",
    dicts: ['sys_normal_disable'],
    components: {selectUser},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中用户组
        permissionIds: [],
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 权限表格数据
        permissionList: [],
        role: {},
        queryParams: {
          platformType: undefined,
          business:undefined,
          module:undefined
        }
      };
    },
    created() {
      const roleId = this.$route.params && this.$route.params.roleId;
      if (roleId) {
        this.getRole(this.$route.params.roleId).then(res => {
          this.queryParams.platformType = res.platformType;
          this.getList();
        })
      }
    },
    methods: {
      getRole(roleId) {
        return getRole(roleId).then(data => {
          this.role = data;
          var list = []
          var select = data.permissions

          for (var index in select) {
            if (select[index].type !== 'M' && select[index].type !== 'C') {
              list.push(select[index].id);
            }
          }
          this.permissionIds = list;

          this.open = true;
          return data;
        });
      },
      /** 查询授权用户列表 */
      getList() {
        this.loading = true;
        listPermission(this.queryParams).then(response => {
            var list = [];
            var preModule;
            var group = [];
            for (var index in response.rows) {
              if (response.rows[index].type !== 'M' && response.rows[index].type !== 'C') {
                if (response.rows[index].module !== preModule) {
                  if (group.length !== 0) {
                    list.push(group);
                  }

                  preModule = response.rows[index].module;
                  group = [];
                }
                group.push(response.rows[index]);
              }
            }
            if (group.length !== 0) {
              list.push(group);
            }
            this.permissionList = list;
            this.loading = false;
          }
        );
      },
      // 返回按钮
      handleClose() {
        const obj = {path: "/system/role"};
        this.$tab.closeOpenPage(obj);
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.userIds = selection.map(item => item.userId)
        this.multiple = !selection.length
      },
      /** 打开授权用户表弹窗 */
      openSelectUser() {
        this.$refs.select.show();
      },
      /** 取消授权按钮操作 */
      cancelAuthUser(row) {
        const roleId = this.queryParams.roleId;
        this.$modal.confirm('确认要取消该用户"' + row.userName + '"角色吗？').then(function () {
          return authUserCancel({userId: row.userId, roleId: roleId});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("取消授权成功");
        }).catch(() => {
        });
      },
      /** 批量取消授权按钮操作 */
      cancelAuthUserAll(row) {
        const roleId = this.queryParams.roleId;
        const userIds = this.userIds.join(",");
        this.$modal.confirm('是否取消选中用户授权数据项？').then(function () {
          return authUserCancelAll({roleId: roleId, userIds: userIds});
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("取消授权成功");
        }).catch(() => {
        });
      }
    }
  };
</script>
