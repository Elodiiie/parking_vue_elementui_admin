<template>
  <div class="app-container documentation-container" />
</template>

<script>

export default {
  name: 'FeedbackDocu',
  data() {
    return {
      articleList: [
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    padding: 0 16px;
    margin: 16px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }

}
</style>
