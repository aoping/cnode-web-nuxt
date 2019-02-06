<template>
  <el-container class="home">
    <el-main style="padding: 10px 0;word-wrap: break-word;">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="版块" prop="tab">
          <el-select v-model="ruleForm.tab" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <Markdown :initialValue="ruleForm.content" @commitValue="commitValue"/>
        </el-form-item>
      </el-form>
    </el-main>
    <el-aside width="400px" style="padding: 10px 0;margin-left: 50px;">xxxx</el-aside>
  </el-container>
</template>

<script>
import { createTopics } from '@/api'
import { mapState } from 'vuex'
import Markdown from '@/components/markdown'
export default {
  async asyncData({ params }) {},
  created() {
    // this.getTopics()
  },
  data() {
    return {
      options: [
        {
          value: 'share',
          label: '分享'
        },
        {
          value: 'ask',
          label: '问答'
        },
        {
          value: 'job',
          label: '招聘'
        },
        {
          value: 'dev',
          label: '客户端测试'
        }
      ],
      ruleForm: {
        tab: '',
        title: '',
        content: ''
      },
      rules: {
        tab: [
          {
            required: true,
            min: 0,
            max: 10,
            message: '请选择版块',
            trigger: 'change'
          }
        ],
        title: [
          {
            required: true,
            min: 5,
            max: 100,
            message: '长度在 5 到 100 个字符',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            min: 10,
            max: 10000,
            message: '至少 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    Markdown
  },
  methods: {
    async commitValue(val) {
      console.log(this.ruleForm)
      console.log(val)
      this.ruleForm.content = val
      try {
        const result = await this.$refs.ruleForm.validate()
        console.log(result)
        if (result) {
          console.log(this.userInfo)
          let { tab, title, content } = this.ruleForm
          const res = await createTopics(
            this.userInfo.accesstoken,
            tab,
            title,
            content
          )
          console.log(res)
          if (res && res.success) {
            this.$router.push('/')
          } else {
            this.$message.error('提交失败')
          }
        } else {
          this.$message.error('校验不通过，请检查所填字段')
        }
      } catch (e) {
        this.$message.error('校验不通过，请检查所填字段')
      }
    }
  },
  watch: {}
}
</script>

<style scoped>
.el-header {
  line-height: 60px;
  background-color: #f6f6f6;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: solid 1px #e6e6e6;
}
.title {
  margin: 0;
  display: inline-block;
  margin-left: 20px;
}
.desc {
  display: inline-block;
  margin: 0;
  color: #838383;
  font-size: 12px;
  line-height: 20px;
}
.replyto {
  float: right;
  color: #08c;
}
@media screen and (max-width: 980px) {
  .el-aside {
    display: none;
  }
}
</style>
