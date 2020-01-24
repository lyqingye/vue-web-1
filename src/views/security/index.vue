<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <el-row>
            <el-col :span="22">
              <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="菜单父节点">
                  <el-select v-model="value" placeholder="请选择父节点">
                    <el-option v-for="item in form.options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="菜单名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="组件名称">
                  <el-select v-model="value" placeholder="请选择父节点">
                    <el-option v-for="item in form.components" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>

                </el-form-item>
                <el-form-item label="路由地址">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="重定向">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标">
                  <el-col :span="11">
                    <el-input v-model="form.icon">
                    </el-input>
                  </el-col>
                  <el-col :span="11" style="margin-left: 20px;">
                    <el-button type="primary" icon="el-icon-plus" size="medium" @click="dialogTableVisible = true"></el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="即时配送" prop="delivery">
                  <el-switch v-model="form.name"></el-switch>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="8" :offset="1">
         <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <el-row>
            <el-col :span="22">
              <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="菜单父节点">
                  <el-select v-model="value" placeholder="请选择父节点">
                    <el-option v-for="item in form.options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="菜单名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="组件名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="路由地址">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="重定向">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标">
                  <el-col :span="11">
                    <el-input v-model="form.icon">
                    </el-input>
                  </el-col>
                  <el-col :span="11" style="margin-left: 20px;">
                    <el-button type="primary" icon="el-icon-plus" size="medium" @click="dialogTableVisible = true"></el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="即时配送" prop="delivery">
                  <el-switch v-model="form.name"></el-switch>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
      <iconPicker v-on:picked-icon="onSelectIcon">

      </iconPicker>
    </el-dialog>
  </div>
</template>

<script>
  import iconPicker from '@/components/IconPicker'
  import { componentMap } from '@/router'
  export default {
    components: {
      iconPicker
    },
    data() {
      return {
        dialogTableVisible: false,
        value: null,
        form: {
          icon: '',
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }],
          components: Array.from(componentMap.keys()).map(v => {
            return {
              label: v,
              value: v
            }
          })
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      onSelectIcon(item) {
        this.form.icon = item
        this.dialogTableVisible = false
      }
    }
  }
</script>
