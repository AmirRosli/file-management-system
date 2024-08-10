<template>
  <div id="app">
    <div class="title-container">
    <h1>File Management System</h1>
  </div>
    <div class="upload-container">
    <UploadFile @file-uploaded="fetchFiles" />
  </div>
  <div class="list-container">
    <ListFile ref="fileList" />
  </div>
    
  </div>
</template>

<script>
import UploadFile from "./components/UploadFile.vue";
import ListFile from "./components/ListFile.vue";

export default {
  components: {
    UploadFile,
    ListFile,
  },
  methods: {
    fetchFiles() {
      this.$refs.fileList.fetchFiles();
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  padding: 1rem; 
}

.title-container {
  margin-top: 2rem; 
  margin-bottom: 2rem; 
}

.upload-container {
  margin-bottom: 2rem; 
}

.list-container {
  margin-top: 2rem; 
}
</style>