   <template>
    <div>
      <table>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Uploaded Time/Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.id">
            <td>{{ file.filename }}</td>
            <td>{{ new Date(file.created_at).toLocaleString() }}</td> 
            <td>
              <button @click="deleteFile(file.id)">Delete</button>
              <UpdateFile :fileId="file.id" @file-updated="onFileUpdated" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import UpdateFile from "./UpdateFile.vue";
  
  export default {
    components: { 
        UpdateFile,
     },
    data() {
      return {
        files: [],
      };
    },
    methods: {
      async fetchFiles() {
        try {
          const response = await axios.get("http://localhost:5000/api/files");
          this.files = response.data;
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      },
      async deleteFile(fileId) {
        try {
          await axios.delete(`http://localhost:5000/api/files/${fileId}`);
          this.files = this.files.filter(file => file.id !== fileId);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      },
      onFileUpdated(updatedFile) {
        const index = this.files.findIndex(file => file.id === updatedFile.id);
        if (index !== -1) {
          this.files[index] = updatedFile;
        }
      },
    },
    created() {
      this.fetchFiles();
    },
  };
  </script>
  
  <style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
    text-align: left;
  }
  
  button {
    margin-right: 5px;
  }
  </style>