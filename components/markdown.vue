<template>
  <div class="textarea-wrapper" v-show="SimpleMDE" ref="markdown">
    <textarea ref="textarea"></textarea>
    <div>
      <p
        class="reply-btn"
        :class="{active: isCommit}"
        @click="reply"
      >{{ isCommit ? activeText : commitText }}</p>
    </div>
  </div>
</template>

<script>
// style标签加了scoped启用了作用域，通过import的方式就可以匹配到对应的cover样式了
// import '~/assets/css/simplemdecover.styl'

export default {
  name: 'markdown',
  props: {
    commitText: {
      type: String,
      default: '提交'
    },
    activeText: {
      type: String,
      default: '提交中...'
    },
    isCommit: {
      // 是否正在提交
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Try here...'
    },
    initialValue: {
      // markdown初始值
      type: String,
      default: ''
    },
    height: Number // markdown编辑器的高度
  },
  data() {
    return {
      markdown: null,
      SimpleMDE: null
    }
  },
  mounted() {
    // 因为SimpleMDE依赖了浏览器的api，在做服务端渲染时会报错，需要动态引入SimpleMDE
    this.SimpleMDE = require('simplemde')
    this.initMarkdown()

    // 覆盖样式
    if (this.height) {
      // 限制在当前组件实例内查找
      let markdown = this.$refs.markdown
      markdown.getElementsByClassName(
        'CodeMirror'
      )[0].style.cssText = `min-height: ${this.height}px!important;height: ${
        this.height
      }px!important;`
      markdown.getElementsByClassName(
        'CodeMirror-scroll'
      )[0].style.cssText = `min-height: ${this.height}px!important;height: ${
        this.height
      }px!important;`
    }
  },
  methods: {
    initMarkdown() {
      this.markdown = new this.SimpleMDE({
        element: this.$refs.textarea,
        status: false,
        placeholder: this.placeholder,
        initialValue: this.initialValue
      })
    },
    reply() {
      let value = this.markdown.value()
      this.$emit('commitValue', value)
    },
    getValue() {
      return this.markdown && this.markdown.value()
    },
    getMarkdown() {
      return this.markdown && this.markdown.markdown(this.getValue())
    },
    clear() {
      this.markdown && this.markdown.value('')
    }
  }
}
</script>

<style lang="less" scoped>
@import 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css';

.textarea-wrapper {
  padding: 10px 10px;
  background-color: #ffffff;
  border-radius: 0 0 3px 3px;

  .title {
    padding: 10px;
    line-height: 20px;
    color: #444444;
    font-size: 14px;
    border-radius: 3px 3px 0 0;
    background-color: #f6f6f6;
  }

  .reply-btn {
    width: 100%;
    font-size: 14px;
    text-align: center;
    background-color: #08c;
    color: #ffffff;
    border-radius: 3px;
    padding: 3px 0px;
    display: inline-block;
    line-height: 2em;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &.active {
      background-color: #05c;
    }

    &:hover {
      background-color: #05c;
    }
  }
}
</style>
