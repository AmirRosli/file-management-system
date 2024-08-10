  <template>
    <div>
      <form @submit.prevent="onUpdate" enctype="multipart/form-data">
        <div>
            <input type="file" @change="onFileChange" />
        </div>
        <div>
            <input type="text" v-model="state.newFileName" placeholder="New file name" />
            <button type="submit">Update</button>
        </div>
      </form>
      <div v-if="state.updateStatus">{{ state.updateStatus }}</div>
    </div>
  </template>
  
  <script>
  import { reactive } from "vue";
  import axios from "axios";
  
  export default {
    props: ["fileId"],
    setup(props, { emit }) {
      const state = reactive({
        selectedFile: null,
        newFileName: "",
        updateStatus: "",
      });
  
      const onFileChange = (event) => {
        state.selectedFile = event.target.files[0];
      };
  
      const onUpdate = async () => {
        const formData = new FormData();
        if (state.selectedFile) formData.append("file", state.selectedFile);
        formData.append("filename", state.newFileName);
  
        try {
          const response = await axios.put(`http://localhost:5000/api/files/${props.fileId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          state.updateStatus = "File updated successfully!";
          emit("file-updated", response.data);
        } catch (error) {
          state.updateStatus = "File update failed. Please try again.";
          console.error("Error during file update:", error.response ? error.response.data : error.message);
        }
      };
  
      return { state, onFileChange, onUpdate };
    },
  };
  </script>

  