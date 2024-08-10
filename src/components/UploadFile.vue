<template>
    <div class="upload-file">
      <form @submit.prevent="uploadFile" enctype="multipart/form-data">
        <div class="form-group">
          <label for="file-upload">Upload a File</label>
          <input
            type="file"
            id="file-upload"
            @change="onSelect"
          />
        </div>
        <div class="form-group">
          <button type="submit">Upload</button>
        </div>
        <div v-if="message" class="message">
          <h5>{{ message }}</h5>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "UploadFile",
    data() {
      return {
        selectedFile: null,
        message: "",
      };
    },
    methods: {
      onSelect(event) {
        this.selectedFile = event.target.files[0];
      },
      async uploadFile() {
        if (!this.selectedFile) {
          this.message = "Please select a file.";
          return;
        }
  
        const formData = new FormData();
        formData.append("file", this.selectedFile);
  
        try {
          const response = await axios.post('http://localhost:5000/api/upload', formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.message = "File uploaded successfully!";
          this.selectedFile = null;
          this.$emit("file-uploaded", response.data);
        } catch (error) {
          console.error("Error uploading file:", error);
          this.message = "Failed to upload file.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .upload-file {
    max-width: 500px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  input[type="file"] {
    display: block;
    width: 100%;
    padding: 0.5rem;
  }
  
  button {
    display: block;
    width: 50%;
    padding: 0.5rem;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .message {
    margin-top: 1rem;
    font-size: 1rem;
    color: #d9534f; 
  }
  
  .message h5 {
    margin: 15;
  }
  </style>